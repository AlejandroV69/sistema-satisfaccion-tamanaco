import React from 'react';
import { ClipboardList, Star, MessageSquare, TrendingUp } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const quickStats = [
    { label: 'Encuestas Totales', value: '458', icon: ClipboardList, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Promedio Sat.', value: '4.7', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Nuevos Comentarios', value: '12', icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Tendencia Mensual', value: '+5.2%', icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif text-slate-900 mb-2">Panel de Control</h1>
          <p className="text-slate-500 text-lg">Bienvenido al sistema de gestión de satisfacción del Hotel Tamanaco.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/surveys')}>Ver Todas</Button>
          <Button variant="accent" onClick={() => window.open('/survey', '_blank')}>Abrir Encuesta Pública</Button>
        </div>
      </header>

      {/* Grid de Estadísticas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, idx) => (
          <Card key={idx} className="hover:translate-y-[-4px] transition-all duration-300">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card title="Estado por Departamento" className="lg:col-span-2">
          <div className="space-y-6 py-2">
            {[
              { name: 'Recepción', score: 92, count: 145 },
              { name: 'Habitaciones', score: 88, count: 132 },
              { name: 'Restaurante', score: 95, count: 98 },
              { name: 'Áreas Comunes', score: 84, count: 83 },
            ].map((dept, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-slate-700">{dept.name}</span>
                  <span className="text-sm font-bold text-accent">{dept.score}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent transition-all duration-1000" 
                    style={{ width: `${dept.score}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">{dept.count} encuestas este mes</p>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Alertas de Servicio" className="bg-slate-900 text-white border-none shadow-xl shadow-slate-200">
           <div className="space-y-5">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                 <p className="text-xs font-bold text-accent uppercase mb-2">Crítico</p>
                 <p className="text-sm text-slate-200 font-medium">Habitación 302 reporta problemas con el aire acondicionado.</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                 <p className="text-xs font-bold text-amber-400 uppercase mb-2">Advertencia</p>
                 <p className="text-sm text-slate-200 font-medium">Bajo puntaje persistente en la variedad del buffet matutino.</p>
              </div>
              <Button variant="accent" className="w-full py-4 mt-4">Atender Alertas</Button>
           </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;