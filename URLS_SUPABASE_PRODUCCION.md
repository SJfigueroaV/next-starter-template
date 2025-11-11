# 🔗 URLs a Configurar en Supabase para Producción

## 📍 Paso 1: Site URL

1. Ve a tu proyecto en Supabase Dashboard: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Authentication** → **URL Configuration**
4. En **Site URL**, cambia a:
   ```
   https://tu-dominio.com
   ```
   ⚠️ **Reemplaza `tu-dominio.com` con tu dominio real** (ej: `pedagogiacultivo.com`)

## 📍 Paso 2: Redirect URLs

En la misma página (**Authentication** → **URL Configuration**), en **Redirect URLs**, agrega las siguientes URLs (una por línea):

```
https://tu-dominio.com/auth/callback
https://tu-dominio.com
```

⚠️ **IMPORTANTE**: 
- Reemplaza `tu-dominio.com` con tu dominio real
- No incluyas la barra final (`/`) a menos que sea necesaria
- Si quieres seguir desarrollando en localhost, también agrega:
  ```
  http://localhost:3000/auth/callback
  ```

## 📍 Paso 3: Verificar Google OAuth

1. Ve a **Authentication** → **Providers** → **Google**
2. Verifica que esté **habilitado**
3. En **Google Cloud Console** (https://console.cloud.google.com):
   - Ve a **APIs & Services** → **Credentials**
   - Selecciona tu OAuth 2.0 Client ID
   - En **Authorized redirect URIs**, asegúrate de tener:
     ```
     https://[TU-PROYECTO-SUPABASE].supabase.co/auth/v1/callback
     ```
   - Para encontrar esta URL exacta, ve a Supabase → **Authentication** → **URL Configuration** y copia la URL que aparece en "Redirect URL"

## ✅ Ejemplo Completo

Si tu dominio es `pedagogiacultivo.com` y tu proyecto de Supabase es `cyyteaosunqpzqwvrwrq`, las URLs serían:

### Site URL:
```
https://pedagogiacultivo.com
```

### Redirect URLs:
```
https://pedagogiacultivo.com/auth/callback
https://pedagogiacultivo.com
http://localhost:3000/auth/callback
```

### Google Cloud Console - Authorized redirect URIs:
```
https://cyyteaosunqpzqwvrwrq.supabase.co/auth/v1/callback
```

## 🔍 Cómo Verificar que Está Configurado Correctamente

1. **Despliega tu aplicación** a producción
2. **Abre tu sitio** en el navegador: `https://tu-dominio.com`
3. **Haz clic en "Iniciar sesión con Google"**
4. **Deberías ser redirigido** a Google para autenticarte
5. **Después de autenticarte**, deberías ser redirigido de vuelta a tu sitio

Si hay algún error, revisa:
- Que las URLs en Supabase coincidan **exactamente** con tu dominio
- Que uses **HTTPS** (no HTTP) en producción
- Que no haya espacios o caracteres extra en las URLs
- Los logs de la consola del navegador para ver errores específicos

