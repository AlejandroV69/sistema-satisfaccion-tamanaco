import React from 'react';
import { useParams } from 'react-router-dom';
import { BarChart3, TrendingUp, Users, Star } from 'lucide-react';

const Stats = () => {
  const { serviceId } = useParams();

  const serviceNames = {
    'recepcion': 'Recepción',
    'habitaciones': 'Habitaciones',
    'restaurante': 'Restaurante',
    'areas-comunes': 'Áreas Comunes'
  };

  const currentService = serviceNames[serviceId] || 'Vista General';

  return (
    <div className="stats-container">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>{currentService}</h1>
        <p style={{ color: '#64748b' }}>Análisis detallado de satisfacción y métricas de servicio.</p>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Placeholder metric cards */}
        {[
          { label: 'Promedio General', value: '4.8', icon: <Star color="#C5A02D" />, trend: '+2.4%' },
          { label: 'Encuestas Hoy', value: '124', icon: <Users color="#C5A02D" />, trend: '+12' },
          { label: 'Tasa de Respuesta', value: '88%', icon: <TrendingUp color="#C5A02D" />, trend: '+5%' }
        ].map((stat, idx) => (
          <div key={idx} style={{ 
            padding: '1.5rem', 
            background: '#fff', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>{stat.label}</span>
              {stat.icon}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a' }}>{stat.value}</span>
              <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '600' }}>{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        background: '#fff', 
        padding: '2rem', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        minHeight: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px dashed #e2e8f0'
      }}>
        <div style={{ textAlign: 'center', color: '#94a3b8' }}>
          <BarChart3 size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
          <p>Gráficos y analítica de {currentService} próximamente.</p>
        </div>
      </div>
    </div>
  );
};

export default Stats;
