import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Star, 
  PieChart as PieChartIcon,
  Activity,
  ArrowUpRight,
  ClipboardCheck,
  Hotel,
  UtensilsCrossed,
  Map,
  ConciergeBell,
  ChevronDown,
  Download
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabaseClient';
import Loader from '../components/ui/Loader';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area
} from 'recharts';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
};

const Stats = () => {
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [serviceStats, setServiceStats] = useState([]);
  const [globalMetrics, setGlobalMetrics] = useState({ avg: 0, total: 0, surveys: 0 });
  const [dateFilter, setDateFilter] = useState('all'); // '7', '30', 'all'
  const [serviceFilter, setServiceFilter] = useState('all');

  useEffect(() => {
    fetchAllStats();
  }, [dateFilter]);

  const fetchAllStats = async () => {
    try {
      setLoading(true);
      
      const { data: cats, error: catsErr } = await supabase.from('categorias_servicio').select('*');
      if (catsErr) throw catsErr;
      setCategories(cats || []);

      let query = supabase
        .from('respuesta_detalle')
        .select(`
          puntuacion,
          id_encuesta,
          preguntas!inner (
            id_preguntas,
            texto_pregunta,
            categoria_id
          ),
          encuestas_realizadas!inner (
            fecha_encuesta,
            comentarios,
            puntuacion_final,
            huespedes (
              num_habitacion,
              nombre_completo
            )
          )
        `);

      if (dateFilter !== 'all') {
        const days = parseInt(dateFilter);
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - days);
        query = query.gte('encuestas_realizadas.fecha_encuesta', dateLimit.toISOString());
      }

      const { data: responses, error: respErr } = await query;
      if (respErr) throw respErr;

      const safeResponses = responses || [];
      
      // Global Metrics
      const totalResponses = safeResponses.length;
      const uniqueSurveys = new Set(safeResponses.map(r => r.id_encuesta)).size;
      const globalAvg = totalResponses > 0 
        ? (safeResponses.reduce((acc, r) => acc + r.puntuacion, 0) / totalResponses).toFixed(1)
        : 0;

      setGlobalMetrics({
        avg: globalAvg,
        total: totalResponses,
        surveys: uniqueSurveys
      });

      // Calculate Stats per Service
      const stats = cats.map(cat => {
        const catResponses = safeResponses.filter(r => r.preguntas.categoria_id === cat.id_servicio);
        const avg = catResponses.length > 0 
          ? (catResponses.reduce((acc, r) => acc + r.puntuacion, 0) / catResponses.length).toFixed(1)
          : 0;

        const questionMap = {};
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        const trendMap = {};
        const comments = [];
        const seenSurveys = new Set();

        catResponses.forEach(r => {
          // Questions
          const qName = r.preguntas.texto_pregunta;
          if (!questionMap[qName]) questionMap[qName] = { name: qName, total: 0, count: 0 };
          questionMap[qName].total += r.puntuacion;
          questionMap[qName].count++;

          // Distribution
          const score = Math.round(r.puntuacion);
          if (distribution[score] !== undefined) distribution[score]++;

          // Comments
          if (r.encuestas_realizadas.comentarios && !seenSurveys.has(r.id_encuesta)) {
            comments.push({
              room: r.encuestas_realizadas.huespedes?.num_habitacion || 'N/A',
              guest: r.encuestas_realizadas.huespedes?.nombre_completo || 'Anónimo',
              text: r.encuestas_realizadas.comentarios,
              score: r.encuestas_realizadas.puntuacion_final,
              date: r.encuestas_realizadas.fecha_encuesta
            });
            seenSurveys.add(r.id_encuesta);
          }

          // Trend
          const date = new Date(r.encuestas_realizadas.fecha_encuesta).toLocaleDateString();
          if (!trendMap[date]) trendMap[date] = { date, total: 0, count: 0 };
          trendMap[date].total += r.puntuacion;
          trendMap[date].count++;
        });

        const questionsData = Object.values(questionMap).map((q, idx) => ({ 
          name: q.name, 
          short: (idx + 1).toString(), 
          score: (q.total / q.count).toFixed(1) 
        }));

        return {
          id: cat.id_servicio,
          name: cat.nombre_servicio,
          avg,
          total: catResponses.length,
          responsesCount: seenSurveys.size,
          questions: questionsData,
          recentComments: comments.sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 3),
          improvements: questionsData.filter(q => q.score < 3.8).slice(0, 3),
          pie: [
            { name: 'Exc', value: distribution[5], color: '#C5A02D' },
            { name: 'Bue', value: distribution[4], color: '#D4AF37' },
            { name: 'Reg', value: distribution[3], color: '#E5C158' },
            { name: 'Baj', value: distribution[2], color: '#F1D27C' },
            { name: 'Cri', value: distribution[1], color: '#F9E4A0' }
          ].filter(d => d.value > 0),
          trend: Object.values(trendMap).sort((a,b) => new Date(a.date) - new Date(b.date)).map(d => ({ name: d.date, score: (d.total/d.count).toFixed(1) })).slice(-5)
        };
      });

      setServiceStats(stats);

    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (name) => {
    const n = (name || '').toLowerCase();
    if (n.includes('recep')) return <ConciergeBell size={24} />;
    if (n.includes('habit')) return <Hotel size={24} />;
    if (n.includes('rest')) return <UtensilsCrossed size={24} />;
    if (n.includes('area')) return <Map size={24} />;
    return <Star size={24} />;
  };

  const renderServiceChart = (service) => {
    // Determine the chart type based on the stable service ID so it doesn't change on filter
    const chartType = (parseInt(service.id, 10) || 0) % 3; 

    if (chartType === 0) {
      const barWidth = serviceFilter === 'all' ? 30 : 60;
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={service.questions} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
            <XAxis dataKey="short" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#cbd5e1', fontWeight: 600 }} />
            <YAxis hide domain={[0, 5]} />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={barWidth}>
              {service.questions.map((entry, i) => (
                <Cell key={i} fill="#C5A02D" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 1) {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={service.trend.length > 0 ? service.trend : [{name: 'Sin datos', score: 0}]} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`color-${service.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C5A02D" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#C5A02D" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#cbd5e1', fontWeight: 600 }} />
            <YAxis hide domain={[0, 5]} />
            <Tooltip />
            <Area type="monotone" dataKey="score" stroke="#C5A02D" fillOpacity={1} fill={`url(#color-${service.id})`} strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={service.pie}
            cx="50%"
            cy="50%"
            innerRadius={serviceFilter === 'all' ? 60 : 100}
            outerRadius={serviceFilter === 'all' ? 80 : 130}
            paddingAngle={5}
            dataKey="value"
          >
            {service.pie.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  if (loading) return <Loader fullPage message="Generando Reporte Maestro..." />;

  const filteredServices = serviceStats.filter(s => serviceFilter === 'all' || String(s.id) === String(serviceFilter));

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24">
      {/* Header Corporativo */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 no-print pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-[1px] bg-accent"></span>
            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-accent">Inteligencia de Negocio</span>
          </div>
          <h1 className="text-5xl font-serif text-slate-900">Resumen Gerencial</h1>
          <p className="text-slate-500 mt-2 text-lg">Estado global de la satisfacción y calidad en Hotel Tamanaco.</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="relative group">
            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-2xl px-6 py-3.5 pr-14 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-accent/5 transition-all shadow-sm group-hover:border-accent/40"
            >
              <option value="all">Todo el Histórico</option>
              <option value="7">Últimos 7 Días</option>
              <option value="30">Últimos 30 Días</option>
            </select>
            <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-accent" />
          </div>

          <div className="relative group">
            <select 
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-2xl px-6 py-3.5 pr-14 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-accent/5 transition-all shadow-sm group-hover:border-accent/40"
            >
              <option value="all">Todos los Servicios</option>
              {categories.map(cat => (
                <option key={cat.id_servicio} value={String(cat.id_servicio)}>{cat.nombre_servicio}</option>
              ))}
            </select>
            <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-accent" />
          </div>
        </div>
      </header>

      {/* KPIs Principales - Estilo exacto del mockup */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Promedio del Servicio', value: globalMetrics.avg, icon: Star },
          { label: 'Respuestas Totales', value: globalMetrics.surveys, icon: Users },
          { label: 'Tasa de Referencia', value: '94%', icon: TrendingUp }
        ].map((kpi, kidx) => (
          <div key={kidx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[160px]">
             <div className="w-12 h-12 bg-[#faf9f6] rounded-2xl flex items-center justify-center text-[#C5A02D] mb-4">
                <kpi.icon size={22} strokeWidth={2} />
             </div>
             <div>
                <p className="text-[14px] font-medium text-slate-500 mb-1 leading-snug">{kpi.label}</p>
                <h3 className="text-[42px] font-serif justify-self-end text-slate-900 leading-none">{kpi.value}</h3>
             </div>
          </div>
        ))}
      </div>

      {/* Grid de Servicios - 2x2 o Full Width */}
      <div className={`grid grid-cols-1 ${serviceFilter === 'all' ? 'lg:grid-cols-2' : ''} gap-8 mb-12`}>
        {filteredServices.map((service) => (
          <Card 
            key={service.id} 
            title={service.name} 
            icon={() => getServiceIcon(service.name)}
            className="hover:shadow-2xl transition-shadow duration-500 border-none bg-white shadow-xl shadow-slate-100"
            headerAction={<span className="text-xl font-black text-slate-800">{service.avg} <Star size={16} className="inline-block fill-[#C5A02D] text-[#C5A02D] mb-1" /></span>}
          >
            <div className={`${serviceFilter === 'all' ? 'h-[250px]' : 'h-[350px]'} w-full mt-4 transition-all duration-300`}>
              {service.total === 0 ? (
                <div className="h-full flex items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100 italic text-slate-400">Sin datos</div>
              ) : (
                renderServiceChart(service)
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Detalle de Preguntas Maestro - SECCIONADO POR SERVICIO (Estilo Exacto) */}
      <div className="space-y-8">
        {filteredServices.map((service, sidx) => (
          <div key={service.id} className="bg-white rounded-2xl border-t-4 border-t-[#C5A02D] shadow-sm p-6 md:p-10 border border-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${sidx * 150}ms` }}>
             
             <div className="mb-8">
                <h3 className="text-[26px] font-serif text-slate-900 font-bold tracking-tight">Detalle de Preguntas: {service.name}</h3>
             </div>

             <div className="bg-[#faf9f6]/60 rounded-xl border border-slate-100/80 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#f8f6f0]/50">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Pregunta</span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] w-24 text-center">Promedio</span>
                </div>
                
                <div className="divide-y divide-slate-100/70">
                  {service.questions.length === 0 ? (
                    <p className="p-10 text-center text-slate-400 italic font-serif text-sm">Sin datos para este departamento.</p>
                  ) : (
                    service.questions.map((q, qidx) => (
                      <div key={qidx} className="flex items-center justify-between px-6 py-5 hover:bg-white transition-colors duration-200">
                        <div className="flex items-center gap-5 mr-4">
                          <div className="flex-shrink-0 w-[34px] h-[34px] rounded-full bg-[#1e293b] flex items-center justify-center text-white text-[13px] font-bold shadow-sm">
                            {qidx + 1}
                          </div>
                          <p className="text-[15px] font-medium text-[#334155]">{q.name}</p>
                        </div>
                        <div className="flex-shrink-0 w-24 text-center text-[#C5A02D] font-bold text-xl">
                          {q.score}
                        </div>
                      </div>
                    ))
                  )}
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Footer Global con Feedback y Botón de Reporte */}
      <div className="flex flex-col gap-8 max-w-5xl mx-auto">
        
        <Card title="Comentario Destacado" className="p-10 shadow-xl shadow-slate-100">
          <div className="mt-2">
            {(() => {
              const allComments = filteredServices.flatMap(s => s.recentComments);
              if (allComments.length === 0) return <p className="text-slate-400 italic">No hay comentarios para mostrar.</p>;
              const com = allComments[0]; // Solo muestra el primer comentario general
              return (
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 relative group transition-all">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{com.guest} • Habitación {com.room}</span>
                  <div className="flex text-[#C5A02D] gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={18} 
                        fill={i < com.score ? "#C5A02D" : "none"} 
                        className={i < com.score ? "text-[#C5A02D]" : "text-slate-300"} 
                        strokeWidth={i < com.score ? 0 : 2} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-slate-700 font-serif italic text-xl leading-relaxed">"{com.text}"</p>
              </div>
              );
            })()}
          </div>
        </Card>

        <Card title="Puntos Críticos (Atención Prioritaria)" className="p-10 border-t-4 border-l-[0px] border-t-red-500 shadow-xl shadow-slate-100">
          <p className="text-sm text-slate-400 mb-8 font-medium">Las evaluaciones con el promedio más bajo en todo el hotel que requieren revisión urgente.</p>
          <div className="space-y-4">
             {(() => {
                 // Extraer todas las preguntas de los servicios visibles y ordenarlas globalmente por peor puntaje
                 const allQuestions = filteredServices.flatMap(s => 
                    s.questions.map(q => ({ ...q, serviceName: s.name }))
                 );
                 const worstQuestions = allQuestions.sort((a, b) => parseFloat(a.score) - parseFloat(b.score)).slice(0, 5);
                 
                 if (worstQuestions.length === 0) return <p className="text-slate-400 italic font-serif">Aún no hay suficientes datos registrados.</p>;
                 
                 return worstQuestions.map((q, iidx) => (
                   <div key={iidx} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-red-50/40 rounded-2xl border border-red-100/50 group hover:bg-red-50 hover:border-red-200 transition-all shadow-sm">
                     <div className="flex gap-4 items-center">
                       <div className="w-10 h-10 rounded-full bg-white flex flex-col items-center justify-center border border-red-100 shadow-sm text-red-500">
                         <span className="text-[10px] font-black uppercase tracking-widest leading-none">Sat</span>
                         <span className="text-sm font-black leading-none">{q.score}</span>
                       </div>
                       <div>
                         <p className="text-[15px] font-bold text-slate-800 line-clamp-2 md:line-clamp-1 max-w-lg mb-1">{q.name}</p>
                         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{q.serviceName}</p>
                       </div>
                     </div>
                     <span className="flex-shrink-0 self-start md:self-auto text-[10px] font-black text-red-600 uppercase tracking-[0.2em] px-4 py-2 bg-white rounded-full border border-red-200 shadow-sm ml-14 md:ml-0">
                       Revisar
                     </span>
                   </div>
                 ));
             })()}
          </div>
        </Card>

        <div className="no-print mt-8 flex flex-col items-center">
          <Button 
            variant="accent" 
            className="w-full md:w-auto md:min-w-[400px] py-6 bg-[#C5A02D] hover:bg-slate-900 text-white shadow-2xl shadow-accent/20 rounded-full font-black tracking-[0.2em] uppercase flex items-center justify-center gap-4 group transition-all duration-300 overflow-hidden relative"
            onClick={() => window.print()}
          >
            <div className="absolute inset-0 bg-slate-900 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative z-10 flex items-center justify-center gap-3 w-full">
              <Download size={20} />
              Exportar Reporte
            </span>
          </Button>
          <p className="text-[11px] text-slate-400 text-center mt-6 font-bold uppercase tracking-[0.1em] italic leading-relaxed">
            Este reporte genera un documento legal y administrativo <br className="hidden md:block" /> consolidando todos los indicadores del Hotel Tamanaco.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Stats;
