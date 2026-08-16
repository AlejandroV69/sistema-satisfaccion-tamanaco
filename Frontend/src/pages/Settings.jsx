import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Trash2, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Loader from '../components/ui/Loader';

const Settings = () => {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCategory, setAddingToCategory] = useState(null); // ID of category currently adding to
  const [newQuestionTexts, setNewQuestionTexts] = useState({}); // { categoryId: 'text' }
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      const { data: catData, error: catError } = await supabase
        .from('categorias_servicio')
        .select('*')
        .order('nombre_servicio', { ascending: true });

      if (catError) throw catError;
      setCategories(catData || []);
      
      const { data: qData, error: qError } = await supabase
        .from('preguntas')
        .select('*')
        .eq('activa', true)
        .order('id_preguntas', { ascending: true });

      if (qError) throw qError;
      setQuestions(qData || []);

    } catch (error) {
      console.error('Error loading settings:', error);
      showStatus(`Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async (categoryId) => {
    const text = newQuestionTexts[categoryId];
    if (!text || !text.trim()) return;

    try {
      setAddingToCategory(categoryId);
      const { data, error } = await supabase
        .from('preguntas')
        .insert([{ 
          texto_pregunta: text.trim(), 
          categoria_id: categoryId,
          es_obligatorio: true
        }])
        .select();

      if (error) throw error;

      setQuestions(prev => [...prev, ...data]);
      setNewQuestionTexts(prev => ({ ...prev, [categoryId]: '' }));
      showStatus('Pregunta añadida correctamente', 'success');
    } catch (error) {
      console.error('Error adding question:', error);
      showStatus(`Error: ${error.message}`, 'error');
    } finally {
      setAddingToCategory(null);
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('¿Estás seguro de desactivar esta pregunta? Dejará de aparecer en las nuevas encuestas pero se conservará en el historial.')) {
      return;
    }

    try {
      const { error, count } = await supabase
        .from('preguntas')
        .update({ activa: false }, { count: 'exact' })
        .eq('id_preguntas', id);

      if (error) throw error;

      if (count === 0) {
        throw new Error('La base de datos no permitió la actualización. Asegúrate de tener una política de "UPDATE" configurada en Supabase para la tabla "preguntas".');
      }

      setQuestions(prev => prev.filter(q => q.id_preguntas !== id));
      showStatus('Pregunta desactivada correctamente', 'success');
    } catch (error) {
      console.error('Error soft-deleting question:', error);
      showStatus(error.message, 'error');
    }
  };

  const showStatus = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleInputChange = (categoryId, value) => {
    setNewQuestionTexts(prev => ({ ...prev, [categoryId]: value }));
  };

  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      setAddingCategory(true);
      const { data, error } = await supabase
        .from('categorias_servicio')
        .insert([{ 
          nombre_servicio: newCategoryName.trim(),
          descripcion_servicio: newCategoryName.trim()
        }])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setCategories(prev => [...prev, data[0]]);
        setNewCategoryName('');
        setShowAddCategoryModal(false);
        showStatus('Servicio/Evento añadido correctamente', 'success');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      showStatus(`Error: ${error.message}`, 'error');
    } finally {
      setAddingCategory(false);
    }
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (!window.confirm(`¿Estás seguro de eliminar el servicio "${categoryName}"?`)) {
      return;
    }

    try {
      // 1. Obtener TODAS las preguntas (activas e inactivas) asociadas a esta categoría
      const { data: allCatQuestions, error: fetchQErr } = await supabase
        .from('preguntas')
        .select('id_preguntas')
        .eq('categoria_id', categoryId);

      if (fetchQErr) throw fetchQErr;

      const qIds = (allCatQuestions || []).map(q => q.id_preguntas);

      if (qIds.length > 0) {
        // Eliminar respuestas asociadas en respuesta_detalle
        await supabase.from('respuesta_detalle').delete().in('id_pregunta', qIds);
        await supabase.from('respuesta_detalle').delete().in('id_preguntas', qIds);

        // Eliminar las preguntas de la tabla preguntas
        const { error: qDeleteErr } = await supabase
          .from('preguntas')
          .delete()
          .eq('categoria_id', categoryId);

        if (qDeleteErr) {
          // Si las preguntas no se pueden eliminar por FK de respuestas antiguas, desvincular la categoria_id poniéndola en null o desactivando
          await supabase.from('preguntas').update({ categoria_id: null, activa: false }).eq('categoria_id', categoryId);
        }
      }

      // 2. Intentar eliminar la categoría
      const { error: catError, count } = await supabase
        .from('categorias_servicio')
        .delete({ count: 'exact' })
        .eq('id_servicio', categoryId);

      if (catError) throw catError;

      if (count === 0) {
        throw new Error('Supabase no permitió borrar el registro en "categorias_servicio" (0 filas afectadas). Asegúrate de agregar una política RLS de DELETE en la tabla categorias_servicio.');
      }

      setCategories(prev => prev.filter(c => c.id_servicio !== categoryId));
      setQuestions(prev => prev.filter(q => q.categoria_id !== categoryId));
      showStatus('Servicio eliminado correctamente de la base de datos', 'success');
    } catch (error) {
      console.error('Error deleting category:', error);
      showStatus(error.message || `Error al borrar: ${JSON.stringify(error)}`, 'error');
    }
  };

  if (loading) return <Loader fullPage message="Cargando configuración..." />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-slate-900 mb-2">Configuración de Encuestas</h1>
          <p className="text-slate-500">Administra las preguntas y servicios/eventos del sistema para su evaluación.</p>
        </div>
        <Button
          variant="accent"
          icon={Plus}
          onClick={() => setShowAddCategoryModal(true)}
        >
          Nuevo Servicio / Evento
        </Button>
      </header>

      {message.text && (
        <div className={`
          fixed top-8 right-8 z-[100] p-4 rounded-xl shadow-lg border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300
          ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'}
        `}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Modal para Nuevo Servicio */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-xl font-serif text-slate-900 mb-2">Agregar Nuevo Servicio / Evento</h2>
            <p className="text-slate-500 text-sm mb-6">Crea una nueva categoría o evento para que posteriormente los huéspedes o clientes puedan evaluarlo.</p>
            
            <form onSubmit={handleAddCategory} className="space-y-4">
              <Input
                label="Nombre del Servicio / Evento"
                placeholder="Ej. Restaurante, Evento Corporativo, Spa..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
                autoFocus
              />
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddCategoryModal(false);
                    setNewCategoryName('');
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="accent"
                  loading={addingCategory}
                >
                  Crear Servicio
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((category) => {
          const catQuestions = questions.filter(q => q.categoria_id === category.id_servicio);
          
          return (
            <Card 
              key={category.id_servicio}
              title={category.nombre_servicio}
              icon={MessageSquare}
              headerAction={
                <button
                  onClick={() => handleDeleteCategory(category.id_servicio, category.nombre_servicio)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex items-center gap-1.5 text-xs font-medium"
                  title="Eliminar servicio"
                >
                  <Trash2 size={16} />
                  <span>Eliminar</span>
                </button>
              }
              className="flex flex-col h-full"
            >
              <div className="flex-1 space-y-4 mb-6">
                {catQuestions.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <HelpCircle className="mx-auto text-slate-300 mb-2" size={32} />
                    <p className="text-sm text-slate-400">No hay preguntas para este servicio aún.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {catQuestions.map((q) => (
                      <div 
                        key={q.id_preguntas} 
                        className="group flex justify-between items-center p-3.5 bg-white border border-slate-100 rounded-xl hover:border-accent/30 hover:shadow-sm transition-all"
                      >
                        <p className="text-slate-700 text-sm font-medium leading-relaxed pr-4">
                          {q.texto_pregunta}
                        </p>
                        <button 
                          onClick={() => handleDeleteQuestion(q.id_preguntas)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Eliminar pregunta"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-auto pt-6 border-t border-slate-50">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Nueva pregunta..."
                    className="flex-1"
                    value={newQuestionTexts[category.id_servicio] || ''}
                    onChange={(e) => handleInputChange(category.id_servicio, e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddQuestion(category.id_servicio)}
                  />
                  <Button 
                    variant="accent" 
                    className="mt-1" 
                    onClick={() => handleAddQuestion(category.id_servicio)}
                    loading={addingToCategory === category.id_servicio}
                    icon={Plus}
                  >
                    Añadir
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}

        {categories.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-100 italic text-slate-400">
            No se encontraron categorías de servicio en la base de datos.
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;

