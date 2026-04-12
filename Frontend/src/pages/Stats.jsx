import React from 'react';
import { useParams } from 'react-router-dom';
import { BarChart3, TrendingUp, Users, Star, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Card from '../components/ui/Card';

const Stats = () => {
  const { serviceId } = useParams();

  const serviceNames = {
    'recepcion': 'Recepción',
    'habitaciones': 'Habitaciones',
    'restaurante': 'Restaurante',
    'areas-comunes': 'Áreas Comunes'
  };

  const currentService = serviceNames[serviceId] || 'Vista General';

  const metrics = [
    { label: 'Promedio General', value: '4.8', icon: Star, trend: '+2.4%', up: true },
    { label: 'Encuestas Recibidas', value: '1,248', icon: Users, trend: '+12%', up: true },
    { label: 'Tasa de Respuesta', value: '88.2%', icon: TrendingUp, trend: '-0.5%', up: false }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-1 bg-accent rounded-full"></div>
          <span className="text-xs font-bold uppercase tracking-widest text-accent">Análisis de Servicio</span>
        </div>
        <h1 className="text-3xl font-serif text-slate-900">{currentService}</h1>
        <p className="text-slate-500">Visualiza el rendimiento y la satisfacción mensual de este departamento.</p>
      </header>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 flex-grow lg:grid-cols-3 gap-6">
        {metrics.map((stat, idx) => (
          <Card key={idx} className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 rounded-2xl text-accent">
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${stat.up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Graph Placeholder */}
      <Card 
        title="Histórico de Satisfacción" 
        headerAction={<Button variant="outline" size="sm">Últimos 30 días</Button>}
      >
        <div className="aspect-[16/9] md:aspect-[21/9] w-full flex items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <div className="text-center text-slate-400">
            <BarChart3 size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-medium">Gráficos interactivos de {currentService}</p>
            <p className="text-xs">Los datos se están procesando para la visualización</p>
          </div>
        </div>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Comentarios Recientes">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl">
                 <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold text-slate-700">Hab. 40{i}</span>
                    <div className="flex text-accent"><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/></div>
                 </div>
                 <p className="text-sm text-slate-600 italic">"Excelente atención por parte de todo el equipo durante nuestra estancia."</p>
              </div>
            ))}
          </div>
        </Card>
        
        <Card title="Puntos de Mejora">
           <div className="space-y-3">
              {['Tiempos de espera', 'Variedad en desayuno', 'Mantenimiento AC'].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl">
                   <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                   <span className="text-sm font-medium text-slate-700">{item}</span>
                   <span className="ml-auto text-xs font-bold text-rose-500">Requiere Atención</span>
                </div>
              ))}
           </div>
        </Card>
      </div>
    </div>
  );
};

// Helper component used within this page
const Button = ({ children, variant, size, onClick }) => {
  const variants = {
    outline: 'border border-slate-200 text-slate-600 hover:bg-slate-50'
  };
  const sizes = {
    sm: 'px-3 py-1 text-xs font-bold'
  };
  return (
    <button className={`${variants[variant]} ${sizes[size]} rounded-lg transition-all`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Stats;

