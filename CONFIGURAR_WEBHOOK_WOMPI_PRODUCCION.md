# 🔗 Configurar Webhook de Wompi en Producción

Esta guía te ayudará a configurar el webhook de Wompi para que tu aplicación reciba notificaciones de transacciones completadas.

## 📋 Requisitos Previos

Antes de configurar el webhook, asegúrate de:
- ✅ Tu aplicación esté desplegada en producción
- ✅ Tengas acceso al Dashboard de Wompi
- ✅ Tengas el **Integrity Secret** de Wompi (se genera al crear el webhook)

## 🚀 Pasos para Configurar el Webhook

### Paso 1: Acceder al Dashboard de Wompi

1. Inicia sesión en tu cuenta de Wompi: https://comercios.wompi.co/
2. Ve a tu **Dashboard** o **Panel de Control**

### Paso 2: Navegar a la Configuración de Webhooks

1. En el menú lateral izquierdo, busca **"Desarrollo"** (Development) - tiene un icono `</>`
2. Haz clic en **"Desarrollo"** para expandirlo
3. Haz clic en **"Programadores"** (Programmers)
   - Esta es la sección que necesitas, no busques "Webhooks" directamente

### Paso 3: Configurar la URL de Eventos (Webhook)

En la página de "Programadores", busca la sección **"Seguimiento de transacciones"** (Transaction Tracking).

1. Verás un campo llamado **"URL de Eventos"** (Events URL)
   - ⚠️ **IMPORTANTE**: En Wompi, el webhook se llama **"URL de Eventos"**, no "Webhook"
   
2. En el campo **"URL de Eventos"**, ingresa:
   ```
   https://tu-dominio.com/api/wompi/webhook
   ```
   ⚠️ **IMPORTANTE**: 
   - Reemplaza `tu-dominio.com` con tu dominio real (ej: `pedagogiacultivo.com`)
   - Debe usar **HTTPS** (no HTTP)
   - No incluyas la barra final (`/`)
   - La URL debe ser accesible públicamente

   **Ejemplo:**
   ```
   https://pedagogiacultivo.com/api/wompi/webhook
   ```

3. Haz clic en el botón verde **"Guardar"** (Save) que está debajo del campo

### Paso 4: Obtener el Integrity Secret

Después de guardar la URL de Eventos, necesitas obtener el **Integrity Secret**:

1. En la misma página, busca la sección **"Secretos para integración técnica"** (Secrets for technical integration)
2. Verás dos campos:
   - **"Eventos"** (Events) - Este es para verificar eventos del webhook
   - **"Integridad"** (Integrity) ← **¡Este es el que necesitas!**
3. Haz clic en el botón gris **"Mostrar"** (Show) que está al lado del campo **"Integridad"**
4. **Copia el secreto inmediatamente** - es un string largo que se usa para verificar que las notificaciones vengan realmente de Wompi
5. ⚠️ **IMPORTANTE**: 
   - El Integrity Secret está en el campo **"Integridad"**, no "Integrity Secret"
   - Si no puedes verlo, asegúrate de hacer clic en "Mostrar"
   - Guárdalo de forma segura, lo necesitarás para las variables de entorno

### Paso 5: Agregar el Integrity Secret a las Variables de Entorno

1. Ve a tu plataforma de hosting (Vercel, Netlify, etc.)
2. Ve a **Settings** → **Environment Variables**
3. Agrega o actualiza la variable:
   ```
   WOMPI_INTEGRITY_SECRET=el-secreto-que-copiaste
   ```
4. Asegúrate de seleccionar el entorno **Production**
5. Haz clic en **Save**

⚠️ **CRÍTICO**: El `WOMPI_INTEGRITY_SECRET` debe coincidir **exactamente** con el que te dio Wompi. Si no coincide, el webhook será rechazado.

## 🔍 Verificar que el Webhook Está Configurado Correctamente

### Opción 1: Probar con una Transacción Real

1. Inicia sesión en tu aplicación
2. Ve a `/libros` y selecciona un libro
3. Haz clic en "Comprar ahora"
4. Completa un pago de prueba en Wompi
5. Revisa los logs de tu servidor para ver si el webhook fue recibido:
   - Deberías ver: `📥 Webhook recibido de Wompi`
   - Y luego: `✅ Firma verificada correctamente`
   - Y finalmente: `✅ Compra registrada exitosamente`

### Opción 2: Verificar en el Dashboard de Wompi

1. Ve a **Transacciones** en el Dashboard de Wompi
2. Busca una transacción reciente
3. Verifica que el estado sea **"APPROVED"** o **"Aprobada"**
4. En tu aplicación, verifica que el libro aparezca como comprado

### Opción 3: Revisar los Logs del Servidor

En los logs de tu plataforma de hosting, deberías ver:
```
📥 Webhook recibido de Wompi
🔐 Firma presente: true
✅ Firma verificada correctamente
📊 Estado de la transacción: APPROVED
✅ Compra registrada exitosamente
```

## ⚠️ Solución de Problemas

### El webhook no se está recibiendo

**Posibles causas:**
1. **URL incorrecta**: Verifica que la URL sea exactamente `https://tu-dominio.com/api/wompi/webhook`
2. **HTTPS requerido**: Asegúrate de usar HTTPS (no HTTP)
3. **Firewall o CORS**: Verifica que tu servidor permita peticiones POST desde Wompi
4. **Ruta incorrecta**: Verifica que la ruta `/api/wompi/webhook` exista en tu aplicación

**Solución:**
- Verifica la URL en el Dashboard de Wompi
- Revisa los logs de tu servidor para ver si hay errores
- Prueba hacer una petición POST manual a la URL del webhook

### Error: "Firma inválida"

**Causa:** El `WOMPI_INTEGRITY_SECRET` no coincide con el configurado en Wompi.

**Solución:**
1. Ve al Dashboard de Wompi → Webhooks
2. Verifica el Integrity Secret
3. Asegúrate de que la variable `WOMPI_INTEGRITY_SECRET` en tu hosting coincida exactamente
4. No debe haber espacios extra al principio o final
5. Reinicia tu aplicación después de actualizar la variable

### El webhook se recibe pero la compra no se registra

**Posibles causas:**
1. Error en la base de datos
2. Problemas con RLS (Row Level Security)
3. El `user_id` o `libro_id` no se extraen correctamente de la referencia

**Solución:**
- Revisa los logs del servidor para ver errores específicos
- Verifica que las políticas RLS estén configuradas correctamente
- El sistema tiene un fallback que verifica manualmente si el webhook falla

## 📝 Notas Importantes

1. **Modo de Prueba vs Producción**:
   - Si estás en modo de prueba, el webhook debe apuntar a tu URL de desarrollo (puedes usar ngrok)
   - Si estás en producción, el webhook debe apuntar a tu dominio de producción

2. **Múltiples Webhooks**:
   - Puedes tener diferentes webhooks para desarrollo y producción
   - Solo asegúrate de usar el Integrity Secret correcto para cada uno

3. **Fallback Automático**:
   - Si el webhook no funciona, tu aplicación tiene un sistema de verificación manual
   - Cuando un usuario completa un pago, el callback verifica automáticamente con la referencia
   - Esto asegura que los pagos se registren incluso si el webhook falla

4. **Seguridad**:
   - El Integrity Secret es crítico para la seguridad
   - Nunca lo compartas públicamente
   - Si crees que fue comprometido, elimina el webhook y crea uno nuevo

## ✅ Checklist Final

Antes de considerar que el webhook está configurado:

- [ ] Webhook creado en el Dashboard de Wompi
- [ ] URL del webhook: `https://tu-dominio.com/api/wompi/webhook`
- [ ] Evento seleccionado: `transaction.updated`
- [ ] Integrity Secret copiado
- [ ] Variable `WOMPI_INTEGRITY_SECRET` configurada en el hosting
- [ ] Webhook probado con una transacción real
- [ ] Logs del servidor muestran que el webhook se recibe correctamente
- [ ] Las compras se registran automáticamente en la base de datos

## 🎉 ¡Listo!

Una vez que hayas completado estos pasos, tu webhook de Wompi estará configurado y funcionando. Los pagos se registrarán automáticamente cuando los usuarios completen una transacción.

