-- ============================================
-- CONFIGURACIÓN DE LIMPIEZA AUTOMÁTICA
-- ============================================
-- Este script configura la limpieza automática de transacciones pendientes expiradas
-- Ejecuta este script en el SQL Editor de Supabase

-- Opción 1: Usar pg_cron (si está habilitado en tu plan de Supabase)
-- Esto ejecutará la limpieza diariamente a las 2:00 AM UTC
-- NOTA: pg_cron solo está disponible en planes Pro y superiores

-- Primero, verifica si pg_cron está disponible:
-- SELECT * FROM pg_extension WHERE extname = 'pg_cron';

-- Si pg_cron está disponible, descomenta y ejecuta esto:
/*
SELECT cron.schedule(
  'limpiar-transacciones-pendientes-expiradas',
  '0 2 * * *', -- Todos los días a las 2:00 AM UTC
  $$SELECT limpiar_transacciones_pendientes_expiradas();$$
);
*/

-- Opción 2: Crear un trigger que limpie automáticamente al verificar
-- (Esta opción no requiere pg_cron y funciona en todos los planes)

-- Función mejorada que también limpia transacciones expiradas al verificar
CREATE OR REPLACE FUNCTION limpiar_transacciones_pendientes_expiradas()
RETURNS TABLE(deleted_count BIGINT) AS $$
DECLARE
  deleted_rows BIGINT;
BEGIN
  DELETE FROM transacciones_pendientes
  WHERE expires_at < NOW() 
    AND estado != 'completado';
  
  GET DIAGNOSTICS deleted_rows = ROW_COUNT;
  
  RETURN QUERY SELECT deleted_rows;
  
  -- Log opcional (puedes ver esto en los logs de Supabase)
  RAISE NOTICE 'Transacciones pendientes expiradas eliminadas: %', deleted_rows;
END;
$$ LANGUAGE plpgsql;

-- Ahora, modificar el endpoint de verificación para que también limpie automáticamente
-- (Esto se hace en el código, no en SQL)

