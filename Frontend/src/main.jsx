/**
 * @file main.jsx
 * @description Punto de entrada principal de la aplicación React.
 * Inicializa el árbol de componentes React e inyecta la aplicación en el DOM.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Montaje del componente raíz en el elemento con id 'root'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

