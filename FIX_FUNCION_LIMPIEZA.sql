-- ============================================
-- SCRIPT PARA CORREGIR LA FUNCIÓN DE LIMPIEZA
-- ============================================
-- Ejecuta este script si obtuviste el error:
-- "cannot change return type of existing function"
-- ============================================

-- Eliminar la función existente (intenta con diferentes firmas posibles)
DROP FUNCTION IF EXISTS limpiar_transacciones_pendientes_expiradas();
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

