// --- Navegación ---
function show(view) {
    document.getElementById('captura-view').classList.toggle('hidden', view !== 'captura');
    document.getElementById('dashboard-view').classList.toggle('hidden', view !== 'dashboard');
    if(view === 'dashboard') renderizarDashboard();
}

// --- Lógica OCR ---
const input = document.getElementById('ticketInput');
const output = document.getElementById('output');

input.addEventListener('change', async (e) => {
    output.innerText = "Analizando ticket...";
    const { data: { text } } = await Tesseract.recognize(e.target.files[0], 'spa');
    
    const esVirtual = text.includes('0800');
    const facturaMatch = text.match(/(?:0800|0929)\s+(\d{5})/);
    const precioMatch = text.match(/Total Contado\s+([\d,]+\.\d{2})/);

    const datosVenta = {
        tipo: esVirtual ? 'Virtual' : 'Física',
        factura: facturaMatch ? facturaMatch[1] : 'N/A',
        precio: precioMatch ? parseFloat(precioMatch[1].replace(/,/g, '')) : 0
    };

    output.innerHTML = `
        <div class="space-y-2">
            <p><strong>Tienda:</strong> ${datosVenta.tipo}</p>
            <p><strong>Factura:</strong> ${datosVenta.factura}</p>
            <p><strong>Total:</strong> $${datosVenta.precio}</p>
            <button onclick='guardarVenta(${JSON.stringify(datosVenta)})' class="w-full bg-green-600 p-2 rounded mt-4">Confirmar y Guardar</button>
        </div>
    `;
});

// --- Base de Datos y Dashboard ---
function guardarVenta(datos) {
    let ventas = JSON.parse(localStorage.getItem('ventas') || '[]');
    ventas.push(datos);
    localStorage.setItem('ventas', JSON.stringify(ventas));
    alert('Venta guardada!');
}

function renderizarDashboard() {
    const ventas = JSON.parse(localStorage.getItem('ventas') || '[]');
    document.getElementById('total-ventas').innerText = ventas.length;
    document.getElementById('total-dinero').innerText = '$' + ventas.reduce((a, b) => a + b.precio, 0);
    
    // Gráfica
    const ctx = document.getElementById('miGrafica').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Virtual', 'Física'],
            datasets: [{
                label: 'Ventas por Canal',
                data: [ventas.filter(v => v.tipo === 'Virtual').length, ventas.filter(v => v.tipo === 'Física').length],
                backgroundColor: ['#3b82f6', '#10b981']
            }]
        }
    });
}
