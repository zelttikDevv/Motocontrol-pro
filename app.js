// --- Navegación entre vistas ---
function show(view) {
    document.getElementById('captura-view').classList.toggle('hidden', view !== 'captura');
    document.getElementById('dashboard-view').classList.toggle('hidden', view !== 'dashboard');
    if(view === 'dashboard') renderizarDashboard();
}

// --- Lógica OCR Profesional ---
const input = document.getElementById('ticketInput');
const output = document.getElementById('output');

input.addEventListener('change', async (e) => {
    if (!e.target.files[0]) return;
    
    output.innerHTML = "<p class='text-yellow-400 animate-pulse'>Procesando ticket...</p>";
    
    try {
        const worker = await Tesseract.createWorker('spa');
        const { data: { text } } = await worker.recognize(e.target.files[0]);
        await worker.terminate();

        // --- REGEX DEFINITIVOS ---
        
        // 1. Factura: Busca números de 6 dígitos después de "Factura No."
        const facturaMatch = text.match(/Factura No\.\s*(?:0800|0929)?\s*(\d{6})/i);
        
        // 2. SKU: Busca la línea que empieza por 6 dígitos, seguida por un espacio y un "1"
        // Esto ignora el número de factura porque la factura no tiene un "1" inmediatamente después.
        const skuMatch = text.match(/^\s*(\d{6})\s+1\s+/m);
        
        // 3. Precio: Busca el último monto al final del ticket
        const precioMatch = text.match(/Total Contado\s+([\d,]+\.\d{2})/i);
        
        // 4. Vendedor: Busca "Vend:" seguido de números
        const vendedorMatch = text.match(/Vend[:\.]?\s*(\d+)/i);

        const datosVenta = {
            tipo: text.includes('0800') ? 'Virtual' : 'Física',
            factura: facturaMatch ? facturaMatch[1] : 'N/A',
            sku: skuMatch ? skuMatch[1] : 'N/A',
            vendedor: vendedorMatch ? vendedorMatch[1] : 'N/A',
            precio: precioMatch ? parseFloat(precioMatch[1].replace(/,/g, '')) : 0
        };

        output.innerHTML = `
            <div class="space-y-2 mt-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
                <h3 class="font-bold text-lg mb-2">Datos Detectados:</h3>
                <p><strong>Tienda:</strong> ${datosVenta.tipo}</p>
                <p><strong>Factura:</strong> ${datosVenta.factura}</p>
                <p><strong>SKU:</strong> ${datosVenta.sku}</p>
                <p><strong>Vendedor:</strong> ${datosVenta.vendedor}</p>
                <p><strong>Total:</strong> $${datosVenta.precio.toLocaleString()}</p>
                <button onclick='guardarVenta(${JSON.stringify(datosVenta)})' 
                        class="w-full bg-green-600 hover:bg-green-500 py-2 rounded-lg font-bold mt-2">
                    Confirmar y Guardar
                </button>
            </div>
        `;
    } catch (error) {
        output.innerHTML = `<p class='text-red-500'>Error de lectura: ${error.message}</p>`;
    }
});

// --- Base de Datos Local ---
function guardarVenta(datos) {
    let ventas = JSON.parse(localStorage.getItem('ventas') || '[]');
    ventas.push(datos);
    localStorage.setItem('ventas', JSON.stringify(ventas));
    alert('¡Venta registrada con éxito!');
    output.innerHTML = "";
    input.value = "";
}

// --- Dashboard ---
function renderizarDashboard() {
    const ventas = JSON.parse(localStorage.getItem('ventas') || '[]');
    document.getElementById('total-ventas').innerText = ventas.length;
    document.getElementById('total-dinero').innerText = '$' + ventas.reduce((a, b) => a + b.precio, 0).toLocaleString();
    
    const ctx = document.getElementById('miGrafica').getContext('2d');
    if (window.miGraficaInstancia) window.miGraficaInstancia.destroy();
    
    window.miGraficaInstancia = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Virtual', 'Física'],
            datasets: [{
                label: 'Ventas por Canal',
                data: [ventas.filter(v => v.tipo === 'Virtual').length, ventas.filter(v => v.tipo === 'Física').length],
                backgroundColor: ['#3b82f6', '#10b981']
            }]
        },
        options: { responsive: true }
    });
}
