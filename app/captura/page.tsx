"use client";
import { useState } from 'react';
import Tesseract from 'tesseract.js';

export default function Captura() {
  const [ticketData, setTicketData] = useState({ factura: '', sku: '', tipo: '' });

  const processImage = async (e: any) => {
    const { data: { text } } = await Tesseract.recognize(e.target.files[0], 'spa');
    
    // Lógica para identificar tienda (0800 vs 0929)
    const tipoTienda = text.includes('0800') ? 'Virtual' : 'Física';
    const facturaMatch = text.match(/\d{9}/); // Busca número de 9 dígitos
    
    setTicketData({
      factura: facturaMatch ? facturaMatch[0] : 'No detectado',
      sku: 'Pendiente', 
      tipo: tipoTienda
    });
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Captura de Ticket</h1>
      <input type="file" onChange={processImage} className="block w-full text-sm mb-4" />
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
        <p>Factura detectada: {ticketData.factura}</p>
        <p>Tipo: {ticketData.tipo}</p>
      </div>
    </main>
  );
}
