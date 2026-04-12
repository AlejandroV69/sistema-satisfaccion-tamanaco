import React, { useState, useEffect } from 'react';
import { Star, User, CheckCircle2, Calendar, Phone } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { allCountries } from '../data/countries';
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
  console.log('--- COMPONENTE SURVEY RENDERIZADO ---');
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  
  // Guest Info State (Matching huespedes schema)
  const [guestInfo, setGuestInfo] = useState({
    Nombre_completo: '',
    email: '',
    num_habitacion: '',
    fecha_llegada: '',
    fecha_salida: '',
    telefono_huesped: '',
    country_code: '+58'
  });

  // Answers State
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    fetchSurveyData();
  }, []);

  const fetchSurveyData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Categories first
      const { data: catData, error: catError } = await supabase
        .from('categorias_servicio')
        .select('*');
      if (catError) {
        console.error('ERROR - Survey (Categorías):', catError);
        throw catError;
      }
      console.log('Survey - Categorías cargadas:', catData);
      setCategories(catData || []);

      // 2. Fetch Questions
      const { data: qData, error: qError } = await supabase
        .from('preguntas')
        .select('*')
        .order('id_preguntas', { ascending: true });
      if (qError) {
        console.error('ERROR - Survey (Preguntas):', qError);
        throw qError;
      }
      console.log('Survey - Preguntas cargadas:', qData);
      setQuestions(qData || []);
      
      // Initialize answers
      const initialAnswers = {};
      qData?.forEach(q => {
        initialAnswers[q.id_preguntas] = 0;
      });
      setAnswers(initialAnswers);
    } catch (error) {
      console.error('Error fetching survey data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (id_pregunta, rating) => {
    setAnswers(prev => ({
      ...prev,
      [id_pregunta]: rating
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGuestInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Combine country code and phone for final data
    const finalPhone = `${guestInfo.country_code} ${guestInfo.telefono_huesped}`.trim();
    const submissionData = { ...guestInfo, telefono_huesped: finalPhone };
    delete submissionData.country_code;
    
    console.log('Final Data Submission:', { guestInfo: submissionData, answers });
    // Future work: Insert into 'huespedes', 'encuestas_realizadas', and 'respuesta_detalle'
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="survey-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="survey-card" style={{ textAlign: 'center', maxWidth: '500px' }}>
          <CheckCircle2 size={64} color="#C5A02D" style={{ marginBottom: '1.5rem', display: 'inline-block' }} />
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', marginBottom: '1rem' }}>¡Gracias por tu Comentario!</h2>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>Tu opinión es fundamental para que el Hotel Tamanaco siga ofreciendo la excelencia que mereces.</p>
          <button onClick={() => window.location.reload()} className="submit-survey-btn" style={{ width: 'auto', padding: '1rem 2rem' }}>
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  // Group questions by category name
  const groupedQuestions = questions.reduce((acc, q) => {
    const category = categories.find(c => c.id_servicio === q.categoria_id);
    const catName = category ? category.nombre_servicio : 'Otros Servicios';
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(q);
    return acc;
  }, {});

  console.log('Survey - Preguntas agrupadas:', groupedQuestions);

  return (
    <div className="survey-page">
      <header className="survey-header">
        <h1>Hotel Tamanaco</h1>
        <p>Tu satisfacción es nuestro compromiso de excelencia.</p>
      </header>

      <form onSubmit={handleSubmit}>
        <section className="survey-card">
          <h2 className="survey-section-title">
            <User size={24} color="#C5A02D" />
            Información del Huésped
          </h2>
          <div className="guest-info-grid">
            <div className="guest-info-field">
              <label>Nombre Completo</label>
              <div className="input-field-wrapper">
                <input type="text" name="Nombre_completo" value={guestInfo.Nombre_completo} onChange={handleInputChange} placeholder="Ej. Juan Pérez" required />
              </div>
            </div>
            
            <div className="guest-info-field">
              <label>Correo Electrónico</label>
              <div className="input-field-wrapper">
                <input type="email" name="email" value={guestInfo.email} onChange={handleInputChange} placeholder="juan@email.com" required />
              </div>
            </div>

            <div className="guest-info-field">
              <label>Número de Habitación</label>
              <div className="input-field-wrapper">
                <input type="text" name="num_habitacion" value={guestInfo.num_habitacion} onChange={handleInputChange} placeholder="Ej. 402" required />
              </div>
            </div>

            <div className="guest-info-field">
              <label>Teléfono de Contacto</label>
              <div className="input-field-wrapper phone-input-flex">
                <select 
                  name="country_code" 
                  value={guestInfo.country_code} 
                  onChange={handleInputChange}
                  className="country-selector"
                >
                  {allCountries.map(c => (
                    <option key={`${c.code}-${c.name}`} value={c.dial_code}>
                      {c.flag} {c.dial_code}
                    </option>
                  ))}
                </select>
                <input 
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
              <label>Fecha de Llegada</label>
              <div className="input-field-wrapper date-input-wrapper">
                <input type="date" name="fecha_llegada" value={guestInfo.fecha_llegada} onChange={handleInputChange} required />
                <Calendar size={18} className="date-icon" />
              </div>
            </div>

            <div className="guest-info-field">
              <label>Fecha de Salida</label>
              <div className="input-field-wrapper date-input-wrapper">
                <input type="date" name="fecha_salida" value={guestInfo.fecha_salida} onChange={handleInputChange} required />
                <Calendar size={18} className="date-icon" />
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando encuesta...</p>
        ) : (
          Object.keys(groupedQuestions).length > 0 ? (
            Object.keys(groupedQuestions).map((catName) => (
              <section key={catName} className="survey-card">
                <h2 className="survey-section-title">{catName}</h2>
                <div className="questions-list">
                  {groupedQuestions[catName].map((q) => (
                    <div key={q.id_preguntas} className="question-item">
                      <p className="question-text">{q.texto_pregunta}</p>
                      <StarRating value={answers[q.id_preguntas]} onChange={(rating) => handleRatingChange(q.id_preguntas, rating)} />
                    </div>
                  ))}
                </div>
              </section>
            ))
          ) : (
             <div className="survey-card" style={{ textAlign: 'center' }}>
               <p style={{ color: '#64748b' }}>No hay preguntas configuradas actualmente para la encuesta.</p>
             </div>
          )
        )}

        {Object.keys(groupedQuestions).length > 0 && <button type="submit" className="submit-survey-btn">Enviar Encuesta</button>}
      </form>
    </div>
  );
};

export default Survey;