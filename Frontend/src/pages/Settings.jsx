import React from 'react';
import { Mail, Bell, Shield, Sliders, Globe } from 'lucide-react';

const Settings = () => {
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {sections.map((section, idx) => (
          <div key={idx} style={{ 
            background: '#fff', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <div style={{ 
              padding: '1.5rem', 
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              {section.icon}
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>{section.title}</h3>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>{section.desc}</p>
              </div>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {section.fields.map((field, fIdx) => (
                <div key={fIdx} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '1rem 0',
                  borderBottom: fIdx < section.fields.length - 1 ? '1px solid #f8fafc' : 'none'
                }}>
                  <span style={{ fontSize: '0.925rem', color: '#64748b', fontWeight: '500' }}>{field.label}</span>
                  <span style={{ fontSize: '0.925rem', color: '#0f172a', fontWeight: '600' }}>{field.value}</span>
                </div>
              ))}
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button style={{ 
                  background: 'none', 
                  border: '1px solid #e2e8f0', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  color: '#0f172a'
                }}>
                  Editar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
