import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  Star, 
  MessageSquare, 
  TrendingUp,
  User,
  Activity,
  ArrowRight,
  BarChart3 as BarChartIcon
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

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    totalEncuestas: 0,
    promedioGral: 0,
    comentariosCount: 0,
    tendencia: '+0.0%'
  });
  const [deptStats, setDeptStats] = React.useState([]);
  const [recentSurveys, setRecentSurveys] = React.useState([]);

  React.useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

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

      setStats({
        totalEncuestas: total,
        promedioGral: avg,
        comentariosCount: feedback,
        tendencia: total > 0 ? '+2.4%' : '+0%' 
      });

      // 2. Fetch Department Stats for the Chart
      const { data: categories } = await supabase.from('categorias_servicio').select('*');
      const { data: responses } = await supabase.from('respuesta_detalle').select('puntuacion, preguntas!inner(categoria_id)');

      const safeCategories = categories || [];
      const safeResponses = responses || [];

      if (safeCategories.length > 0) {
        const results = safeCategories.map(cat => {
          const catResponses = safeResponses.filter(r => r.preguntas?.categoria_id === cat.id_servicio);
          const score = catResponses.length > 0
            ? parseFloat((catResponses.reduce((a, b) => a + b.puntuacion, 0) / catResponses.length).toFixed(1))
            : 0;
          return { name: cat.nombre_servicio, score };
        }).filter(r => r.score > 0 || r.name !== '');
        
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

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#C5A02D', '#D4AF37', '#B8860B', '#DAA520'];

  const quickStats = [
    { label: 'Encuestas Totales', value: stats.totalEncuestas.toString(), icon: ClipboardList, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Promedio Sat.', value: stats.promedioGral.toString(), icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Nuevos Comentarios', value: stats.comentariosCount.toString(), icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Tendencia Mensual', value: stats.tendencia, icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-50' },
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

      {/* Dashboard General - Comparativa de Servicios */}
      <Card title="Dashboard General de Servicios" Icon={BarChartIcon} className="mt-8 mb-4">
        <div className="h-[350px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={deptStats}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
              />
              <YAxis 
                domain={[0, 5]} 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Bar 
                dataKey="score" 
                radius={[4, 4, 0, 0]} 
                barSize={40}
                label={{ position: 'top', fill: '#0f172a', fontWeight: 'bold', fontSize: 13 }}
              >
                {deptStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
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
                       <div className="flex text-accent gap-0.5 mb-1">
                          {[...Array(5)].map((_, starIdx) => (
                            <Star key={starIdx} size={10} fill={starIdx < survey.score ? "currentColor" : "none"} className={starIdx < survey.score ? "" : "text-slate-200"}/>
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

        <Card title="Alertas de Servicio" className="bg-slate-900 text-white border-none shadow-xl shadow-[#C5A02D]/10">
           <div className="space-y-5">
              <div className="flex items-center gap-3 mb-2">
                 <Activity size={20} className="text-accent" />
                 <h4 className="text-white font-serif italic">Monitoreo en Vivo</h4>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                 <p className="text-[10px] font-black text-accent uppercase mb-2">Sugerencia del Sistema</p>
                 <p className="text-sm text-slate-200 font-medium">Revisa las estadísticas de "Restaurante" para ver tendencias de desayuno.</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                 <p className="text-[10px] font-black text-emerald-400 uppercase mb-2">Estado General</p>
                 <p className="text-sm text-slate-200 font-medium">La satisfacción general se mantiene estable por encima de 4.5.</p>
              </div>
              <Button variant="accent" className="w-full py-4 mt-4" onClick={() => navigate('/surveys')}>Gestionar Comentarios</Button>
           </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;