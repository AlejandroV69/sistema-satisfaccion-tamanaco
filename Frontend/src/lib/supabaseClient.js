/**
 * @file lib/supabaseClient.js
 * @description Cliente singleton para la inicialización y conexión con la API de Supabase.
 * Utiliza variables de entorno para autenticar las peticiones del frontend.
 */

import { createClient } from '@supabase/supabase-js';

// Lectura de variables de entorno de Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validación de credenciales de Supabase
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL and Anon Key are required. Check your .env file.");
}

/**
 * Instancia compartida del cliente de Supabase
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);