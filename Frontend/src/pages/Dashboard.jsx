import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  Star, 
  MessageSquare, 
  TrendingUp,
  TrendingDown,
  User,
  Activity,
  ArrowRight,
  BarChart3 as BarChartIcon,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import { supabase } from '../lib/supabaseClient';

// Hook to detect mobile screen
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    totalEncuestas: 0,
    promedioGral: 0,
    comentariosCount: 0,
    tendencia: '+0.0%'
  });
  const [deptStats, setDeptStats] = React.useState([]);
  const [recentSurveys, setRecentSurveys] = React.useState([]);
  const [alerts, setAlerts] = React.useState([]);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch Global Summary and Recent Activity
      const { data: surveys, error: surveyError } = await supabase
        .from('encuestas_realizadas')
        .select(`
          id_encuesta,
          puntuacion_final,
          comentarios,
          fecha_encuesta,
          huespedes (
            nombre_completo,
            num_habitacion
          )
        `)
        .order('fecha_encuesta', { ascending: false });

      if (surveyError) throw surveyError;

      const safeSurveys = surveys || [];
      const total = safeSurveys.length;
      const avg = total > 0 
        ? (safeSurveys.reduce((acc, s) => acc + (s.puntuacion_final || 0), 0) / total).toFixed(1)
        : 0;
      const feedback = safeSurveys.filter(s => s.comentarios && s.comentarios.trim() !== '').length;

      // 2. Fetch Department Stats for the Chart & Detailed Trend
      const { data: categories } = await supabase.from('categorias_servicio').select('*');
      const { data: responses } = await supabase
        .from('respuesta_detalle')
        .select('puntuacion, id_encuesta, preguntas!inner(categoria_id, texto_pregunta, activa)');

      const safeCategories = categories || [];
      const safeResponses = responses || [];

      // Recalcular promedio desde respuestas individuales (más preciso, igual que Stats)
      const avgFromResponses = safeResponses.length > 0
        ? (safeResponses.reduce((acc, r) => acc + r.puntuacion, 0) / safeResponses.length).toFixed(1)
        : avg;

      // Calcular tendencia precisa agrupando respuestas por encuesta y ordenando por fecha
      let tendencia = 'N/D';
      const surveysWithDate = safeSurveys.filter(s => s.fecha_encuesta);
      if (surveysWithDate.length >= 2) {
        const sorted = [...surveysWithDate].sort((a, b) => new Date(a.fecha_encuesta) - new Date(b.fecha_encuesta));
        const mid = Math.floor(sorted.length / 2);
        const firstHalf = sorted.slice(0, mid);
        const secondHalf = sorted.slice(mid);

        // Obtener promedio exacto (con decimales crudos) para cada mitad usando respuesta_detalle
        const getExactAvg = (halfSurveys) => {
          const ids = new Set(halfSurveys.map(h => h.id_encuesta));
          const matchResp = safeResponses.filter(r => ids.has(r.id_encuesta));
          if (matchResp.length > 0) {
            return matchResp.reduce((acc, r) => acc + r.puntuacion, 0) / matchResp.length;
          }
          return halfSurveys.reduce((acc, s) => acc + (s.puntuacion_final || 0), 0) / halfSurveys.length;
        };

        const firstAvg = getExactAvg(firstHalf);
        const secondAvg = getExactAvg(secondHalf);

        if (firstAvg > 0) {
          const change = ((secondAvg - firstAvg) / firstAvg) * 100;
          tendencia = `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
        }
      } else if (surveysWithDate.length === 1) {
        tendencia = 'Primer reg.';
      }

      setStats({ 
        totalEncuestas: total,
        promedioGral: avgFromResponses,
        comentariosCount: feedback,
        tendencia 
      });

      if (safeCategories.length > 0) {
        const results = safeCategories.map(cat => {
          const catResponses = safeResponses.filter(r => r.preguntas?.categoria_id === cat.id_servicio);
          const puntuacionValue = catResponses.length > 0
            ? parseFloat((catResponses.reduce((a, b) => a + b.puntuacion, 0) / catResponses.length).toFixed(1))
            : 0;
          return { name: cat.nombre_servicio, puntuacion: puntuacionValue, id: cat.id_servicio };
        }).filter(r => r.puntuacion > 0);
        
        setDeptStats(results);
      }

      // 3. Transform recent surveys
      setRecentSurveys(safeSurveys.slice(0, 5).map(s => {
        const guestInfo = Array.isArray(s.huespedes) ? s.huespedes[0] : s.huespedes;
        return {
          id: s.id_encuesta,
          guest: guestInfo?.nombre_completo || 'Anónimo',
          room: guestInfo?.num_habitacion || 'N/A',
          score: s.puntuacion_final,
          date: s.fecha_encuesta ? new Date(s.fecha_encuesta).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) : 'N/A'
        };
      }));

      // 4. Calculate Critical Alerts (Bottom 2 Worst Questions)
      const questionMap = {};
      safeResponses.forEach(r => {
         const qText = r.preguntas?.texto_pregunta;
         const catId = r.preguntas?.categoria_id;
         if (!qText) return;
         if (!questionMap[qText]) questionMap[qText] = { name: qText, total: 0, count: 0, catId };
         questionMap[qText].total += r.puntuacion;
         questionMap[qText].count++;
      });
      const allQ = Object.values(questionMap).map(q => ({
         name: q.name,
         score: parseFloat((q.total / q.count).toFixed(1)),
         serviceName: safeCategories.find(c => c.id_servicio === q.catId)?.nombre_servicio || 'General'
      }));
      const worstQ = allQ.sort((a,b) => a.score - b.score).slice(0, 3);
      setAlerts(worstQ);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('No se pudieron cargar los datos del panel. Verifica tu conexión a Supabase e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#C5A02D', '#D4AF37', '#B8860B', '#DAA520'];

  const isPositive = stats.tendencia.startsWith('+');
  const isNegative = stats.tendencia.startsWith('-');

  const quickStats = [
    { label: 'Encuestas Totales', value: stats.totalEncuestas.toString(), icon: ClipboardList, color: 'text-blue-500', bg: 'bg-blue-50', valueColor: 'text-slate-900' },
    { label: 'Promedio Sat.', value: stats.promedioGral.toString(), icon: Star, color: 'text-amber-500', bg: 'bg-amber-50', valueColor: 'text-slate-900' },
    { label: 'Nuevos Comentarios', value: stats.comentariosCount.toString(), icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-50', valueColor: 'text-slate-900' },
    {
      label: 'Tendencia Histórica',
      value: stats.tendencia,
      icon: isNegative ? TrendingDown : TrendingUp,
      color: isNegative ? 'text-red-500' : isPositive ? 'text-emerald-500' : 'text-indigo-500',
      bg: isNegative ? 'bg-red-50' : isPositive ? 'bg-emerald-50' : 'bg-indigo-50',
      valueColor: isNegative ? 'text-red-500' : isPositive ? 'text-emerald-600' : 'text-slate-900',
    },
  ];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-red-50 text-red-400 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <AlertCircle size={36} />
        </div>
        <h2 className="text-2xl font-serif text-slate-900 mb-3">Error al cargar el panel</h2>
        <p className="text-slate-500 mb-8 max-w-md leading-relaxed">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-3 px-8 py-3.5 bg-[#C5A02D] text-white rounded-full font-bold hover:bg-slate-900 transition-all duration-300 shadow-lg shadow-amber-200"
        >
          <RefreshCw size={18} />
          Reintentar
        </button>
      </div>
    );
  }

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
            <h3 className={`text-3xl font-bold ${stat.valueColor || 'text-slate-900'}`}>{stat.value}</h3>
          </Card>
        ))}
      </div>

      {/* Dashboard General - Comparativa de Servicios */}
      <Card title="Dashboard General de Servicios" icon={BarChartIcon} className="mt-8 mb-4">
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={deptStats}
              layout={isMobile ? 'vertical' : 'horizontal'}
              margin={isMobile
                ? { top: 5, right: 50, left: 20, bottom: 5 }
                : { top: 20, right: 30, left: 10, bottom: 10 }
              }
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"
                vertical={!isMobile}
                horizontal={isMobile}
              />
              {isMobile ? (
                <>
                  <XAxis type="number" domain={[0, 5]} ticks={[1,2,3,4,5]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={110} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                </>
              ) : (
                <>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                  <YAxis domain={[0, 5]} ticks={[1,2,3,4,5]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                </>
              )}
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Bar 
                dataKey="puntuacion" 
                name="Puntuación"
                radius={isMobile ? [0, 4, 4, 0] : [4, 4, 0, 0]}
                barSize={isMobile ? 24 : 40}
                label={{ 
                  position: isMobile ? 'right' : 'top', 
                  fill: '#0f172a', 
                  fontWeight: 'bold', 
                  fontSize: 13 
                }}
              >
                {deptStats.map((entry, index) => {
                  let barColor = '#C5A02D'; // Dorado Premium (Excelente)
                  if (entry.puntuacion >= 4.0) barColor = '#C5A02D';
                  else if (entry.puntuacion >= 3.0) barColor = '#C5A059'; // Dorado apagado (Alerta Media)
                  else barColor = '#991B1B'; // Rojo elegante (Crítico)
                  
                  return <Cell key={`cell-${index}`} fill={barColor} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card 
          title="Actividad Reciente" 
          className="lg:col-span-2"
          headerAction={
            <Button variant="outline" size="sm" onClick={() => navigate('/surveys')}>
              Ver todas <ArrowRight size={14} className="ml-1" />
            </Button>
          }
        >
          <div className="divide-y divide-slate-50">
            {recentSurveys.length === 0 ? (
              <div className="py-12 text-center text-slate-400 italic font-serif">Aún no hay actividad registrada.</div>
            ) : (
              recentSurveys.map((survey, i) => (
                <div key={i} className="py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors rounded-xl px-2">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{survey.guest}</p>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Habitación {survey.room} • {survey.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                       <div className="flex gap-0.5 mb-1">
                          {[...Array(5)].map((_, starIdx) => (
                            <Star 
                              key={starIdx} 
                              size={10} 
                              fill={starIdx < survey.score ? "#C5A02D" : "none"} 
                              className={starIdx < survey.score ? "text-[#C5A02D]" : "text-slate-200"}
                              strokeWidth={starIdx < survey.score ? 0 : 2}
                            />
                          ))}
                        </div>
                        <p className="text-[10px] font-black text-slate-300 uppercase">Puntuación Final</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card title="Alertas de Servicio" className="shadow-xl shadow-slate-100 relative overflow-hidden group">
           <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                   <Activity size={16} />
                 </div>
                 <h4 className="text-slate-900 font-serif italic text-lg tracking-wide font-bold">Puntos Críticos Detectados</h4>
              </div>

              {alerts.length === 0 ? (
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <p className="text-sm text-slate-400 italic">No hay alertas críticas en este momento.</p>
                </div>
              ) : (
                alerts.map((alert, i) => (
                  <div key={i} className="p-4 sm:p-5 bg-red-50/50 rounded-2xl border border-red-100 hover:border-red-200 transition-colors relative overflow-hidden">
                     <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500 rounded-l-2xl"></div>
                     <div className="flex justify-between items-center mb-2 pl-2">
                       <p className="text-[10px] font-black text-red-600 uppercase tracking-widest bg-red-100 px-2 py-0.5 rounded">{alert.serviceName}</p>
                       <span className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                         Punt: {alert.score}
                       </span>
                     </div>
                     <p className="text-sm text-slate-800 font-bold leading-snug pl-2">{alert.name}</p>
                  </div>
                ))
              )}
           </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;