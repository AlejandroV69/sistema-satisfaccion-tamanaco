const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      <h1 className="text-5xl font-serif text-slate-800 mb-4">Bienvenido al Hotel Tamanaco</h1>
      <p className="text-xl text-slate-500 max-w-2xl">
        Su opinión es fundamental para mantener nuestra excelencia. 
        Por favor, tómese un momento para completar nuestra encuesta de satisfacción.
      </p>
      <button className="mt-8 bg-amber-600 text-white px-8 py-3 rounded-full font-bold hover:bg-amber-700 transition-all shadow-lg">
        Empezar Encuesta
      </button>
    </div>
  );
};
export default Dashboard;