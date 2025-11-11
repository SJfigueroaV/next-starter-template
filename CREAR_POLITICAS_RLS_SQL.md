# 🔧 Crear Políticas RLS con SQL Directo

## Problema

La interfaz de Supabase a veces genera SQL incorrecto para políticas SELECT (usa `WITH CHECK` en lugar de `USING`).

## Solución: Usar SQL Editor Directamente

### Paso 1: Ir al SQL Editor

1. Ve a tu proyecto en Supabase Dashboard
2. Ve a **SQL Editor** (en el menú lateral)
3. Click en **New Query**

### Paso 2: Eliminar Políticas Existentes (si hay problemas)

```sql
-- Eliminar políticas existentes si hay conflictos
DROP POLICY IF EXISTS "Usuarios pueden ver sus propias compras" ON compras_libros;
DROP POLICY IF EXISTS "Usuarios pueden crear sus propias compras" ON compras_libros;
DROP POLICY IF EXISTS "Service role can update purchases" ON compras_libros;
DROP POLICY IF EXISTS "Usuarios y servicio pueden actualizar compras" ON compras_libros;
```

### Paso 3: Crear las 3 Políticas Correctamente

Copia y pega este script completo en el SQL Editor y ejecútalo:

```sql
-- Asegurar que RLS está habilitado
ALTER TABLE compras_libros ENABLE ROW LEVEL SECURITY;

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

-- Política 3: UPDATE - Permitir actualizaciones (para webhooks)
CREATE POLICY "Usuarios y servicio pueden actualizar compras"
ON compras_libros
FOR UPDATE
USING (true)
WITH CHECK (true);
```

### Paso 4: Verificar que se Crearon Correctamente

Ejecuta esta consulta para ver las políticas:

```sql
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'compras_libros'
ORDER BY cmd;
```

Deberías ver 3 políticas:
- Una con `cmd = 'SELECT'` y `qual` conteniendo `auth.uid() = user_id`
- Una con `cmd = 'INSERT'` y `with_check` conteniendo `auth.uid() = user_id`
- Una con `cmd = 'UPDATE'` y `qual = 'true'` y `with_check = 'true'`

## Si Aún Hay Errores

Si después de ejecutar el SQL sigues teniendo problemas:

1. **Verifica que RLS está habilitado:**
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE tablename = 'compras_libros';
   ```
   `rowsecurity` debe ser `true`.

2. **Verifica que no hay políticas duplicadas:**
   ```sql
   SELECT policyname, COUNT(*) 
   FROM pg_policies 
   WHERE tablename = 'compras_libros'
   GROUP BY policyname
   HAVING COUNT(*) > 1;
   ```
   No debería retornar nada.

3. **Si hay duplicados, elimínalos:**
   ```sql
   -- Ver todas las políticas
   SELECT * FROM pg_policies WHERE tablename = 'compras_libros';
   
   -- Eliminar duplicados manualmente
   DROP POLICY IF EXISTS "nombre_de_la_politica_duplicada" ON compras_libros;
   ```

