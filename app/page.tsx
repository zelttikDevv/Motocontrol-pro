export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight mb-2">MotoControl <span className="text-blue-500">Pro</span></h1>
        <p className="text-slate-400">Panel de control de entregas Coppel</p>
      </div>

      <div className="grid gap-4 w-full max-w-md">
        <a href="/captura" className="group flex items-center justify-between p-6 bg-slate-900 border border-slate-700 rounded-2xl hover:border-blue-500 transition-all">
          <span className="text-xl font-bold">📸 Capturar Ticket</span>
          <span className="text-blue-500 group-hover:translate-x-2 transition-transform">→</span>
        </a>
        
        <a href="/dashboard" className="group flex items-center justify-between p-6 bg-slate-900 border border-slate-700 rounded-2xl hover:border-emerald-500 transition-all">
          <span className="text-xl font-bold">📊 Ver Dashboard</span>
          <span className="text-emerald-500 group-hover:translate-x-2 transition-transform">→</span>
        </a>
      </div>
    </main>
  );
}
