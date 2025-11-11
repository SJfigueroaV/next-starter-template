# Configuración de Wompi para Pagos en Colombia

Wompi es la plataforma de pagos de Bancolombia que permite recibir pagos con:
- 💰 **Nequi**
- 🏦 **PSE** (Pagos Seguros en Línea)
- 💳 **Tarjetas de crédito/débito**
- 🏪 **Efecty**
- 🎫 **Baloto**

## 1. Crear cuenta en Wompi

1. Ve a [https://wompi.co](https://wompi.co)
2. Click en **"Regístrate"** o **"Empieza a vender"**
3. Completa el proceso de registro
4. Verifica tu cuenta (puede requerir documentos)

## 2. Obtener las credenciales de API

### Modo de Prueba (Sandbox)

1. En el Dashboard de Wompi, ve a **Configuración** > **API Keys**
2. Activa el **modo de prueba** (Sandbox)
3. Copia:
   - **Public Key** (empieza con `pub_test_...`)
   - **Private Key** (empieza con `prv_test_...`)

### Modo de Producción

1. Completa la verificación de tu cuenta
2. Activa el **modo de producción**
3. Obtén las claves de producción:
   - **Public Key** (empieza con `pub_prod_...`)
   - **Private Key** (empieza con `prv_prod_...`)

## 3. Configurar variables de entorno

Agrega las siguientes variables a tu archivo `.env.local`:

```env
# Wompi - Claves de prueba (para desarrollo)
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_test_tu_clave_publica_aqui
WOMPI_PRIVATE_KEY=prv_test_tu_clave_secreta_aqui
WOMPI_INTEGRITY_SECRET=tu_integrity_secret_aqui

# Para producción, usa:
# NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_prod_...
# WOMPI_PRIVATE_KEY=prv_prod_...
# WOMPI_INTEGRITY_SECRET=... (el mismo)
```

**⚠️ IMPORTANTE:**
- `NEXT_PUBLIC_WOMPI_PUBLIC_KEY` debe empezar con `NEXT_PUBLIC_` para que sea accesible en el cliente
- `WOMPI_PRIVATE_KEY` y `WOMPI_INTEGRITY_SECRET` son secretos y NO deben empezar con `NEXT_PUBLIC_`
- Nunca subas el archivo `.env.local` a Git

## 4. Obtener Integrity Secret

El Integrity Secret se usa para verificar que las notificaciones vengan realmente de Wompi.

1. En el Dashboard de Wompi, ve a **Configuración** > **Webhooks**
2. Genera o copia el **Integrity Secret**
3. Agrégala a `WOMPI_INTEGRITY_SECRET` en `.env.local`

## 5. Configurar Webhook de Wompi

### Para desarrollo local (usando ngrok o similar):

1. **Instala ngrok** (si no lo tienes):
   ```bash
   # Windows: Descarga desde https://ngrok.com/download
   # Mac: brew install ngrok
   # Linux: Ver instrucciones en ngrok.com
   ```

2. **Inicia tu servidor local:**
   ```bash
   npm run dev
   ```

3. **Expone tu servidor con ngrok:**
   ```bash
   ngrok http 3000
   ```

4. **Copia la URL de ngrok** (ej: `https://abc123.ngrok.io`)

5. **En Wompi Dashboard:**
   - Ve a **Configuración** > **Webhooks**
   - Agrega un nuevo webhook:
     - URL: `https://tu-url-ngrok.ngrok.io/api/wompi/webhook`
     - Eventos: Selecciona `transaction.updated`
   - Guarda y copia el **Integrity Secret**

### Para producción:

1. En el Dashboard de Wompi, ve a **Configuración** > **Webhooks**
2. Click en **Agregar webhook**
3. URL del endpoint: `https://tu-dominio.com/api/wompi/webhook`
4. Selecciona el evento: `transaction.updated`
5. Click en **Guardar**
6. Copia el **Integrity Secret** y agrégala a las variables de entorno en tu plataforma de hosting

## 6. Probar el flujo de pago

### Tarjetas de prueba de Wompi:

- **Tarjeta de crédito exitosa:**
  - Número: `4242 4242 4242 4242`
  - Fecha: Cualquier fecha futura
  - CVC: Cualquier 3 dígitos

- **Tarjeta rechazada:**
  - Número: `4000 0000 0000 0002`

### Probar con Nequi:

En modo de prueba, Wompi proporciona números de prueba para Nequi. Consulta la documentación de Wompi para los números de prueba actualizados.

### Probar el flujo completo:

1. Inicia sesión con Google
2. Ve a `/libros` y selecciona un libro
3. Click en "Comprar ahora"
4. Serás redirigido a la página de checkout de Wompi
5. Selecciona el método de pago (Nequi, PSE, Tarjeta, etc.)
6. Completa el pago
7. Serás redirigido de vuelta a tu aplicación
8. Si el pago es exitoso, podrás leer el libro

## 7. Verificar que funciona

1. **En el Dashboard de Wompi:**
   - Ve a **Transacciones** para ver los pagos procesados
   - Verifica que el estado sea "APPROVED"

2. **En tu base de datos Supabase:**
   - Ve a la tabla `compras_libros`
   - Verifica que se haya creado un registro con:
     - `estado_pago = 'completado'`
     - `metodo_pago = 'wompi'` o `'nequi'` o `'pse'` según el método usado
     - `transaccion_id` con el ID de la transacción de Wompi

## 8. Monitoreo y logs

- **Wompi Dashboard:** Ve a **Transacciones** para ver todos los pagos
- **Webhook logs:** En **Configuración** > **Webhooks** > [Tu endpoint] > **Logs** para ver las respuestas del webhook

## 9. Troubleshooting

### Error: "No se pudo crear la transacción"
- Verifica que `WOMPI_PRIVATE_KEY` esté correctamente configurada
- Verifica que la clave sea válida (no haya espacios extra)
- Revisa los logs del servidor para más detalles

### Error: "Webhook signature verification failed"
- Verifica que `WOMPI_INTEGRITY_SECRET` sea correcto
- Asegúrate de usar el secreto correcto (test vs production)
- Verifica que el webhook esté configurado correctamente en Wompi

### El pago se procesa pero no se registra en la base de datos
- Verifica que el webhook esté configurado correctamente
- Revisa los logs del webhook en Wompi Dashboard
- Verifica que la URL del webhook sea accesible públicamente (en producción)
- Revisa los logs del servidor para errores

### El usuario no puede acceder al libro después del pago
- Verifica que el webhook haya procesado correctamente el evento
- Revisa la tabla `compras_libros` para confirmar que el registro existe
- Verifica que `estado_pago = 'completado'` y `user_id` sea correcto

## 10. Producción

Antes de ir a producción:

1. ✅ Cambia a claves de producción en Wompi
2. ✅ Configura el webhook de producción con la URL correcta
3. ✅ Actualiza las variables de entorno en tu plataforma de hosting
4. ✅ Prueba con una transacción real de bajo valor
5. ✅ Configura alertas en Wompi para transacciones fallidas
6. ✅ Revisa las políticas de reembolso y devoluciones

## Recursos adicionales

- [Documentación de Wompi](https://docs.wompi.co)
- [API Reference de Wompi](https://docs.wompi.co/es/docs/colombia)
- [Soporte de Wompi](https://wompi.co/contacto)

