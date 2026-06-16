// app.js
const input = document.getElementById('ticketInput');
const output = document.getElementById('output');

input.addEventListener('change', async (e) => {
    output.innerText = "Analizando ticket...";
    
    const { data: { text } } = await Tesseract.recognize(e.target.files[0], 'spa');
    
    // Lógica de Coppel
    const esVirtual = text.includes('0800');
    const facturaMatch = text.match(/\d{5}$/m); // Regex para los 5 dígitos
    
    output.innerHTML = `
        <div class="space-y-2">
            <p><span class="text-slate-400">Tienda:</span> ${esVirtual ? 'Virtual (0800)' : 'Física (0929)'}</p>
            <p><span class="text-slate-400">Factura:</span> ${facturaMatch ? facturaMatch[0] : 'No detectada'}</p>
        </div>
    `;
});
