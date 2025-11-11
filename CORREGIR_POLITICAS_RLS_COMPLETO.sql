-- ============================================
-- 🔧 SCRIPT COMPLETO PARA CORREGIR POLÍTICAS RLS
-- ============================================
-- Este script corrige el error 406 en compras_libros
-- Ejecuta este script completo en el SQL Editor de Supabase
-- ============================================

-- Paso 1: Verificar que RLS está habilitado
ALTER TABLE compras_libros ENABLE ROW LEVEL SECURITY;

-- Paso 2: Eliminar TODAS las políticas existentes para evitar conflictos
DROP POLICY IF EXISTS "Usuarios pueden ver sus propias compras" ON compras_libros;
DROP POLICY IF EXISTS "Users can view their own purchases" ON compras_libros;
DROP POLICY IF EXISTS "Usuarios pueden crear sus propias compras" ON compras_libros;
DROP POLICY IF EXISTS "Users can insert their own purchases" ON compras_libros;
DROP POLICY IF EXISTS "Usuarios y servicio pueden actualizar compras" ON compras_libros;
DROP POLICY IF EXISTS "Service role can update purchases" ON compras_libros;
DROP POLICY IF EXISTS "Service role can update purchase status" ON compras_libros;
DROP POLICY IF EXISTS "Desarrollo: Permitir todo" ON compras_libros;

-- Paso 3: Crear las políticas correctamente

-- Política 1: SELECT - Usuarios pueden ver sus propias compras
CREATE POLICY "Usuarios pueden ver sus propias compras"
ON compras_libros
FOR SELECT
USING (auth.uid() = user_id);

-- Política 2: INSERT - Usuarios pueden crear sus propias compras
CREATE POLICY "Usuarios pueden crear sus propias compras"
ON compras_libros
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política 3: UPDATE - Permitir actualizaciones (necesario para webhooks)
CREATE POLICY "Usuarios y servicio pueden actualizar compras"
ON compras_libros
FOR UPDATE
USING (true)
WITH CHECK (true);

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar que las políticas se crearon correctamente
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'compras_libros'
ORDER BY cmd;

-- Deberías ver 3 políticas:
-- 1. SELECT con qual = 'auth.uid() = user_id'
-- 2. INSERT con with_check = 'auth.uid() = user_id'
-- 3. UPDATE con qual = 'true' y with_check = 'true'

-- ============================================
-- PRUEBA (Opcional - ejecuta esto mientras estás autenticado)
-- ============================================

-- Verificar que puedes ver tus propias compras
-- NOTA: Esto solo funciona si estás autenticado en Supabase
-- SELECT * FROM compras_libros WHERE user_id = auth.uid();

