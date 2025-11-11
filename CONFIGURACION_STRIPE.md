# Configuración de Stripe para Pagos

Esta guía te ayudará a configurar Stripe para procesar pagos reales en la aplicación de libros.

## 1. Crear cuenta en Stripe

1. Ve a [https://stripe.com](https://stripe.com)
2. Crea una cuenta (gratis)
3. Completa la información de tu negocio

## 2. Obtener las claves de API

### Modo de Prueba (Testing)

1. En el Dashboard de Stripe, ve a **Developers** > **API keys**
2. Encuentra la sección **Test mode keys**
3. Copia:
   - **Publishable key** (empieza con `pk_test_...`)
   - **Secret key** (empieza con `sk_test_...`)

### Modo de Producción

1. Activa el modo de producción en Stripe
2. Obtén las claves de producción:
   - **Publishable key** (empieza con `pk_live_...`)
   - **Secret key** (empieza con `sk_live_...`)

## 3. Obtener Service Role Key de Supabase

El webhook necesita el Service Role Key de Supabase para poder insertar compras sin restricciones de RLS.

1. En tu Dashboard de Supabase, ve a **Settings** > **API**
2. Encuentra la sección **Project API keys**
3. Copia el **service_role key** (empieza con `eyJ...` y es MUY largo)
   - ⚠️ **NUNCA** expongas esta clave en el cliente
   - ⚠️ Solo úsala en el servidor (API routes)

## 4. Configurar variables de entorno

Agrega las siguientes variables a tu archivo `.env.local`:

```env
# Stripe - Claves de prueba (para desarrollo)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica_aqui
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_aqui
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret_aqui

# Supabase - Service Role Key (para webhook)
SUPABASE_SERVICE_ROLE_KEY=eyJ...tu_service_role_key_aqui

# Para producción, usa:
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
# STRIPE_SECRET_KEY=sk_live_...
# SUPABASE_SERVICE_ROLE_KEY=eyJ... (el mismo, no cambia entre test y producción)
```

**⚠️ IMPORTANTE:**
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` debe empezar con `NEXT_PUBLIC_` para que sea accesible en el cliente
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` y `SUPABASE_SERVICE_ROLE_KEY` son secretos y NO deben empezar con `NEXT_PUBLIC_`
- `SUPABASE_SERVICE_ROLE_KEY` tiene permisos completos en tu base de datos - NUNCA lo expongas
- Nunca subas el archivo `.env.local` a Git

## 5. Configurar Webhook de Stripe

El webhook permite que Stripe notifique a tu aplicación cuando un pago se completa.

### Para desarrollo local (usando Stripe CLI):

1. **Instala Stripe CLI:**
   - Windows: Descarga desde [https://stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)
   - Mac: `brew install stripe/stripe-cli/stripe`
   - Linux: Ver instrucciones en la documentación

2. **Inicia sesión en Stripe CLI:**
   ```bash
   stripe login
   ```

3. **Inicia el webhook forwarding:**
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. **Copia el webhook signing secret:**
   - Stripe CLI mostrará un secreto que empieza con `whsec_...`
   - Agrega este valor a `STRIPE_WEBHOOK_SECRET` en `.env.local`

### Para producción:

1. En el Dashboard de Stripe, ve a **Developers** > **Webhooks**
2. Click en **Add endpoint**
3. URL del endpoint: `https://tu-dominio.com/api/stripe/webhook`
4. Selecciona los eventos:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click en **Add endpoint**
6. Copia el **Signing secret** (empieza con `whsec_...`)
7. Agrega este valor a `STRIPE_WEBHOOK_SECRET` en tu plataforma de hosting (Vercel, etc.)

## 6. Probar el flujo de pago

### Tarjetas de prueba de Stripe:

Usa estas tarjetas para probar diferentes escenarios:

- **Pago exitoso:**
  - Número: `4242 4242 4242 4242`
  - Fecha: Cualquier fecha futura (ej: `12/25`)
  - CVC: Cualquier 3 dígitos (ej: `123`)
  - ZIP: Cualquier 5 dígitos (ej: `12345`)

- **Pago rechazado:**
  - Número: `4000 0000 0000 0002`

- **Requiere autenticación 3D Secure:**
  - Número: `4000 0027 6000 3184`

### Probar el flujo completo:

1. Inicia sesión con Google
2. Ve a `/libros` y selecciona un libro
3. Click en "Comprar ahora"
4. Serás redirigido a `/libros/[id]/checkout`
5. Ingresa los datos de la tarjeta de prueba
6. Click en "Pagar"
7. Si el pago es exitoso, serás redirigido a la página de lectura

## 7. Verificar que funciona

1. **En el Dashboard de Stripe:**
   - Ve a **Payments** para ver los pagos procesados
   - Verifica que el estado sea "Succeeded"

2. **En tu base de datos Supabase:**
   - Ve a la tabla `compras_libros`
   - Verifica que se haya creado un registro con:
     - `estado_pago = 'completado'`
     - `metodo_pago = 'stripe'`
     - `transaccion_id` con el ID del Payment Intent

## 8. Monitoreo y logs

- **Stripe Dashboard:** Ve a **Developers** > **Logs** para ver todos los eventos
- **Webhook logs:** En **Developers** > **Webhooks** > [Tu endpoint] > **Logs** para ver las respuestas del webhook

## 9. Troubleshooting

### Error: "No se pudo crear el Payment Intent"
- Verifica que `STRIPE_SECRET_KEY` esté correctamente configurada
- Verifica que la clave sea válida (no haya espacios extra)
- Revisa los logs del servidor para más detalles

### Error: "Webhook signature verification failed"
- Verifica que `STRIPE_WEBHOOK_SECRET` sea correcto
- Asegúrate de usar el secreto correcto (test vs production)
- Si usas Stripe CLI, reinicia el forwarding

### El pago se procesa pero no se registra en la base de datos
- Verifica que el webhook esté configurado correctamente
- Revisa los logs del webhook en Stripe Dashboard
- Verifica que la URL del webhook sea accesible públicamente (en producción)
- Revisa los logs del servidor para errores

### El usuario no puede acceder al libro después del pago
- Verifica que el webhook haya procesado correctamente el evento
- Revisa la tabla `compras_libros` para confirmar que el registro existe
- Verifica que `estado_pago = 'completado'` y `user_id` sea correcto

## 10. Producción

Antes de ir a producción:

1. ✅ Cambia a claves de producción en Stripe
2. ✅ Configura el webhook de producción con la URL correcta
3. ✅ Actualiza las variables de entorno en tu plataforma de hosting
4. ✅ Prueba con una tarjeta real de bajo valor
5. ✅ Configura alertas en Stripe para pagos fallidos
6. ✅ Revisa las políticas de reembolso y devoluciones

## Recursos adicionales

- [Documentación de Stripe](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)

