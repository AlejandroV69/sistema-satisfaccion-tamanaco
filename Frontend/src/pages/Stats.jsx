import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Star, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight
} from 'lucide-react';
import Card from '../components/ui/Card';
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
  Cell 
} from 'recharts';

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


const Stats = () => {
  const { serviceId } = useParams();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState([]);
  const [comments, setComments] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [serviceName, setServiceName] = useState('Cargando...');

  const serviceSlugs = {
    'recepcion': 'Recepción',
    'habitaciones': 'Habitaciones',
    'restaurante': 'Restaurante',
    'areas-comunes': 'Áreas Comunes'
  };

  React.useEffect(() => {
    fetchServiceStats();
  }, [serviceId]);

  const fetchServiceStats = async () => {
    try {
      setLoading(true);
      
      const { data: allCategories, error: catError } = await supabase
        .from('categorias_servicio')
        .select('*');

      if (catError) throw catError;

      const targetLabel = serviceSlugs[serviceId] || 'Vista General';
      const normalize = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const targetNormalized = normalize(targetLabel);
      
      const category = (allCategories || []).find(c => 
        normalize(c.nombre_servicio).includes(targetNormalized)
      );

      if (!category) {
        setServiceName(targetLabel);
        setLoading(false);
        return;
      }

      setServiceName(category.nombre_servicio);
      const categoryId = category.id_servicio;

      const { data: responses, error: respError } = await supabase
        .from('respuesta_detalle')
        .select(`
          puntuacion,
          preguntas!inner (
            texto_pregunta,
            categoria_id
          )
        `)
        .eq('preguntas.categoria_id', categoryId);

      if (respError) throw respError;

      const safeResponses = responses || [];
      const questionMap = {};
      safeResponses.forEach(r => {
        const qName = r.preguntas?.texto_pregunta;
        if (!qName) return;
        if (!questionMap[qName]) {
          questionMap[qName] = { name: qName, total: 0, count: 0 };
        }
        questionMap[qName].total += (r.puntuacion || 0);
        questionMap[qName].count += 1;
      });

      const breakdown = Object.values(questionMap).map((q, idx) => ({
        name: q.name,
        shortName: (idx + 1).toString(),
        score: parseFloat((q.total / q.count).toFixed(1))
      }));

      setChartData(breakdown);

      const totalResponses = safeResponses.length;
      const avgScore = totalResponses > 0
        ? (safeResponses.reduce((acc, r) => acc + (r.puntuacion || 0), 0) / totalResponses).toFixed(1)
        : 0;

      const { data: surveyComments } = await supabase
        .from('encuestas_realizadas')
        .select(`
          comentarios,
          puntuacion_final,
          fecha_encuesta,
          huespedes (num_habitacion),
          respuesta_detalle!inner(preguntas!inner(categoria_id))
        `)
        .eq('respuesta_detalle.preguntas.categoria_id', categoryId)
        .not('comentarios', 'is', null)
        .neq('comentarios', '')
        .order('fecha_encuesta', { ascending: false })
        .limit(5);

      setComments((surveyComments || []).map(c => ({
        room: c.huespedes?.num_habitacion || 'N/A',
        text: c.comentarios,
        score: Math.round(c.puntuacion_final || 5)
      })));

      setMetrics([
        { label: 'Promedio del Servicio', value: avgScore.toString(), icon: Star, trend: '+0%', up: true },
        { label: 'Respuestas Totales', value: totalResponses.toString(), icon: Users, trend: '+0%', up: true },
        { label: 'Tasa de Referencia', value: '94%', icon: TrendingUp, trend: '+0%', up: true }
      ]);

    } catch (error) {
      console.error('Error fetching service stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullPage message="Analizando datos de servicio..." />;

  // Helper colors for top questions
  const getScoreColor = (score) => {
    if (score >= 4.5) return 'text-emerald-600 bg-emerald-50';
    if (score >= 3.5) return 'text-amber-600 bg-amber-50';
    return 'text-rose-600 bg-rose-50';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-1 bg-accent rounded-full"></div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C5A02D]">Análisis de Servicio</span>
        </div>
        <h1 className="text-3xl font-serif text-slate-900">{serviceName}</h1>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((stat, idx) => (
          <Card key={idx}>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 rounded-2xl text-[#C5A02D]">
                <stat.icon size={24} />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Main Vertical Chart Card */}
        <Card title="Satisfacción por Pregunta" icon={BarChart3}>
          <div className="h-[450px] w-full mt-6">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center bg-slate-50 rounded-2xl">
                <p className="text-slate-400 font-serif italic">No hay datos suficientes para generar el gráfico</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                data={chartData}
                layout={isMobile ? 'vertical' : 'horizontal'}
                margin={isMobile
                  ? { top: 5, right: 40, left: 10, bottom: 5 }
                  : { top: 20, right: 30, left: 10, bottom: 20 }
                }
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"
                  vertical={!isMobile}
                  horizontal={isMobile}
                />
                {isMobile ? (
                  <>
                    <XAxis type="number" domain={[0, 5]} ticks={[1,2,3,4,5]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis type="category" dataKey="shortName" width={35} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} />
                  </>
                ) : (
                  <>
                    <XAxis dataKey="shortName" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} />
                    <YAxis domain={[0, 5]} ticks={[1,2,3,4,5]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  </>
                )}
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-4 shadow-xl rounded-xl border border-slate-100 max-w-xs transition-all animate-in fade-in zoom-in duration-200">
                            <p className="text-xs font-bold text-[#C5A02D] uppercase tracking-widest mb-1 flex items-center gap-2">
                              Item {payload[0].payload.shortName}
                            </p>
                            <p className="text-sm text-slate-700 font-medium leading-relaxed mb-2">
                              {payload[0].payload.name}
                            </p>
                            <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
                              <span className="text-xs font-bold text-slate-400 uppercase">Puntuación:</span>
                              <span className="text-sm font-bold text-slate-900">{payload[0].value} / 5.0</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="score" 
                    radius={[4, 4, 0, 0]} 
                    barSize={40}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#C5A02D' : '#D4AF37'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Detailed Question Reference Table */}
        <Card title="Detalle de Preguntas" className="border-t-4 border-t-[#C5A02D]">
          <div className="overflow-hidden rounded-xl border border-slate-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Pregunta</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Promedio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {chartData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-bold text-white mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-slate-700 font-medium leading-relaxed">{item.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-bold ${getScoreColor(item.score)}`}>
                        {item.score}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Comentarios Recientes">
          <div className="space-y-4">
            {comments.map((comment, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-bold text-slate-700">Hab. {comment.room}</span>
                  <div className="flex text-accent gap-0.5">
                    {[...Array(5)].map((_, sIdx) => (
                      <Star key={sIdx} size={12} fill={sIdx < comment.score ? "currentColor" : "none"} className={sIdx < comment.score ? "" : "text-slate-200"}/>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-600 italic">"{comment.text}"</p>
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
                <span className="ml-auto text-xs font-bold text-rose-500">Atención</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Stats;
