import React from 'react';
import { Search, Filter, MoreHorizontal, Calendar, Hash } from 'lucide-react';

const SurveyList = () => {
  return (
    <div className="survey-list-container">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>Gestión de Encuestas</h1>
          <p style={{ color: '#64748b' }}>Revisa y gestiona el feedback recibido de los huéspedes.</p>
        </div>
        <button style={{ 
          backgroundColor: '#0f172a', 
          color: '#fff', 
          padding: '0.75rem 1.5rem', 
          borderRadius: '8px',
          border: 'none',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Exportar Reporte
        </button>
      </header>

      <div style={{ 
        background: '#fff', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        padding: '1.5rem'
      }}>
        {/* Filters Header */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '1.5rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Buscar por número de habitación o comentario..." 
              style={{ 
                width: '100%', 
                padding: '0.75rem 0.75rem 0.75rem 2.5rem', 
                borderRadius: '8px', 
                border: '1px solid #e2e8f0',
                fontSize: '0.875rem'
              }}
            />
          </div>
          <button style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: '0.75rem 1.25rem', 
            borderRadius: '8px', 
            border: '1px solid #e2e8f0',
            background: '#fff',
            color: '#64748b',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            <Calendar size={18} />
            Fecha
          </button>
          <button style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: '0.75rem 1.25rem', 
            borderRadius: '8px', 
            border: '1px solid #e2e8f0',
            background: '#fff',
            color: '#64748b',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            <Filter size={18} />
            Filtros
          </button>
        </div>

        {/* Placeholder Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>HABITACIÓN</th>
                <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>FECHA</th>
                <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>SATISFACCIÓN</th>
                <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>COMENTARIO</th>
                <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {[
                { room: '402', date: '11 Abr, 2024', score: 5, comment: 'Excelente servicio en recepción.' },
                { room: '105', date: '11 Abr, 2024', score: 3, comment: 'La piscina estaba algo fría.' },
                { room: '312', date: '10 Abr, 2024', score: 5, comment: 'La comida del restaurante fue increíble.' },
                { room: '221', date: '10 Abr, 2024', score: 4, comment: 'Todo bien, habitación limpia.' }
              ].map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600' }}>#{row.room}</td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748b' }}>{row.date}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(5)].map((_, i) => (
                        <div key={i} style={{ 
                          width: '12px', 
                          height: '12px', 
                          borderRadius: '2px', 
                          backgroundColor: i < row.score ? '#C5A02D' : '#e2e8f0' 
                        }} />
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748b', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {row.comment}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SurveyList;
