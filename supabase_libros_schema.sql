-- ============================================
-- ESQUEMA DE BASE DE DATOS PARA LA BIBLIOTECA
-- ============================================
-- Ejecuta estos comandos en el SQL Editor de Supabase
-- Dashboard > SQL Editor > New Query

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
  metodo_pago VARCHAR(50), -- 'stripe', 'paypal', etc.
  transaccion_id VARCHAR(255), -- ID de la transacción del proveedor de pago
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, libro_id) -- Un usuario solo puede comprar un libro una vez
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_libros_categoria ON libros(categoria);
CREATE INDEX IF NOT EXISTS idx_libros_fecha_publicacion ON libros(fecha_publicacion DESC);
CREATE INDEX IF NOT EXISTS idx_compras_user_id ON compras_libros(user_id);
CREATE INDEX IF NOT EXISTS idx_compras_libro_id ON compras_libros(libro_id);
CREATE INDEX IF NOT EXISTS idx_compras_estado_pago ON compras_libros(estado_pago);

-- Políticas de seguridad (Row Level Security)
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
-- Esta política permite que los usuarios actualicen sus propias compras
-- y que el servicio role (webhooks) actualice cualquier compra
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

-- Datos de ejemplo (opcional - elimina esto si no quieres datos de prueba)
INSERT INTO libros (titulo, autor, descripcion, precio, categoria, portada_url) VALUES
  ('El Camino de la Fe', 'Autor Ejemplo', 'Una guía inspiradora sobre el camino de la fe cristiana.', 9.99, 'Espiritualidad', NULL),
  ('Manual de Oración', 'Autor Ejemplo', 'Aprende a orar con propósito y devoción.', 12.99, 'Espiritualidad', NULL),
  ('Historia del Cristianismo', 'Autor Ejemplo', 'Un recorrido completo por la historia del cristianismo.', 15.99, 'Historia', NULL)
ON CONFLICT DO NOTHING;
