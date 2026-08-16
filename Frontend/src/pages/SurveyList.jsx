import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, Calendar, Download, User, MapPin, Star, X, Eye } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import Modal from '../components/ui/Modal';

const SurveyList = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [satisfactionFilter, setSatisfactionFilter] = useState('all'); // 'all', '5', '4', '3', '2', '1'
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [surveyDetails, setSurveyDetails] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const dateInputRef = React.useRef(null);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
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
          )
        `)
        .order('fecha_encuesta', { ascending: false });

      if (error) throw error;

      const transformedData = data?.map(s => {
        const h = s.huespedes;
        return {
          id: s.id_encuesta,
          room: h?.num_habitacion || 'N/A',
          guest: h?.nombre_completo || 'Anónimo',
          email: h?.email || 'N/A',
          rawDate: s.fecha_encuesta,
          date: s.fecha_encuesta ? new Date(s.fecha_encuesta).toLocaleDateString() : 'N/A',
          score: parseFloat(Number(s.puntuacion_final || 0).toFixed(1)),
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

  const handleViewDetails = async (survey) => {
    setSelectedSurvey(survey);
    setIsModalOpen(true);
    try {
      setDetailsLoading(true);
      const { data, error } = await supabase
        .from('respuesta_detalle')
        .select(`
          puntuacion,
          preguntas (
            texto_pregunta,
            categorias_servicio (nombre_servicio)
          )
        `)
        .eq('id_encuesta', survey.id);

      if (error) throw error;
      setSurveyDetails(data || []);
    } catch (err) {
      console.error('Error fetching survey details:', err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  const filteredSurveys = surveys.filter(s => {
    const matchesSearch = 
      s.room.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !filterDate || s.rawDate.startsWith(filterDate);
    
    let matchesSatisfaction = true;
    if (satisfactionFilter !== 'all') {
      const score = Math.round(s.score);
      matchesSatisfaction = score === parseInt(satisfactionFilter);
    }
    
    return matchesSearch && matchesDate && matchesSatisfaction;
  });

  if (loading) return <Loader fullPage message="Cargando encuestas..." />;

  return (
    <div className="space-y-6 pb-20" onClick={() => setShowFilters(false)}>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-4xl font-serif text-slate-900 mb-2">Gestión de Encuestas</h1>
          <p className="text-slate-500 text-base">Revisa y gestiona el feedback recibido de los huéspedes en tiempo real.</p>
        </div>
        <Button variant="accent" onClick={handleExportPDF} icon={Download}>
          Exportar Reporte
        </Button>
      </header>

      {/* Print-only Header */}
      <div className="display-none print-only mb-8 text-center border-b-2 border-[#C5A02D] pb-6">
        <h1 className="text-4xl font-serif text-slate-900 mb-2">Hotel Tamanaco</h1>
        <h2 className="text-xl text-slate-500 uppercase tracking-widest">Reporte de Satisfacción de Huéspedes</h2>
        <p className="text-sm text-slate-400 mt-2 font-bold">{new Date().toLocaleDateString('es-ES', { dateStyle: 'long' })}</p>
      </div>

      <Card className="p-0 overflow-visible no-print">
        {/* Filters Header */}
        <div className="p-4 border-b border-slate-100 flex flex-col gap-3">
          {/* Search Input */}
          <div className="relative w-full">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Buscar por habitación, huésped o correo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all shadow-sm text-sm text-slate-800 placeholder:text-slate-400"
            />
            {searchTerm && (
              <button 
                type="button"
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filter Chips / Action Row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {/* Hidden Native Date Input */}
            <input 
              ref={dateInputRef}
              type="date" 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="sr-only"
            />

            {/* Custom Date Button */}
            <button 
              type="button"
              onClick={() => {
                if (dateInputRef.current) {
                  try {
                    dateInputRef.current.showPicker ? dateInputRef.current.showPicker() : dateInputRef.current.click();
                  } catch (e) {
                    dateInputRef.current.click();
                  }
                }
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border shrink-0 ${
                filterDate 
                  ? 'bg-accent/10 border-accent text-accent font-bold' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Calendar size={15} />
              <span>
                {filterDate 
                  ? new Date(filterDate + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) 
                  : 'Filtrar Fecha'}
              </span>
              {filterDate && (
                <span 
                  onClick={(e) => { e.stopPropagation(); setFilterDate(''); }} 
                  className="ml-1 hover:bg-accent/20 rounded-full p-0.5"
                >
                  <X size={12} />
                </span>
              )}
            </button>

            {/* Custom Satisfaction Filter Dropdown */}
            <div className="relative shrink-0">
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFilters(!showFilters);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
                  satisfactionFilter !== 'all' 
                    ? 'bg-accent/10 border-accent text-accent font-bold' 
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Filter size={15} />
                <span>{satisfactionFilter === 'all' ? 'Puntuación' : `Puntuación: ${satisfactionFilter}.0 ★`}</span>
                {satisfactionFilter !== 'all' && (
                  <span 
                    onClick={(e) => { e.stopPropagation(); setSatisfactionFilter('all'); }} 
                    className="ml-1 hover:bg-accent/20 rounded-full p-0.5"
                  >
                    <X size={12} />
                  </span>
                )}
              </button>

              {showFilters && (
                <div 
                  className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-52 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-3 bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                    Nivel de Satisfacción
                  </div>
                  <div className="p-1">
                    {[5, 4, 3, 2, 1].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => {
                          setSatisfactionFilter(level.toString());
                          setShowFilters(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-colors flex justify-between items-center ${
                          satisfactionFilter === level.toString() ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={11} 
                              fill={i < level ? "#C5A02D" : "none"} 
                              className={i < level ? "text-[#C5A02D]" : "text-slate-200"} 
                              strokeWidth={i < level ? 0 : 2}
                            />
                          ))}
                        </div>
                        <span className="font-bold">{level}.0</span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setSatisfactionFilter('all');
                        setShowFilters(false);
                      }}
                      className="w-full text-left px-4 py-2 mt-1 text-xs text-slate-400 hover:text-slate-600 transition-colors border-t border-slate-50"
                    >
                      Mostrar Todos
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Clear Filters Button */}
            {(searchTerm || filterDate || satisfactionFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setFilterDate('');
                  setSatisfactionFilter('all');
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors shrink-0"
              >
                Limpiar filtros
              </button>
            )}
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
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredSurveys.map((survey) => (
                <tr key={survey.id} className="hover:bg-slate-50/50 transition-colors group">
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
                          <div key={i} className={`w-2 h-2 rounded-full ${i < Math.round(survey.score) ? 'bg-[#C5A02D]' : 'bg-slate-200'}`} />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-slate-700">{survey.score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewDetails(survey)} 
                      icon={Eye} 
                      className="border-slate-200 text-slate-600 hover:border-accent hover:text-accent shadow-sm"
                    >
                      Detalles
                    </Button>
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
                <div className="flex items-center gap-2 py-1.5 px-3 bg-[#faf9f6] rounded-lg border border-[#f1f0ea]">
                  <Star size={14} fill="#C5A02D" className="text-[#C5A02D]" strokeWidth={0} />
                  <span className="text-sm font-black text-slate-700">{survey.score}</span>
                </div>
                <Button variant="outline" size="sm" className="px-3" onClick={() => handleViewDetails(survey)}>Ver Detalle</Button>
              </div>
            </div>
          ))}
        </div>

        {filteredSurveys.length === 0 && (
          <div className="p-12 text-center text-slate-400 italic font-serif">
            No se han encontrado encuestas con los criterios seleccionados.
          </div>
        )}
      </Card>

      {/* Print View Table (hidden normally, visible when printing) */}
      <div className="display-none print-only">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-900 border-t-2">
              <th className="py-4 text-left font-bold uppercase text-xs">Hab</th>
              <th className="py-4 text-left font-bold uppercase text-xs">Huésped</th>
              <th className="py-4 text-left font-bold uppercase text-xs">Fecha</th>
              <th className="py-4 text-center font-bold uppercase text-xs">Score</th>
              <th className="py-4 text-left font-bold uppercase text-xs">Comentario</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredSurveys.map(s => (
              <tr key={s.id}>
                <td className="py-4 font-bold">#{s.room}</td>
                <td className="py-4">
                  <div className="font-bold">{s.guest}</div>
                  <div className="text-[10px] text-slate-500">{s.email}</div>
                </td>
                <td className="py-4 text-sm">{s.date}</td>
                <td className="py-4 text-center font-bold">{s.score}/5</td>
                <td className="py-4 text-sm italic">"{s.comment}"</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={`Detalles de Encuesta - Hab. ${selectedSurvey?.room}`}
      >
        {detailsLoading ? (
          <div className="py-20 flex justify-center">
            <Loader message="Cargando detalles..." />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Huésped</p>
                <p className="font-bold text-slate-900">{selectedSurvey?.guest}</p>
                <p className="text-sm text-slate-500">{selectedSurvey?.email}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Puntuación Final</p>
                <div className="flex items-center justify-end gap-2">
                  <span className="text-2xl font-black text-[#C5A02D]">{selectedSurvey?.score}</span>
                  <span className="text-slate-300 text-lg">/ 5.0</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <Star size={18} fill="#C5A02D" className="text-[#C5A02D]" strokeWidth={0} />
                Calificaciones por Servicio
              </h4>

              {(() => {
                const grouped = surveyDetails.reduce((acc, detail) => {
                  const serviceName = detail.preguntas?.categorias_servicio?.nombre_servicio || 'Servicio General';
                  if (!acc[serviceName]) acc[serviceName] = [];
                  acc[serviceName].push(detail);
                  return acc;
                }, {});

                return (
                  <div className="space-y-6">
                    {Object.entries(grouped).map(([serviceName, items], sIdx) => (
                      <div key={sIdx} className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100/80">
                        <h5 className="text-xs font-bold text-[#C5A02D] uppercase tracking-wider mb-3 pb-2 border-b border-slate-200/60 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#C5A02D]"></span>
                          {serviceName}
                        </h5>
                        <div className="space-y-2.5">
                          {items.map((detail, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-xs border border-slate-100">
                              <p className="text-sm font-medium text-slate-700 pr-4 leading-snug">{detail.preguntas?.texto_pregunta}</p>
                              <div className="flex items-center gap-1.5 shrink-0 bg-[#faf9f6] px-2.5 py-1 rounded-lg border border-[#f1f0ea]">
                                <span className="text-sm font-black text-slate-900">{detail.puntuacion}</span>
                                <Star size={14} fill="#C5A02D" className="text-[#C5A02D]" strokeWidth={0} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            <div className="pt-4">
              <h4 className="font-bold text-slate-900 mb-2">Comentarios del Huésped</h4>
              <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl italic text-slate-700 text-sm leading-relaxed">
                "{selectedSurvey?.comment}"
              </div>
            </div>
            
            <div className="pt-6 flex justify-end">
              <Button onClick={() => setIsModalOpen(false)} variant="outline">Cerrar</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SurveyList;

