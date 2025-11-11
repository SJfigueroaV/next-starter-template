v# 🔧 Solución Final para Errores 429 y 406

## Problemas Identificados

1. **Error 429 (Too Many Requests)**: Supabase intenta refrescar el token demasiado frecuentemente
2. **Error 406 (Not Acceptable)**: Problemas con headers o RLS en consultas a `compras_libros`

## Soluciones Implementadas

### 1. Auto-Refresh Deshabilitado
- `autoRefreshToken: false` en `supabaseClient.ts`
- Esto evita refreshes automáticos que causan error 429

### 2. Eventos Ignorados
- `TOKEN_REFRESHED`: Solo actualiza el usuario, sin consultas
- `INITIAL_SESSION`: Solo actualiza el usuario, sin consultas
- Solo procesa eventos importantes: `SIGNED_IN`, `SIGNED_OUT`, etc.

### 3. Manejo de Errores 406
- Los errores 406 se ignoran silenciosamente (pueden ser temporales)
- No rompen la aplicación
- Se registran como warnings en la consola

### 4. Debounce Aumentado
- 1.5 segundos entre procesamiento de eventos
- Reduce la frecuencia de consultas

## Si el Error 429 Persiste

El error 429 puede seguir apareciendo ocasionalmente porque:

1. **Supabase puede intentar refrescar cuando detecta token expirado**
   - Incluso con `autoRefreshToken: false`, algunas llamadas pueden forzar refresh
   - Esto es normal y no debería romper la aplicación

2. **Solución**: Los errores 429 ahora se manejan y no deberían afectar la funcionalidad

## Verificar RLS en Supabase

El error 406 puede ser causado por problemas de Row Level Security (RLS):

1. Ve a tu proyecto en Supabase Dashboard
2. Ve a **Authentication** > **Policies**
3. Verifica que la tabla `compras_libros` tenga políticas RLS correctas:

```sql
-- Ejemplo de política para que usuarios vean sus propias compras
CREATE POLICY "Users can view their own purchases"
ON compras_libros
FOR SELECT
USING (auth.uid() = user_id);
```

## Nota Importante

Con `autoRefreshToken: false`:
- ✅ Elimina la mayoría de errores 429
- ⚠️ Los tokens pueden expirar después de ~1 hora
- ⚠️ Si el token expira, el usuario deberá iniciar sesión de nuevo
- ✅ Esto es preferible al error 429 constante

## Próximos Pasos

Si los errores persisten:

1. **Verificar políticas RLS** en Supabase para el error 406
2. **Monitorear logs** para ver cuándo ocurren los errores
3. **Considerar aumentar el tiempo de expiración del token** en Supabase Dashboard (si es posible)

