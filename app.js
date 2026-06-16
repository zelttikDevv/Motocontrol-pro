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
    
    output.innerHTML = "<p class='text-yellow-400 animate-pulse'>Iniciando motor de lectura, espera unos segundos...</p>";
    
    try {
        // Inicializar el worker de Tesseract
        const worker = await Tesseract.createWorker('spa');
        output.innerText = "Analizando imagen...";
        
        const { data: { text } } = await worker.recognize(e.target.files[0]);
        await worker.terminate();
        
        // Lógica de Extracción Coppel
        const esVirtual = text.includes('0800');
        const facturaMatch = text.match(/(?:0800|0929)\s+(\d{5})/);
        const precioMatch = text.match(/Total Contado\s+([\d,]+\.\d{2})/);
        const skuMatch = text.match(/(\d{6})\s+1/);

        const datosVenta = {
            tipo: esVirtual ? 'Virtual' : 'Física',
            factura: facturaMatch ? facturaMatch[1] : 'N/A',
            precio: precioMatch ? parseFloat(precioMatch[1].replace(/,/g, '')) : 0,
            sku: skuMatch ? skuMatch[1] : 'N/A'
        };

        output.innerHTML = `
            <div class="space-y-3 mt-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
                <h3 class="font-bold text-lg">Ticket Detectado:</h3>
                <p><strong>Tienda:</strong> ${datosVenta.tipo}</p>
                <p><strong>Factura:</strong> ${datosVenta.factura}</p>
                <p><strong>SKU:</strong> ${datosVenta.sku}</p>
                <p><strong>Total:</strong> $${datosVenta.precio.toLocaleString()}</p>
                <button onclick='guardarVenta(${JSON.stringify(datosVenta)})' 
                        class="w-full bg-green-600 hover:bg-green-500 font-bold py-2 rounded-lg">
                    Confirmar y Guardar
                </button>
            </div>
        `;
    } catch (error) {
        output.innerHTML = `<p class='text-red-500'>Error de lectura: ${error.message}</p>`;
    }
});

// --- Base de Datos Local (Persistente) ---
function guardarVenta(datos) {
    let ventas = JSON.parse(localStorage.getItem('ventas') || '[]');
    ventas.push(datos);
    localStorage.setItem('ventas', JSON.stringify(ventas));
    alert('¡Venta registrada con éxito!');
    // Limpiar campos
    output.innerHTML = "";
    input.value = "";
}

// --- Dashboard y Gráficas ---
function renderizarDashboard() {
    const ventas = JSON.parse(localStorage.getItem('ventas') || '[]');
    document.getElementById('total-ventas').innerText = ventas.length;
    document.getElementById('total-dinero').innerText = '$' + ventas.reduce((a, b) => a + b.precio, 0).toLocaleString();
    
    // Configuración de Gráfica
    const ctx = document.getElementById('miGrafica').getContext('2d');
    
    // Si ya existe una gráfica, destruirla antes de crear otra
    if (window.miGraficaInstancia) window.miGraficaInstancia.destroy();
    
    window.miGraficaInstancia = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Virtual (0800)', 'Física (0929)'],
            datasets: [{
                label: 'Ventas por Canal',
                data: [
                    ventas.filter(v => v.tipo === 'Virtual').length, 
                    ventas.filter(v => v.tipo === 'Física').length
                ],
                backgroundColor: ['#3b82f6', '#10b981']
            }]
        },
        options: { responsive: true }
    });
}
