# ✅ Verificar Políticas RLS en Supabase

## Pasos para Verificar y Corregir el Error 406

### Paso 1: Verificar que las Políticas Existen

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Ve a **SQL Editor**
3. Ejecuta esta consulta para ver las políticas existentes:

```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'compras_libros';
```

### Paso 2: Si No Hay Políticas, Crearlas

Ejecuta este script completo en el **SQL Editor**:

```sql
-- Habilitar RLS si no está habilitado
ALTER TABLE compras_libros ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si hay conflictos
DROP POLICY IF EXISTS "Usuarios pueden ver sus propias compras" ON compras_libros;
DROP POLICY IF EXISTS "Usuarios pueden crear sus propias compras" ON compras_libros;
DROP POLICY IF EXISTS "Usuarios y servicio pueden actualizar compras" ON compras_libros;

-- Política 1: Usuarios pueden ver sus propias compras
CREATE POLICY "Usuarios pueden ver sus propias compras"
  ON compras_libros FOR SELECT
  USING (auth.uid() = user_id);

-- Política 2: Usuarios pueden insertar sus propias compras
CREATE POLICY "Usuarios pueden crear sus propias compras"
  ON compras_libros FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política 3: Permitir actualizaciones (para webhooks y cambios de estado)
CREATE POLICY "Usuarios y servicio pueden actualizar compras"
  ON compras_libros FOR UPDATE
  USING (true)
  WITH CHECK (true);
```

### Paso 3: Verificar que Funciona

Ejecuta esta consulta de prueba (reemplaza `TU_USER_ID` con tu ID de usuario):

```sql
-- Verificar que puedes ver tus propias compras
SELECT * FROM compras_libros 
WHERE user_id = auth.uid();
```

### Paso 4: Si el Error 406 Persiste

1. **Verifica que estás autenticado:**
   ```sql
   SELECT auth.uid(), auth.email();
   ```
   Debería retornar tu ID de usuario y email.

2. **Verifica que RLS está habilitado:**
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE tablename = 'compras_libros';
   ```
   `rowsecurity` debería ser `true`.

3. **Prueba deshabilitar RLS temporalmente** (SOLO PARA DEBUG):
   ```sql
   ALTER TABLE compras_libros DISABLE ROW LEVEL SECURITY;
   ```
   Si esto resuelve el error 406, entonces el problema es con las políticas.
   **Recuerda volver a habilitarlo:**
   ```sql
   ALTER TABLE compras_libros ENABLE ROW LEVEL SECURITY;
   ```

## Solución Rápida (Solo para Desarrollo)

Si necesitas una solución rápida para desarrollo, puedes crear una política más permisiva:

```sql
-- Política permisiva (SOLO PARA DESARROLLO)
DROP POLICY IF EXISTS "Desarrollo: Permitir todo" ON compras_libros;

CREATE POLICY "Desarrollo: Permitir todo"
  ON compras_libros
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

⚠️ **ADVERTENCIA:** Esta política permite que cualquier usuario vea y modifique todas las compras. Solo úsala en desarrollo.

## Para Producción

Usa las políticas restrictivas del Paso 2, que solo permiten:
- Ver tus propias compras
- Crear tus propias compras
- Actualizar compras (necesario para webhooks)

