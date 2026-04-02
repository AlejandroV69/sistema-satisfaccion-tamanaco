import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/layout/Navbar";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        {/* Solo cargamos el Navbar para probarlo */}
        <Navbar />

        <div className="p-20 text-center">
          <h1 className="text-2xl text-slate-400 font-serif italic">
            Vista previa del Layout - Hotel Tamanaco
          </h1>
          <p className="text-slate-400 mt-2">Las demás páginas están desactivadas temporalmente.</p>
        </div>
      </div>
    </Router>
  );
}

export default App;