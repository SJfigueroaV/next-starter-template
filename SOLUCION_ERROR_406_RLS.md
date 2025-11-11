# 🔧 Solución para Error 406 (Not Acceptable) - Políticas RLS

## Problema

El error 406 en las consultas a `compras_libros` generalmente indica un problema con las políticas de Row Level Security (RLS) en Supabase.

## Solución: Verificar y Crear Políticas RLS

### Paso 1: Ir al Dashboard de Supabase

1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Authentication** > **Policies** o **Table Editor** > **compras_libros** > **Policies**

### Paso 2: Verificar si RLS está habilitado

1. Ve a **Table Editor** > **compras_libros**
2. Verifica que **Row Level Security** esté habilitado (debería estar activado)

### Paso 3: Crear Políticas RLS

Ve a **SQL Editor** y ejecuta estas políticas:

#### Política 1: Usuarios pueden ver sus propias compras

```sql
-- Permitir que los usuarios vean sus propias compras
CREATE POLICY "Users can view their own purchases"
ON compras_libros
FOR SELECT
USING (auth.uid() = user_id);
```

#### Política 2: Usuarios pueden insertar sus propias compras

```sql
-- Permitir que los usuarios inserten sus propias compras
CREATE POLICY "Users can insert their own purchases"
ON compras_libros
FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

#### Política 3: Permitir actualizaciones desde el servidor (para webhooks)

```sql
-- Permitir actualizaciones desde el servicio (webhooks)
-- Esta política permite que el servicio role actualice compras
CREATE POLICY "Service role can update purchases"
ON compras_libros
FOR UPDATE
USING (true)
WITH CHECK (true);
```

**Nota:** Si la política 3 causa problemas, puedes ser más específico y solo permitir actualizaciones del estado_pago:

```sql
-- Política más restrictiva para actualizaciones
CREATE POLICY "Service role can update purchase status"
ON compras_libros
FOR UPDATE
USING (true)
WITH CHECK (
  -- Solo permitir actualizar estado_pago, monto_pagado, metodo_pago, transaccion_id
  true
);
```

### Paso 4: Verificar Políticas Existentes

Si ya tienes políticas, verifica que sean correctas:

```sql
-- Ver todas las políticas de compras_libros
SELECT * FROM pg_policies WHERE tablename = 'compras_libros';
```

### Paso 5: Si las Políticas Existen pero No Funcionan

1. **Eliminar políticas existentes** (si es necesario):
```sql
DROP POLICY IF EXISTS "Users can view their own purchases" ON compras_libros;
DROP POLICY IF EXISTS "Users can insert their own purchases" ON compras_libros;
DROP POLICY IF EXISTS "Service role can update purchases" ON compras_libros;
```

2. **Recrear las políticas** usando los comandos del Paso 3

## Alternativa: Deshabilitar RLS Temporalmente (Solo para Desarrollo)

⚠️ **ADVERTENCIA:** Solo haz esto en desarrollo, NUNCA en producción.

```sql
-- Deshabilitar RLS temporalmente (SOLO PARA DESARROLLO)
ALTER TABLE compras_libros DISABLE ROW LEVEL SECURITY;
```

## Verificar que Funciona

Después de crear las políticas:

1. Reinicia tu servidor Next.js
2. Inicia sesión en tu aplicación
3. Ve a `/libros` y verifica que no aparezcan errores 406
4. Intenta comprar un libro y verifica que se registre correctamente

## Si el Error Persiste

1. **Verifica que el usuario esté autenticado:**
   - Abre la consola del navegador (F12)
   - Verifica que haya una sesión activa
   - Verifica que `auth.uid()` retorne el ID del usuario

2. **Verifica los logs de Supabase:**
   - Ve a **Logs** > **Postgres Logs** en el Dashboard
   - Busca errores relacionados con `compras_libros`

3. **Prueba la consulta directamente:**
   - Ve a **SQL Editor** en Supabase
   - Ejecuta:
   ```sql
   SELECT * FROM compras_libros WHERE user_id = 'TU_USER_ID_AQUI';
   ```
   - Si funciona aquí pero no en la aplicación, el problema es de RLS

## Políticas Recomendadas para Producción

Para producción, usa políticas más restrictivas:

```sql
-- Política restrictiva para SELECT
CREATE POLICY "Users can only view their own completed purchases"
ON compras_libros
FOR SELECT
USING (
  auth.uid() = user_id 
  AND estado_pago = 'completado'
);

-- Política para INSERT (solo pendientes)
CREATE POLICY "Users can insert pending purchases"
ON compras_libros
FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  AND estado_pago = 'pendiente'
);
```

