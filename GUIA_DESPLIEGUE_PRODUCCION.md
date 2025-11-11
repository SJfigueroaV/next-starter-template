# 🚀 Guía de Despliegue a Producción

Esta guía te ayudará a desplegar tu aplicación Next.js con Supabase y Wompi a producción.

## 📋 Checklist Pre-Despliegue

### 1. Variables de Entorno

Asegúrate de tener todas estas variables configuradas en tu plataforma de hosting (Vercel, Netlify, etc.):

#### Variables de Supabase
```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

#### Variables de Wompi (Producción)
```
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_prod_xxxxx
WOMPI_PRIVATE_KEY=prv_prod_xxxxx
WOMPI_INTEGRITY_SECRET=tu-integrity-secret
```

⚠️ **IMPORTANTE**: 
- En producción, usa las claves de **producción** de Wompi (no las de prueba)
- El `WOMPI_INTEGRITY_SECRET` debe ser el mismo que configures en el Dashboard de Wompi

### 2. Configuración en Supabase

#### A. Site URL
1. Ve a **Authentication** → **URL Configuration**
2. Cambia la **Site URL** a tu dominio de producción:
   ```
   https://tu-dominio.com
   ```
   (Reemplaza `tu-dominio.com` con tu dominio real)

#### B. Redirect URLs
En **Redirect URLs**, agrega las siguientes URLs (una por línea):

```
https://tu-dominio.com/auth/callback
https://tu-dominio.com
```

⚠️ **IMPORTANTE**: 
- Reemplaza `tu-dominio.com` con tu dominio real
- No incluyas la barra final (`/`) a menos que sea necesaria
- Mantén también la URL de localhost si quieres seguir desarrollando:
  ```
  http://localhost:3000/auth/callback
  ```

#### C. Verificar Google OAuth
1. Ve a **Authentication** → **Providers** → **Google**
2. Verifica que esté habilitado
3. En **Google Cloud Console**, asegúrate de que la URL de callback de Supabase esté en **Authorized redirect URIs**:
   ```
   https://[TU-PROYECTO-SUPABASE].supabase.co/auth/v1/callback
   ```
   (Esta URL la encontrarás en Supabase → Authentication → URL Configuration)

### 3. Configuración en Wompi

#### A. Webhook de Producción
1. Ve al **Dashboard de Wompi** → **Configuración** → **Webhooks**
2. Agrega un nuevo webhook:
   - **URL**: `https://tu-dominio.com/api/wompi/webhook`
   - **Eventos**: Selecciona `transaction.updated`
3. Guarda y copia el **Integrity Secret**
4. Agrega este **Integrity Secret** a las variables de entorno como `WOMPI_INTEGRITY_SECRET`

⚠️ **IMPORTANTE**: 
- El webhook debe usar HTTPS (no HTTP)
- El Integrity Secret debe coincidir exactamente con el que configuraste en las variables de entorno

#### B. Verificar Claves de Producción
- Asegúrate de estar usando las claves de **producción** (no las de prueba)
- Las claves de producción empiezan con `pub_prod_` y `prv_prod_`
- Las claves de prueba empiezan con `pub_test_` y `prv_test_`

### 4. Configuración en tu Plataforma de Hosting

#### Si usas Vercel:
1. Ve a tu proyecto en Vercel
2. **Settings** → **Environment Variables**
3. Agrega todas las variables de entorno mencionadas arriba
4. Selecciona el entorno (Production, Preview, Development)
5. Haz clic en **Save**

#### Si usas Netlify:
1. Ve a tu sitio en Netlify
2. **Site settings** → **Environment variables**
3. Agrega todas las variables de entorno
4. Haz clic en **Save**

#### Si usas otro hosting:
- Consulta la documentación de tu plataforma para agregar variables de entorno

### 5. Verificar el Despliegue

Después de desplegar, verifica:

1. **Autenticación con Google**:
   - Ve a `https://tu-dominio.com`
   - Haz clic en "Iniciar sesión con Google"
   - Deberías poder autenticarte correctamente

2. **Pagos con Wompi**:
   - Inicia sesión
   - Ve a `/libros` y selecciona un libro
   - Haz clic en "Comprar ahora"
   - Deberías ser redirigido a Wompi
   - Completa un pago de prueba
   - Deberías ser redirigido de vuelta y poder leer el libro

3. **Webhook de Wompi**:
   - En el Dashboard de Wompi, ve a **Transacciones**
   - Verifica que las transacciones se estén registrando
   - Si no se registran automáticamente, el sistema tiene un fallback que verifica manualmente

## 🔍 Solución de Problemas

### Error: "redirect_uri_mismatch"
- Verifica que `https://tu-dominio.com/auth/callback` esté en la lista de Redirect URLs en Supabase
- Verifica que la Site URL en Supabase sea `https://tu-dominio.com`

### Error: "Invalid redirect URL"
- Asegúrate de que las URLs en Supabase coincidan exactamente con tu dominio
- No incluyas la barra final (`/`) a menos que sea necesaria
- Verifica que uses HTTPS (no HTTP) en producción

### Los pagos no se registran
- Verifica que el webhook de Wompi esté configurado correctamente
- Verifica que el `WOMPI_INTEGRITY_SECRET` coincida con el del Dashboard de Wompi
- Revisa los logs del servidor para ver si hay errores

### No puedo leer los libros después de comprar
- Verifica que las cookies de sesión se estén estableciendo correctamente
- Revisa los logs del servidor para ver si hay errores de autenticación
- El sistema tiene un fallback que permite acceso temporal después del pago

## 📝 Resumen de URLs a Configurar

### En Supabase:
1. **Site URL**: `https://tu-dominio.com`
2. **Redirect URLs**:
   - `https://tu-dominio.com/auth/callback`
   - `https://tu-dominio.com`
   - (Opcional: `http://localhost:3000/auth/callback` para desarrollo)

### En Wompi:
1. **Webhook URL**: `https://tu-dominio.com/api/wompi/webhook`

### En Google Cloud Console:
1. **Authorized redirect URIs**: 
   - `https://[TU-PROYECTO-SUPABASE].supabase.co/auth/v1/callback`

## ✅ Listo para Producción

Una vez que hayas completado todos estos pasos, tu aplicación debería estar lista para producción. Si encuentras algún problema, revisa los logs del servidor y la consola del navegador para más detalles.

