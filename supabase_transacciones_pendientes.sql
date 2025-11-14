-- ============================================
-- TABLA DE TRANSACCIONES PENDIENTES
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

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_trans_pendientes_user_email ON transacciones_pendientes(user_email);
CREATE INDEX IF NOT EXISTS idx_trans_pendientes_user_id ON transacciones_pendientes(user_id);
CREATE INDEX IF NOT EXISTS idx_trans_pendientes_reference ON transacciones_pendientes(reference);
CREATE INDEX IF NOT EXISTS idx_trans_pendientes_estado ON transacciones_pendientes(estado);
CREATE INDEX IF NOT EXISTS idx_trans_pendientes_libro_id ON transacciones_pendientes(libro_id);
CREATE INDEX IF NOT EXISTS idx_trans_pendientes_expires_at ON transacciones_pendientes(expires_at);

-- Políticas de seguridad (Row Level Security)
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

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_trans_pendientes_updated_at
  BEFORE UPDATE ON transacciones_pendientes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Función para limpiar transacciones pendientes expiradas (ejecutar periódicamente)
-- Devuelve el número de transacciones eliminadas
CREATE OR REPLACE FUNCTION limpiar_transacciones_pendientes_expiradas()
RETURNS TABLE(deleted_count BIGINT) AS $$
DECLARE
  deleted_rows BIGINT;
BEGIN
  DELETE FROM transacciones_pendientes
  WHERE expires_at < NOW() AND estado != 'completado';
  
  GET DIAGNOSTICS deleted_rows = ROW_COUNT;
  
  RETURN QUERY SELECT deleted_rows;
END;
$$ LANGUAGE plpgsql;

