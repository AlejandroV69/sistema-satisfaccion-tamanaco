import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, Calendar, Hash, User, MapPin, Star } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';

const SurveyList = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      // Fetch surveys with guest info
      // Query assumes foreign key encuestas_realizadas.huesped_id -> huespedes.id_huesped
      const { data, error } = await supabase
        .from('encuestas_realizadas')
        .select(`
          id_encuesta,
          fecha_encuesta,
          puntuacion_final,
          comentarios,
          huespedes (
            nombre_completo,
            num_habitacion,
            email
          ),
          respuesta_detalle (
            puntuacion
          )
        `)
        .order('fecha_encuesta', { ascending: false });

      console.log("Raw survey data:", data);

      if (error) throw error;

      // Transform data to calculate average satisfaction
      const transformedData = data?.map(s => {
        // Handle array or object results from joins
        const guestInfo = Array.isArray(s.huespedes) ? s.huespedes[0] : s.huespedes;
        // Use pre-calculated score if available, otherwise calculate from details
        let score = s.puntuacion_final;
        if (score === null || score === undefined) {
          const details = Array.isArray(s.respuesta_detalle) ? s.respuesta_detalle : [];
          const scores = details.map(r => r.puntuacion || 0);
          score = scores.length > 0 
            ? (scores.reduce((a, b) => a + b, 0) / scores.length)
            : 0;
        }
        
        return {
          id: s.id_encuesta,
          room: guestInfo?.num_habitacion || 'N/A',
          guest: guestInfo?.nombre_completo || 'Anónimo',
          date: s.fecha_encuesta ? new Date(s.fecha_encuesta).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
          score: parseFloat(Number(score).toFixed(1)),
          email: guestInfo?.email || 'No email',
          comment: s.comentarios || 'Sin comentarios'
        };
      }) || [];

      setSurveys(transformedData);
    } catch (error) {
      console.error('Error fetching surveys:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSurveys = surveys.filter(s => 
    s.room.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.guest.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader fullPage message="Cargando encuestas..." />;

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-slate-900 mb-1">Gestión de Encuestas</h1>
          <p className="text-slate-500">Revisa y gestiona el feedback recibido de los huéspedes en tiempo real.</p>
        </div>
        <Button variant="accent" onClick={() => window.print()} icon={Hash}>
          Exportar Reporte
        </Button>
      </header>

      <Card className="p-0 overflow-visible">
        {/* Filters Header */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por habitación o huésped..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none">
              <Calendar size={18} />
              <span className="md:inline hidden">Fecha</span>
            </Button>
            <Button variant="outline" className="flex-1 md:flex-none">
              <Filter size={18} />
              <span className="md:inline hidden">Filtros</span>
            </Button>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Habitación</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Huésped</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Satisfacción</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Comentarios</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredSurveys.map((survey) => (
                <tr key={survey.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-700">#{survey.room}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{survey.guest}</span>
                      <span className="text-xs text-slate-400">{survey.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{survey.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < Math.round(survey.score) ? 'bg-[#C5A02D]' : 'bg-slate-200'}`} />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-slate-700">{survey.score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-xs font-medium text-slate-500 italic">
                      {survey.comment}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredSurveys.map((survey) => (
            <div key={survey.id} className="p-5 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C5A02D] mb-1">Hab. {survey.room}</span>
                  <span className="text-lg font-bold text-slate-900">{survey.guest}</span>
                </div>
                <div className="bg-slate-50 px-2 py-1 rounded text-xs font-bold text-slate-500">
                  {survey.date}
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2 py-1.5 px-3 bg-slate-50 rounded-lg">
                  <Star size={14} className="fill-[#C5A02D] text-[#C5A02D]" />
                  <span className="text-sm font-black text-slate-700">{survey.score}</span>
                </div>
                <Button variant="outline" size="sm" className="px-3">Ver Detalle</Button>
              </div>
            </div>
          ))}
        </div>

        {filteredSurveys.length === 0 && (
          <div className="p-12 text-center text-slate-400 italic">
            No se han encontrado encuestas con los criterios de búsqueda.
          </div>
        )}
      </Card>
    </div>
  );
};

export default SurveyList;

