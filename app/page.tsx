export default function Home() {
  return (
    <main className="min-h-screen p-12 bg-slate-950 text-white">
      <h1 className="text-5xl font-bold mb-8">MotoControl Pro</h1>
      <div className="grid grid-cols-2 gap-4">
        <a href="/captura" className="p-10 bg-blue-600 rounded-2xl text-center text-xl font-bold">
          Capturar Ticket
        </a>
        <a href="/dashboard" className="p-10 bg-slate-800 rounded-2xl text-center text-xl font-bold">
          Ver Dashboard
        </a>
      </div>
    </main>
  );
}
