import React, { useState, useEffect } from 'react';
import { Star, User, CheckCircle2, Calendar, AlertCircle, Activity } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { allCountries } from '../data/countries';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Loader from '../components/ui/Loader';
import './Survey.css';

const StarRating = ({ value, onChange }) => {
  return (
    <div className="stars-container">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star-button ${star <= value ? 'active' : 'inactive'}`}
          onClick={() => onChange(star)}
        >
          <Star size={28} />
        </button>
      ))}
    </div>
  );
};

const Survey = () => {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  
  const [guestInfo, setGuestInfo] = useState({
    nombre_completo: '',
    email: '',
    num_habitacion: '',
    fecha_llegada: '',
    fecha_salida: '',
    telefono_huesped: '',
    country_code: '+58'
  });

  const [answers, setAnswers] = useState({});
  const [comentarios, setComentarios] = useState('');
  const [recentComments, setRecentComments] = useState([]);

  useEffect(() => {
    fetchSurveyData();
    fetchRecentComments();
  }, []);

  const fetchRecentComments = async () => {
    try {
      const { data, error } = await supabase
        .from('encuestas_realizadas')
        .select(`
          comentarios,
          puntuacion_final,
          fecha_encuesta,
          huespedes (nombre_completo, num_habitacion)
        `)
        .not('comentarios', 'is', null)
        .neq('comentarios', '')
        .order('fecha_encuesta', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      // Shuffle and pick 5
      const shuffled = (data || []).sort(() => 0.5 - Math.random());
      setRecentComments(shuffled.slice(0, 5));
    } catch (err) {
      console.error('Error fetching recent comments:', err);
    }
  };

  const fetchSurveyData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: catData, error: catError } = await supabase
        .from('categorias_servicio')
        .select('*');
      if (catError) throw catError;
      setCategories(catData || []);

      const { data: qData, error: qError } = await supabase
        .from('preguntas')
        .select('*')
        .eq('activa', true)
        .order('id_preguntas', { ascending: true });
      
      if (qError) throw qError;
      
      setQuestions(qData || []);
      
      const initialAnswers = {};
      qData?.forEach(q => {
        initialAnswers[q.id_preguntas] = 0;
      });
      setAnswers(initialAnswers);
    } catch (error) {
      console.error('Error fetching survey data:', error);
      setError('No se pudieron cargar las preguntas. Por favor, intente más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (id_pregunta, rating) => {
    setAnswers(prev => ({ ...prev, [id_pregunta]: rating }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGuestInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that all questions are answered
    const unanswered = questions.some(q => !answers[q.id_preguntas]);
    if (unanswered) {
      alert('Por favor, responda todas las preguntas de la encuesta.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // 1. Combine country code and phone
      const finalPhone = `${guestInfo.country_code} ${guestInfo.telefono_huesped}`.trim();
      const guestData = { 
        nombre_completo: guestInfo.nombre_completo,
        email: guestInfo.email,
        num_habitacion: guestInfo.num_habitacion,
        fecha_llegada: guestInfo.fecha_llegada,
        fecha_salida: guestInfo.fecha_salida,
        telefono_huesped: finalPhone
      };

      // 2. Insert or get Guest
      const { data: newGuest, error: guestError } = await supabase
        .from('huespedes')
        .upsert(guestData, { onConflict: 'email' })
        .select()
        .single();

      if (guestError) throw guestError;

      // 3. Calculate Final Score and Create Survey Record Header
      const totalScore = Object.values(answers).reduce((acc, val) => acc + val, 0);
      const finalScore = questions.length > 0 ? (totalScore / questions.length) : 0;

      const { data: newSurvey, error: surveyError } = await supabase
        .from('encuestas_realizadas')
        .insert([{ 
          id_huesped: newGuest.id_huesped,
          puntuacion_final: finalScore,
          comentarios: comentarios
        }])
        .select()
        .single();

      if (surveyError) throw surveyError;

      // 4. Create Answer Details (Bulk Insert)
      const answerDetails = Object.entries(answers).map(([preguntaId, valor]) => ({
        id_encuesta: newSurvey.id_encuesta,
        id_pregunta: preguntaId,
        puntuacion: valor
      }));

      const { error: detailsError } = await supabase
        .from('respuesta_detalle')
        .insert(answerDetails);

      if (detailsError) throw detailsError;

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      console.error('Error submitting survey:', err);
      setError(`Ocurrió un error al enviar la encuesta: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="survey-page flex items-center justify-center min-h-[70vh]">
        <Card className="max-w-md text-center py-12 px-8">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-serif mb-4">¡Muchas Gracias!</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Tu opinión es fundamental para que el Hotel Tamanaco siga ofreciendo la excelencia que mereces.
          </p>
          <Button variant="accent" onClick={() => window.location.reload()}>
            Volver al Inicio
          </Button>
        </Card>
      </div>
    );
  }

  const groupedQuestions = questions.reduce((acc, q) => {
    const category = categories.find(c => c.id_servicio === q.categoria_id);
    const catName = category ? category.nombre_servicio : 'Otros Servicios';
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(q);
    return acc;
  }, {});

  if (loading) return <Loader fullPage message="Preparando encuesta..." />;

  return (
    <div className="survey-page px-4 pt-4 pb-20">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-serif text-slate-900 mb-2">Hotel Tamanaco</h1>
        <p className="text-lg text-slate-500">Tu satisfacción es nuestro compromiso de excelencia.</p>
      </header>

      {error && (
        <div className="max-w-3xl mx-auto mb-8 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Recent Comments Section */}
      {recentComments.length > 0 && (
        <div className="max-w-3xl mx-auto mb-12">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#C5A02D] mb-6 text-center">Lo que dicen nuestros huéspedes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentComments.map((comment, idx) => (
              <Card key={idx} className="bg-white/50 border-slate-100 shadow-sm overflow-hidden group">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-3">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{comment.huespedes?.nombre_completo || 'Anónimo'} • HAB. {comment.huespedes?.num_habitacion}</span>
                       <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={10} 
                            fill={i < Math.round(comment.puntuacion_final) ? "#C5A02D" : "none"} 
                            className={i < Math.round(comment.puntuacion_final) ? "text-[#C5A02D]" : "text-slate-200"} 
                            strokeWidth={i < Math.round(comment.puntuacion_final) ? 0 : 2}
                          />
                        ))}
                      </div>
                  </div>
                  <p className="text-sm text-slate-600 italic leading-relaxed">"{comment.comentarios}"</p>
                  <div className="mt-auto pt-3 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">Promedio: {parseFloat(comment.puntuacion_final).toFixed(1)}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
        <Card title="Información del Huésped" icon={User}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="guest-info-field">
              <label className="text-sm font-semibold text-slate-600 mb-1 block">Nombre Completo</label>
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-accent/5 focus:border-accent focus:bg-white outline-none transition-all"
                type="text" name="nombre_completo" value={guestInfo.nombre_completo} onChange={handleInputChange} placeholder="Ej. Juan Pérez" required 
              />
            </div>
            
            <div className="guest-info-field">
              <label className="text-sm font-semibold text-slate-600 mb-1 block">Correo Electrónico</label>
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-accent/5 focus:border-accent focus:bg-white outline-none transition-all"
                type="email" name="email" value={guestInfo.email} onChange={handleInputChange} placeholder="juan@email.com" required 
              />
            </div>

            <div className="guest-info-field">
              <label className="text-sm font-semibold text-slate-600 mb-1 block">Habitación</label>
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-accent/5 focus:border-accent focus:bg-white outline-none transition-all"
                type="text" name="num_habitacion" value={guestInfo.num_habitacion} onChange={handleInputChange} placeholder="Ej. 402" required 
              />
            </div>

            <div className="guest-info-field w-full">
              <label className="text-sm font-semibold text-slate-600 mb-1 block">Teléfono</label>
              <div className="flex items-stretch gap-2 w-full">
                <select 
                  name="country_code" 
                  value={guestInfo.country_code} 
                  onChange={handleInputChange}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all appearance-none cursor-pointer"
                  style={{ width: '100px', flexShrink: 0 }}
                >
                  {allCountries.map((c, index) => (
                    <option key={`${c.code}-${index}`} value={c.dial_code}>
                      {c.flag} {c.dial_code}
                    </option>
                  ))}
                </select>
                <input 
                  className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:ring-4 focus:ring-accent/5 focus:border-accent focus:bg-white outline-none transition-all leading-none"
                  type="tel" 
                  name="telefono_huesped" 
                  value={guestInfo.telefono_huesped} 
                  onChange={handleInputChange} 
                  placeholder="000 0000" 
                  required
                />
              </div>
            </div>

            <div className="guest-info-field">
              <label className="text-sm font-semibold text-slate-600 mb-1 block">Fecha de Llegada</label>
              <div className="relative">
                <input 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-accent/5 focus:border-accent focus:bg-white outline-none transition-all pr-12"
                  type="date" name="fecha_llegada" value={guestInfo.fecha_llegada} onChange={handleInputChange} onClick={(e) => e.target.showPicker?.()} required 
                />
                <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="guest-info-field">
              <label className="text-sm font-semibold text-slate-600 mb-1 block">Fecha de Salida</label>
              <div className="relative">
                <input 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-accent/5 focus:border-accent focus:bg-white outline-none transition-all pr-12"
                  type="date" name="fecha_salida" value={guestInfo.fecha_salida} onChange={handleInputChange} onClick={(e) => e.target.showPicker?.()} required 
                />
                <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </Card>

        {Object.keys(groupedQuestions).length > 0 ? (
          Object.keys(groupedQuestions).map((catName) => (
            <Card key={catName} title={catName}>
              <div className="space-y-8">
                {groupedQuestions[catName].map((q) => (
                  <div key={q.id_preguntas} className="question-item">
                    <p className="text-lg text-slate-800 font-medium mb-4">{q.texto_pregunta}</p>
                    <StarRating value={answers[q.id_preguntas]} onChange={(rating) => handleRatingChange(q.id_preguntas, rating)} />
                  </div>
                ))}
              </div>
            </Card>
          ))
        ) : (
           <Card className="text-center text-slate-500 py-12">
             No hay preguntas configuradas actualmente.
           </Card>
        )}

        {/* Comment Section */}
        <Card title="Comentarios Adicionales" icon={Activity}>
          <div className="space-y-4">
            <p className="text-sm text-slate-500 italic">¿Hay algo más que desearía compartir con nosotros para mejorar su experiencia?</p>
            <textarea 
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              placeholder="Escriba sus comentarios aquí..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 min-h-[120px] focus:ring-4 focus:ring-accent/5 focus:border-accent focus:bg-white outline-none transition-all text-slate-700 leading-relaxed"
            />
          </div>
        </Card>

        {Object.keys(questions).length > 0 && (
          <Button 
            variant="accent" 
            size="lg" 
            className="w-full py-5" 
            type="submit"
            loading={submitting}
          >
            {submitting ? 'Enviando...' : 'Enviar Encuesta de Satisfacción'}
          </Button>
        )}
      </form>
    </div>
  );
};

export default Survey;