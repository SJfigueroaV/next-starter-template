# 📱 Cómo Encontrar y Configurar Webhooks en Wompi

**⚠️ IMPORTANTE:** En Wompi, el webhook NO se llama "Webhook". Se llama **"URL de Eventos"** (Events URL).

## 🎯 Ubicación de los Webhooks en Wompi

Los webhooks en Wompi están en la página de **"Programadores"** (Developers), en la sección **"Seguimiento de transacciones"** (Transaction Tracking). No necesitas crear aplicativos, está directamente ahí.

## 📋 Pasos Detallados

### Paso 1: Acceder a la sección de Desarrollo

1. Inicia sesión en [https://wompi.co](https://wompi.co)
2. En el menú lateral izquierdo, busca la sección **"Desarrollo"** (Development)
3. Click en **"Programadores"** o **"Developers"**

### Paso 2: Configurar el Webhook (URL de Eventos)

En la página de "Programadores", busca la sección:

**"Seguimiento de transacciones"** (Transaction Tracking)

Dentro de esta sección verás:

1. **Campo "URL de Eventos"** (Events URL) ← **¡Este es el webhook!**
   
   **⚠️ IMPORTANTE:** En Wompi se llama "URL de Eventos", NO "Webhook"

2. **Ingresa la URL de tu webhook en ese campo:**
   ```
   https://tu-url-ngrok.ngrok.io/api/wompi/webhook
   ```
   
   Reemplaza `tu-url-ngrok.ngrok.io` con la URL que obtuviste de ngrok.

3. **Guarda los cambios:**
   - Click en el botón verde **"Guardar"** (Save) que está debajo del campo

### Paso 3: Obtener el Integrity Secret

En la misma página de "Programadores", busca la sección:

**"Secretos para integración técnica"** (Secrets for Technical Integration)

Dentro de esta sección verás dos campos:

1. **"Eventos"** (Events) - Para verificar eventos del webhook
2. **"Integridad"** (Integrity) ← **¡Este es el Integrity Secret que necesitas!**

**Para ver el secret:**

1. Click en el botón **"Mostrar"** (Show) que está al lado del campo **"Integridad"**
2. **CÓPIALO INMEDIATAMENTE** - es posible que no puedas verlo de nuevo
3. Es un string largo que se usa para verificar que las notificaciones vengan realmente de Wompi

**⚠️ IMPORTANTE:** 
- El Integrity Secret está en el campo **"Integridad"**, no "Integrity Secret"
- Si no puedes verlo, asegúrate de hacer click en "Mostrar"

### Paso 4: Usar el Debugger (Opcional)

Si no encuentras el Integrity Secret o quieres verificar que los webhooks funcionen:

1. Ve a **"Desarrollo"** > **"Debugger"**
2. El Debugger te permite:
   - Ver las peticiones que Wompi envía a tu webhook
   - Ver el estado y la respuesta de tu webhook
   - Identificar problemas en la configuración

## 🔍 Ubicaciones Alternativas

Si no encuentras los Aplicativos en "Desarrollo" > "Programadores", intenta:

1. **Buscar en el menú principal:**
   - Busca **"Aplicativos"**, **"Applications"**, **"Apps"** o **"Integraciones"**

2. **En la sección de "Cuenta comercio":**
   - Click en **"Cuenta comercio"** (Merchant account)
   - Busca opciones de configuración o integraciones

3. **Usar la búsqueda del dashboard:**
   - Busca "webhook" o "aplicativo" en la barra de búsqueda (si existe)

## ⚠️ Nota Importante

Si tu cuenta está en **modo Sandbox** (pruebas), como se muestra en el banner rojo que dice "Cuenta en estado de revisión", es posible que:

- Algunas opciones estén limitadas
- Necesites completar la verificación de tu cuenta para acceder a todas las funciones
- Los webhooks funcionen igual, pero solo con transacciones de prueba

## 🆘 Si Aún No Encuentras los Webhooks

1. **Contacta al soporte de Wompi:**
   - Ve a [https://soporte.wompi.co](https://soporte.wompi.co)
   - Explica que necesitas configurar un webhook pero no encuentras la opción

2. **Revisa la documentación oficial:**
   - [https://docs.wompi.co](https://docs.wompi.co)
   - Busca "webhook" o "aplicativos"

3. **Verifica que tu cuenta esté activa:**
   - Asegúrate de haber completado todos los pasos de registro
   - Verifica que tu cuenta no esté en estado de revisión pendiente

## ✅ Checklist

Antes de continuar, asegúrate de tener:

- [ ] Acceso a la sección "Desarrollo" > "Programadores"
- [ ] La URL del webhook configurada en el campo "URL de Eventos"
- [ ] El Integrity Secret copiado del campo "Integridad" (click en "Mostrar")
- [ ] Los cambios guardados (click en "Guardar")

## 📝 Siguiente Paso

Una vez que hayas configurado el webhook y obtenido el Integrity Secret:

1. Agrega el secret a tu archivo `.env.local`:
   ```env
   WOMPI_INTEGRITY_SECRET=el_secret_que_copiaste
   ```

2. Reinicia tu servidor Next.js

3. Prueba realizando una transacción de prueba


