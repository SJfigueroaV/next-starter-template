-- ============================================
-- SCRIPT COMPLETO DE CONFIGURACIÓN
-- ============================================
-- Ejecuta este script completo en el SQL Editor de Supabase
-- Dashboard > SQL Editor > New Query
-- 
-- IMPORTANTE: Ejecuta todo este script de una vez
-- ============================================

-- ============================================
-- PARTE 1: ESQUEMA BASE DE LIBROS
-- ============================================

-- 1. Tabla de libros
CREATE TABLE IF NOT EXISTS libros (
  id BIGSERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  autor VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  portada_url TEXT,
  archivo_pdf_url TEXT,
  categoria VARCHAR(100),
  fecha_publicacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  isbn VARCHAR(20),
  paginas INTEGER,
  idioma VARCHAR(10) DEFAULT 'es',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de compras de libros
CREATE TABLE IF NOT EXISTS compras_libros (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  libro_id BIGINT NOT NULL REFERENCES libros(id) ON DELETE CASCADE,
  fecha_compra TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  estado_pago VARCHAR(50) DEFAULT 'pendiente', -- 'pendiente', 'completado', 'cancelado', 'reembolsado'
  monto_pagado DECIMAL(10, 2) NOT NULL,
  metodo_pago VARCHAR(50), -- 'wompi', 'nequi', 'pse', 'card', etc.
  transaccion_id VARCHAR(255), -- ID de la transacción del proveedor de pago
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, libro_id) -- Un usuario solo puede comprar un libro una vez
);

-- Índices para mejorar el rendimiento (libros y compras)
CREATE INDEX IF NOT EXISTS idx_libros_categoria ON libros(categoria);
CREATE INDEX IF NOT EXISTS idx_libros_fecha_publicacion ON libros(fecha_publicacion DESC);
CREATE INDEX IF NOT EXISTS idx_compras_user_id ON compras_libros(user_id);
CREATE INDEX IF NOT EXISTS idx_compras_libro_id ON compras_libros(libro_id);
CREATE INDEX IF NOT EXISTS idx_compras_estado_pago ON compras_libros(estado_pago);

-- Políticas de seguridad (Row Level Security) para libros y compras
ALTER TABLE libros ENABLE ROW LEVEL SECURITY;
ALTER TABLE compras_libros ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden ver los libros
CREATE POLICY "Los libros son públicos para lectura"
  ON libros FOR SELECT
  USING (true);

-- Política: Solo usuarios autenticados pueden ver sus compras
CREATE POLICY "Usuarios pueden ver sus propias compras"
  ON compras_libros FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Solo usuarios autenticados pueden insertar compras
CREATE POLICY "Usuarios pueden crear sus propias compras"
  ON compras_libros FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Permitir actualizaciones (necesario para webhooks y actualizaciones del estado)
CREATE POLICY "Usuarios y servicio pueden actualizar compras"
  ON compras_libros FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_libros_updated_at
  BEFORE UPDATE ON libros
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compras_libros_updated_at
  BEFORE UPDATE ON compras_libros
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PARTE 2: TABLA DE TRANSACCIONES PENDIENTES
-- ============================================
-- Esta tabla guarda el estado de los pagos antes de redirigir a Wompi
-- Vincula el pago con el email del usuario para poder procesarlo
-- incluso si el usuario sale de la página y pierde las cookies

CREATE TABLE IF NOT EXISTS transacciones_pendientes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email VARCHAR(255) NOT NULL, -- Email del usuario (para vincular sin cookies)
  libro_id BIGINT NOT NULL REFERENCES libros(id) ON DELETE CASCADE,
  reference VARCHAR(255) NOT NULL UNIQUE, -- Referencia única de Wompi
  monto DECIMAL(10, 2) NOT NULL,
  estado VARCHAR(50) DEFAULT 'pendiente', -- 'pendiente', 'procesando', 'completado', 'cancelado'
  transaccion_wompi_id VARCHAR(255), -- ID de la transacción de Wompi (cuando esté disponible)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  procesado_at TIMESTAMP WITH TIME ZONE, -- Fecha en que se procesó la transacción
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days') -- Expira después de 7 días
);

-- Índices para mejorar el rendimiento (transacciones pendientes)
CREATE INDEX IF NOT EXISTS idx_trans_pendientes_user_email ON transacciones_pendientes(user_email);
CREATE INDEX IF NOT EXISTS idx_trans_pendientes_user_id ON transacciones_pendientes(user_id);
CREATE INDEX IF NOT EXISTS idx_trans_pendientes_reference ON transacciones_pendientes(reference);
CREATE INDEX IF NOT EXISTS idx_trans_pendientes_estado ON transacciones_pendientes(estado);
CREATE INDEX IF NOT EXISTS idx_trans_pendientes_libro_id ON transacciones_pendientes(libro_id);
CREATE INDEX IF NOT EXISTS idx_trans_pendientes_expires_at ON transacciones_pendientes(expires_at);

-- Políticas de seguridad (Row Level Security) para transacciones pendientes
ALTER TABLE transacciones_pendientes ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver sus propias transacciones pendientes
CREATE POLICY "Usuarios pueden ver sus propias transacciones pendientes"
  ON transacciones_pendientes FOR SELECT
  USING (
    auth.uid() = user_id OR 
    auth.jwt() ->> 'email' = user_email
  );

-- Política: Los usuarios pueden crear sus propias transacciones pendientes
CREATE POLICY "Usuarios pueden crear sus propias transacciones pendientes"
  ON transacciones_pendientes FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR 
    auth.jwt() ->> 'email' = user_email
  );

-- Política: Permitir actualizaciones (necesario para webhooks y procesamiento)
CREATE POLICY "Usuarios y servicio pueden actualizar transacciones pendientes"
  ON transacciones_pendientes FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Trigger para actualizar updated_at automáticamente (transacciones pendientes)
CREATE TRIGGER update_trans_pendientes_updated_at
  BEFORE UPDATE ON transacciones_pendientes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PARTE 3: FUNCIÓN DE LIMPIEZA AUTOMÁTICA
-- ============================================
-- Función para limpiar transacciones pendientes expiradas
-- Se ejecuta automáticamente cuando se verifica pagos pendientes
-- Devuelve el número de transacciones eliminadas

-- Primero eliminar la función si existe (por si tiene un tipo de retorno diferente)
-- Usar CASCADE para eliminar dependencias si las hay
DROP FUNCTION IF EXISTS limpiar_transacciones_pendientes_expiradas() CASCADE;

-- Crear la función con el tipo de retorno correcto
CREATE OR REPLACE FUNCTION limpiar_transacciones_pendientes_expiradas()
RETURNS TABLE(deleted_count BIGINT) AS $$
DECLARE
  deleted_rows BIGINT;
BEGIN
  DELETE FROM transacciones_pendientes
  WHERE expires_at < NOW() AND estado != 'completado';
  
  GET DIAGNOSTICS deleted_rows = ROW_COUNT;
  
  RETURN QUERY SELECT deleted_rows;
  
  -- Log opcional (puedes ver esto en los logs de Supabase)
  RAISE NOTICE 'Transacciones pendientes expiradas eliminadas: %', deleted_rows;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
-- 
-- NOTAS IMPORTANTES:
-- 1. Este script crea todas las tablas, índices, políticas y funciones necesarias
-- 2. Las transacciones pendientes expiradas se limpian automáticamente cuando:
--    - Un usuario hace clic en "Verificar Pagos Pendientes"
--    - Un usuario inicia sesión (verificación automática)
-- 3. Las transacciones pendientes expiran después de 7 días
-- 4. Las transacciones completadas NO se eliminan (se mantienen como registro histórico)
--
-- ============================================

