# 🔗 Guía Paso a Paso: Configurar Webhook de Wompi

Esta guía te ayudará a configurar el webhook de Wompi para que tu aplicación reciba notificaciones cuando se completen los pagos.

## 📋 Requisitos Previos

- ✅ Cuenta en Wompi creada
- ✅ Claves de API obtenidas (Public Key y Private Key)
- ✅ Servidor de desarrollo corriendo (`npm run dev`)

---

## 🏠 Opción 1: Para Desarrollo Local (usando ngrok)

### Paso 1: Instalar ngrok

**Windows:**
1. Ve a [https://ngrok.com/download](https://ngrok.com/download)
2. Descarga el archivo ZIP
3. Extrae `ngrok.exe` a una carpeta (ej: `C:\ngrok`)
4. Opcional: Agrega la carpeta al PATH del sistema

**Mac:**
```bash
brew install ngrok
```

**Linux:**
```bash
# Descarga desde https://ngrok.com/download
# O usa snap: snap install ngrok
```

### Paso 2: Iniciar tu servidor Next.js

Abre una terminal y ejecuta:
```bash
npm run dev
```

Deberías ver algo como:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

**⚠️ IMPORTANTE:** Deja esta terminal abierta y corriendo.

### Paso 3: Exponer tu servidor con ngrok

Abre una **nueva terminal** (no cierres la anterior) y ejecuta:

```bash
ngrok http 3000
```

Verás algo como esto:
```
ngrok

Session Status                online
Account                       tu-email@ejemplo.com
Version                       3.x.x
Region                        United States (us)
Latency                       45ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123def456.ngrok.io -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**🔑 Copia la URL de "Forwarding"** (ej: `https://abc123def456.ngrok.io`)

**⚠️ IMPORTANTE:** 
- Esta URL cambiará cada vez que reinicies ngrok (en el plan gratuito)
- Si reinicias ngrok, tendrás que actualizar el webhook en Wompi con la nueva URL
- Considera usar ngrok con una URL fija si planeas desarrollar por varios días

### Paso 4: Configurar el Webhook en Wompi Dashboard

1. **Inicia sesión en Wompi:**
   - Ve a [https://wompi.co](https://wompi.co)
   - Inicia sesión con tus credenciales

2. **Navega a la sección de Programadores:**
   - En el menú lateral izquierdo, busca la sección **"Desarrollo"** (Development)
   - Click en **"Programadores"** o **"Developers"**
   - Deberías estar en la página de configuración técnica

3. **Configurar el Webhook (URL de Eventos):**
   
   En la página de "Programadores", busca la sección:
   - **"Seguimiento de transacciones"** (Transaction Tracking)
   
   Dentro de esta sección, verás un campo llamado:
   - **"URL de Eventos"** (Events URL) ← **¡Este es el webhook!**
   
   **⚠️ IMPORTANTE:** En Wompi, el webhook se llama **"URL de Eventos"**, no "Webhook".
   
   **Ingresa la URL del endpoint en el campo "URL de Eventos":**
   ```
   https://tu-url-ngrok.ngrok.io/api/wompi/webhook
   ```
   
   Reemplaza `tu-url-ngrok.ngrok.io` con la URL que copiaste de ngrok.
   
   **Ejemplo:**
   ```
   https://abc123def456.ngrok.io/api/wompi/webhook
   ```

4. **Guardar la configuración:**
   - Click en el botón verde **"Guardar"** (Save) que está debajo del campo "URL de Eventos"

5. **Obtener el Integrity Secret:**
   
   En la misma página de "Programadores", busca la sección:
   - **"Secretos para integración técnica"** (Secrets for Technical Integration)
   
   Dentro de esta sección, verás dos campos:
   - **"Eventos"** (Events) - Este es para verificar eventos del webhook
   - **"Integridad"** (Integrity) ← **¡Este es el Integrity Secret que necesitas!**
   
   **Para ver el secret:**
   - Click en el botón **"Mostrar"** (Show) que está al lado del campo "Integridad"
   - **CÓPIALO INMEDIATAMENTE** - es posible que no puedas verlo de nuevo
   - Es un string largo que se usa para verificar que las notificaciones vengan realmente de Wompi
   
   **⚠️ IMPORTANTE:** 
   - El Integrity Secret está en el campo **"Integridad"**, no "Integrity Secret"
   - Si no puedes verlo, asegúrate de hacer click en "Mostrar"
   - Guárdalo de forma segura, lo necesitarás para tu archivo `.env.local`

### Paso 5: Agregar el Integrity Secret a las variables de entorno

1. Abre tu archivo `.env.local` en la raíz del proyecto

2. Agrega o actualiza la variable:
   ```env
   WOMPI_INTEGRITY_SECRET=el_secret_que_copiaste_de_wompi
   ```

3. **Reinicia tu servidor Next.js:**
   - Detén el servidor (Ctrl+C en la terminal donde corre `npm run dev`)
   - Inícialo de nuevo: `npm run dev`

### Paso 6: Probar el webhook

1. **Asegúrate de que:**
   - ✅ Tu servidor Next.js está corriendo (`npm run dev`)
   - ✅ ngrok está corriendo (`ngrok http 3000`)
   - ✅ El webhook está configurado en Wompi
   - ✅ `WOMPI_INTEGRITY_SECRET` está en `.env.local`
   - ✅ Reiniciaste el servidor después de agregar el secret

2. **Realiza una transacción de prueba:**
   - Ve a tu aplicación: `http://localhost:3000`
   - Inicia sesión
   - Selecciona un libro y haz clic en "Comprar ahora"
   - Completa el pago en Wompi (usa tarjetas de prueba)

3. **Verificar que funcionó:**
   - En la terminal donde corre `npm run dev`, deberías ver logs como:
     ```
     Compra registrada: Usuario abc123, Libro 1, Transacción trx_xyz
     ```
   - En el Dashboard de Wompi, ve a **"Transacciones"** y verifica que el estado sea "APPROVED"
   - En Supabase, verifica la tabla `compras_libros` - debería haber un nuevo registro

---

## 🌐 Opción 2: Para Producción

### Paso 1: Obtener tu URL de producción

Tu aplicación debe estar desplegada en un dominio público (ej: Vercel, Netlify, etc.)

**Ejemplo de URL:**
```
https://tu-dominio.com/api/wompi/webhook
```

### Paso 2: Configurar el Webhook en Wompi Dashboard

1. **Inicia sesión en Wompi Dashboard**

2. **Ve a Configuración > Webhooks**

3. **Agregar nuevo webhook:**
   - URL: `https://tu-dominio.com/api/wompi/webhook`
   - Eventos: `transaction.updated`
   - Click en **"Guardar"**

4. **Copiar el Integrity Secret:**
   - Después de crear el webhook, copia el **Integrity Secret**

### Paso 3: Configurar variables de entorno en producción

En tu plataforma de hosting (Vercel, Netlify, etc.):

1. Ve a **Settings** > **Environment Variables**

2. Agrega:
   ```
   WOMPI_INTEGRITY_SECRET=el_secret_de_wompi
   ```

3. **Redeploy** tu aplicación para que los cambios surtan efecto

---

## 🔍 Verificar que el Webhook Funciona

### Método 1: Logs del servidor

Cuando se procesa un pago, deberías ver en los logs:
```
✅ Compra registrada: Usuario [user_id], Libro [libro_id], Transacción [transaction_id]
```

### Método 2: Dashboard de Wompi

1. Ve a **Transacciones** en el Dashboard de Wompi
2. Busca la transacción que acabas de hacer
3. Verifica que el estado sea **"APPROVED"**
4. Click en la transacción para ver detalles
5. Busca la sección **"Webhooks"** o **"Notificaciones"**
6. Deberías ver que el webhook fue enviado exitosamente

### Método 3: Base de datos Supabase

1. Ve a tu proyecto en Supabase
2. Abre la tabla `compras_libros`
3. Deberías ver un nuevo registro con:
   - `estado_pago = 'completado'`
   - `metodo_pago = 'nequi'` o `'pse'` o `'card'` (según el método usado)
   - `transaccion_id` con el ID de la transacción de Wompi

---

## 🐛 Troubleshooting

### Problema: "Firma del webhook inválida"

**Causa:** El `WOMPI_INTEGRITY_SECRET` no coincide con el que está configurado en Wompi.

**Solución:**
1. Ve al Dashboard de Wompi > Webhooks
2. Verifica que el Integrity Secret sea el correcto
3. Copia el secret nuevamente
4. Actualiza `WOMPI_INTEGRITY_SECRET` en `.env.local`
5. Reinicia el servidor

### Problema: "No se reciben notificaciones del webhook"

**Causas posibles:**
1. **ngrok no está corriendo** (en desarrollo local)
   - Solución: Inicia ngrok con `ngrok http 3000`

2. **URL del webhook incorrecta**
   - Solución: Verifica que la URL en Wompi sea exactamente: `https://tu-url.ngrok.io/api/wompi/webhook`

3. **Servidor Next.js no está corriendo**
   - Solución: Asegúrate de que `npm run dev` esté activo

4. **El webhook fue deshabilitado en Wompi**
   - Solución: Ve al Dashboard de Wompi y verifica que el webhook esté activo

### Problema: "El pago se completa pero no se registra en la base de datos"

**Causas posibles:**
1. **El webhook no está procesando correctamente el evento**
   - Solución: Revisa los logs del servidor para ver errores

2. **Faltan metadatos en la transacción**
   - Solución: Verifica que `libro_id` y `user_id` estén en los metadatos de la transacción

3. **Error de permisos en Supabase**
   - Solución: Verifica que `SUPABASE_SERVICE_ROLE_KEY` esté configurado correctamente

### Problema: "ngrok muestra 'Tunnel not found'"

**Causa:** La URL de ngrok cambió o expiró.

**Solución:**
1. Reinicia ngrok: `ngrok http 3000`
2. Copia la nueva URL
3. Actualiza el webhook en Wompi con la nueva URL

---

## 📝 Notas Importantes

1. **URLs de ngrok cambian:** En el plan gratuito de ngrok, la URL cambia cada vez que reinicias. Considera usar ngrok con una URL fija si desarrollas por varios días.

2. **Integrity Secret:** Este secret es único por webhook. Si creas un nuevo webhook, obtendrás un nuevo secret.

3. **Modo de prueba vs Producción:** Asegúrate de configurar webhooks separados para prueba y producción, cada uno con su propio Integrity Secret.

4. **Logs:** Siempre revisa los logs del servidor cuando pruebes pagos. Te ayudarán a identificar problemas rápidamente.

---

## ✅ Checklist Final

Antes de considerar que el webhook está configurado:

- [ ] ngrok está corriendo (desarrollo local) o la app está en producción
- [ ] El webhook está configurado en Wompi Dashboard
- [ ] La URL del webhook es correcta
- [ ] `WOMPI_INTEGRITY_SECRET` está en `.env.local` (o variables de entorno de producción)
- [ ] El servidor Next.js fue reiniciado después de agregar el secret
- [ ] Realizaste una transacción de prueba
- [ ] Los logs muestran "Compra registrada"
- [ ] La tabla `compras_libros` tiene el nuevo registro

---

## 🆘 ¿No Encuentras los Webhooks en el Dashboard?

**¡No busques "Webhook"!** En Wompi, el webhook se llama **"URL de Eventos"** (Events URL).

**Solución rápida:**
1. Ve a **"Desarrollo"** > **"Programadores"** en el menú lateral
2. Busca la sección **"Seguimiento de transacciones"** (Transaction Tracking)
3. Ahí verás el campo **"URL de Eventos"** ← Este es el webhook
4. Ingresa tu URL de ngrok en ese campo
5. Click en **"Guardar"** (Save)
6. Para el Integrity Secret, busca la sección **"Secretos para integración técnica"**
7. Click en **"Mostrar"** al lado del campo **"Integridad"** (Integrity)

**📖 Para instrucciones más detalladas, consulta:** `INSTRUCCIONES_WOMPI_APLICATIVOS.md`

## 🆘 ¿Necesitas Ayuda?

Si después de seguir esta guía sigues teniendo problemas:

1. Revisa los logs del servidor para ver errores específicos
2. Verifica en el Dashboard de Wompi que el webhook esté activo
3. Consulta la [documentación oficial de Wompi](https://docs.wompi.co)
4. Revisa que todas las variables de entorno estén correctamente configuradas
5. Usa el **Debugger** de Wompi (en "Desarrollo" > "Debugger") para ver las peticiones del webhook

