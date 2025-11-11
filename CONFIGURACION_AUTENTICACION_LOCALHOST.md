# 🔐 Configuración de Autenticación con Google en Localhost

## ✅ Cambios Realizados

1. **Actualizado `GoogleSignInButton.tsx`**: Ahora detecta automáticamente si estás en localhost o producción y usa la URL correcta.

2. **Creado `/auth/callback`**: Ruta para manejar el callback de OAuth después de autenticarse con Google.

## 📋 Pasos para Configurar en Supabase

Para que la autenticación funcione en localhost, necesitas agregar la URL de redirección en el Dashboard de Supabase:

### 1. Ir al Dashboard de Supabase
- Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
- Selecciona tu proyecto

### 2. Configurar URLs de Redirección
1. Ve a **Authentication** → **URL Configuration**
2. En **Site URL**, puedes dejar tu dominio de producción O cambiarlo temporalmente a:
   ```
   http://localhost:3000
   ```
   ⚠️ **IMPORTANTE**: La Site URL puede afectar las redirecciones. Si tienes problemas, cámbiala temporalmente a localhost durante el desarrollo.

3. En **Redirect URLs**, agrega las siguientes URLs (una por línea):

   **Para desarrollo (localhost):**
   ```
   http://localhost:3000/auth/callback
   ```

   **Para producción:**
   ```
   https://pedagogiacultivo.com/auth/callback
   ```

4. Haz clic en **Save**

### 3. Configurar Google OAuth (si aún no está configurado)
1. Ve a **Authentication** → **Providers**
2. Habilita **Google**
3. Agrega tus **Client ID** y **Client Secret** de Google Cloud Console
4. En **Authorized redirect URIs** en Google Cloud Console, agrega:
   ```
   https://[TU-PROYECTO-SUPABASE].supabase.co/auth/v1/callback
   ```
   (Esta URL la encontrarás en el Dashboard de Supabase → Authentication → URL Configuration)

## 🧪 Probar en Localhost

1. Asegúrate de que tu servidor de desarrollo esté corriendo:
   ```bash
   npm run dev
   ```

2. Abre tu navegador en `http://localhost:3000`

3. Haz clic en "Iniciar sesión con Google"

4. Deberías ser redirigido a Google para autenticarte

5. Después de autenticarte, serás redirigido de vuelta a `http://localhost:3000/auth/callback` y luego a la página principal

## 🔍 Verificar que Funciona

Después de iniciar sesión, deberías poder:
- Ver tu información de usuario en la aplicación
- Comprar libros (si estás en `/libros`)
- Leer libros que hayas comprado

## ⚠️ Notas Importantes

- **En desarrollo**: La URL de redirección será automáticamente `http://localhost:3000/auth/callback`
- **En producción**: Asegúrate de tener configurada la variable de entorno `NEXT_PUBLIC_SITE_URL` con tu dominio de producción
- **Supabase**: Asegúrate de que ambas URLs (localhost y producción) estén en la lista de Redirect URLs permitidas

## 🐛 Solución de Problemas

**Error: "redirect_uri_mismatch"**
- Verifica que `http://localhost:3000/auth/callback` esté en la lista de Redirect URLs en Supabase
- Verifica que el puerto sea el correcto (por defecto es 3000)

**Error: "Invalid redirect URL"**
- Asegúrate de que la URL en Supabase coincida exactamente con la que estás usando
- No incluyas la barra final (`/`) a menos que sea necesaria

**No se redirige después del login**
- Verifica que la ruta `/auth/callback` existe y está funcionando
- Revisa la consola del navegador para ver errores

