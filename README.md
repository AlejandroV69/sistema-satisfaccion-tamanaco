# 🏨 Hotel Tamanaco - Sistema de Satisfacción y Dashboard Admin

Un sistema premium de encuestas y panel administrativo diseñado para el **Hotel Tamanaco**, enfocado en la excelencia del servicio y la recolección de datos de huéspedes a nivel global.

![Luxury Resort](file:///C:/Users/pc/.gemini/antigravity/brain/9408a126-8909-4201-bb84-e7f7c5b42012/luxury_hotel_pool_tamanaco_png_1775957456248.png)

## ✨ Características Principales

### 📋 Sistema de Encuestas (Huéspedes)
- **Interfaz Premium**: Diseño visual de lujo con tipografía sofisticada y detalles en dorado.
- **Selector Global**: Selector de códigos telefónicos para más de 240 países con banderas integradas.
- **Preguntas Dinámicas**: Carga de categorías y preguntas directamente desde Supabase.
- **Totalmente Responsivo**: Optimizado para que los huéspedes completen la encuesta desde sus dispositivos móviles con facilidad.

### 🔐 Panel Administrativo (Personal)
- **Autenticación Segura**: Sistema de login protegido mediante Supabase Auth.
- **Rutas Protegidas**: Seguridad reforzada que impide el acceso no autorizado y bloquea el reingreso tras cerrar sesión.
- **Dashboard de Gestión**: Visualización de estadísticas y gestión de preguntas/categorías en tiempo real.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18 / Vite
- **Estilos**: Tailwind CSS & Vanilla CSS (Luxury Custom Design)
- **Backend / DB**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Iconografía**: Lucide React
- **Navegación**: React Router DOM v6

## 🚀 Instalación y Configuración

1. **Clonar el repositorio**
   ```bash
   git clone [url-del-repo]
   cd hotel-tamanaco
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Variables de Entorno**
   Crea un archivo `.env` en la raíz del proyecto con tus credenciales de Supabase:
   ```env
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

## 📁 Estructura del Proyecto

```text
src/
├── components/       # Componentes reutilizables
│   └── layout/       # Navbar, Sidebar, AdminLayout
├── data/             # Datos estáticos (Países, etc.)
├── lib/              # Configuraciones de bibliotecas (Supabase)
├── pages/            # Páginas principales (Login, Survey, Settings)
└── App.jsx           # Rutas y configuración global
```

## 🎨 Diseño y Estética
El proyecto utiliza una paleta de colores curada:
- **Dorado Tamanaco**: `#C5A02D`
- **Oscuro Elegante**: `#0F172A`
- **Fondo Premium**: Imágenes de alta resolución del hotel y efectos de cristal (glassmorphism).

---
Desarrollado con ❤️ para la excelencia hotelera.
