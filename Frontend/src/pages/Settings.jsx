import React, { useState, useEffect } from 'react';
import { Bell, Sliders, MessageSquare, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const Settings = () => {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newQuestion, setNewQuestion] = useState({ texto_pregunta: '', categoria_id: '' });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      console.log('Iniciando carga de datos...');
      
      // 1. Fetch Categories
      const { data: catData, error: catError } = await supabase
        .from('categorias_servicio')
        .select('*')
        .order('nombre_servicio', { ascending: true });

      if (catError) {
        console.error('DEBUG - Error Supabase (Categorías):', {
          message: catError.message,
          details: catError.details,
          hint: catError.hint,
          code: catError.code
        });
        throw catError;
      }
      
      console.log('Categorías recibidas:', catData);
      setCategories(catData || []);
      
      // Set default category for the form
      if (catData && catData.length > 0) {
        setNewQuestion(prev => ({ ...prev, categoria_id: catData[0].id_servicio }));
      } else {
        console.warn('La tabla Categorias_servicio parece estar vacía.');
      }

      // 2. Fetch Questions
      const { data: qData, error: qError } = await supabase
        .from('preguntas')
        .select('*')
        .order('id_preguntas', { ascending: true });

      if (qError) {
        console.error('Error de Supabase (Preguntas):', qError);
        throw qError;
      }
      setQuestions(qData || []);

    } catch (error) {
      console.error('Error general en fetchInitialData:', error);
      showStatus(`Error crítico: ${error.message || 'No se pudo conectar con la base de datos'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.texto_pregunta.trim() || !newQuestion.categoria_id) {
      showStatus('Completa todos los campos', 'error');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('preguntas')
        .insert([{ 
          texto_pregunta: newQuestion.texto_pregunta, 
          categoria_id: newQuestion.categoria_id,
          es_obligatorio: true // Default based on schema
        }])
        .select();

      if (error) throw error;

      setQuestions([...questions, ...data]);
      setNewQuestion({ ...newQuestion, texto_pregunta: '' });
      showStatus('Pregunta añadida correctamente', 'success');
    } catch (error) {
      console.error('Error adding question:', error);
      showStatus(`Error al añadir pregunta: ${error.message}`, 'error');
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      const { error } = await supabase
        .from('preguntas')
        .delete()
        .eq('id_preguntas', id); // Based on schema PK

      if (error) throw error;

      setQuestions(questions.filter(q => q.id_preguntas !== id));
      showStatus('Pregunta eliminada', 'success');
    } catch (error) {
      console.error('Error deleting question:', error);
      showStatus(`Error al eliminar pregunta: ${error.message}`, 'error');
    }
  };

  const showStatus = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const sections = [
    {
      title: 'Notificaciones',
      desc: 'Configura quién recibe alertas de insatisfacción.',
      icon: <Bell size={20} color="#C5A02D" />,
      fields: [
        { label: 'Correo Administrador', value: 'admin@tamanaco.com.ve' },
        { label: 'Correo Gerencia', value: 'gerencia@tamanaco.com.ve' }
      ]
    },
    {
      title: 'Sistema y Encuestas',
      desc: 'Parámetros generales del sistema de satisfacción.',
      icon: <Sliders size={20} color="#C5A02D" />,
      fields: [
        { label: 'Umbral de Alerta', value: '3 estrellas o menos' },
        { label: 'Tiempo de Sesión', value: '8 horas' }
      ]
    }
  ];

  return (
    <div className="settings-container">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>Configuración</h1>
        <p style={{ color: '#64748b' }}>Gestiona los parámetros globales y notificaciones del sistema.</p>
      </header>

      {message.text && (
        <div style={{ 
          padding: '1rem', borderRadius: '8px', marginBottom: '1rem',
          backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
          color: message.type === 'success' ? '#166534' : '#991b1b',
          display: 'flex', alignItems: 'center', gap: '0.5rem'
        }}>
          {message.type === 'success' && <CheckCircle2 size={18} />}
          {message.text}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Question Management Section */}
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <MessageSquare size={20} color="#C5A02D" />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>Gestión de Preguntas</h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Añade o elimina las preguntas de la encuesta por servicio.</p>
            </div>
          </div>

          <div style={{ padding: '1.5rem' }}>
            {/* Add Question Form */}
            <form onSubmit={handleAddQuestion} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                placeholder="Escribe la nueva pregunta..."
                value={newQuestion.texto_pregunta}
                onChange={(e) => setNewQuestion({ ...newQuestion, texto_pregunta: e.target.value })}
                style={{ flex: 1, minWidth: '300px', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
              <select 
                value={newQuestion.categoria_id}
                onChange={(e) => setNewQuestion({ ...newQuestion, categoria_id: e.target.value })}
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff' }}
                disabled={loading || categories.length === 0}
              >
                {loading ? (
                  <option value="">Cargando categorías...</option>
                ) : categories.length === 0 ? (
                  <option value="">No se encontraron categorías</option>
                ) : (
                  categories.map(c => (
                    <option key={c.id_servicio} value={c.id_servicio}>
                      {c.nombre_servicio}
                    </option>
                  ))
                )}
              </select>
              <button 
                type="submit"
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.5rem', 
                  backgroundColor: '#0f172a', color: '#fff', 
                  padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', 
                  fontWeight: '600', cursor: 'pointer' 
                }}
              >
                <Plus size={18} /> Añadir
              </button>
            </form>

            {/* Questions List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {loading ? (
                <p style={{ textAlign: 'center', color: '#64748b' }}>Cargando datos...</p>
              ) : questions.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#64748b' }}>No hay preguntas configuradas.</p>
              ) : (
                questions.map((q) => (
                  <div key={q.id_preguntas} style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '1rem', background: '#f8fafc', borderRadius: '8px',
                    borderLeft: `4px solid #C5A02D`
                  }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#C5A02D', fontWeight: '700', letterSpacing: '0.05em' }}>
                        {categories.find(c => c.id_servicio === q.categoria_id)?.nombre_servicio || 'Desconocido'}
                      </span>
                      <p style={{ margin: '0.25rem 0 0 0', color: '#0f172a', fontWeight: '500' }}>{q.texto_pregunta}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteQuestion(q.id_preguntas)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Existing Static Sections */}
        {sections.map((section, idx) => (
          <div key={idx} style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {section.icon}
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>{section.title}</h3>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>{section.desc}</p>
              </div>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {section.fields.map((field, fIdx) => (
                <div key={fIdx} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: fIdx < section.fields.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                  <span style={{ fontSize: '0.925rem', color: '#64748b', fontWeight: '500' }}>{field.label}</span>
                  <span style={{ fontSize: '0.925rem', color: '#0f172a', fontWeight: '600' }}>{field.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
