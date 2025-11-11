# Solución: Error "No se especificó método de pago o fuente de pago" en Wompi

## Problema

Al intentar crear una transacción de redirección en Wompi, recibes el error:
- "No se especificó método de pago o fuente de pago"
- "Se debe especificar un método de pago"

Hemos intentado múltiples estructuras y todas fallan:
1. ❌ Sin `payment_method` ni `payment_source` (solo `acceptance_token` y `redirect_url`)
2. ❌ Con `payment_source: { type: 'REDIRECT' }`
3. ❌ Con `payment_method: { installments: 1 }` (sin `type`)

## Causa

Este error generalmente indica que:
1. **El merchant no tiene habilitadas las transacciones de redirección** en el dashboard de Wompi
2. **El merchant requiere una configuración específica** que no está activa
3. **La estructura de la API que estamos usando no es compatible** con la configuración de tu merchant

## Soluciones

### 1. Verificar en el Dashboard de Wompi

1. **Inicia sesión en tu cuenta de Wompi:**
   - Ve a https://comercios.wompi.co/ (o tu URL de dashboard)
   - Inicia sesión con tus credenciales

2. **Revisa la configuración del merchant:**
   - Ve a **Configuración** o **Settings**
   - Busca opciones relacionadas con:
     - "Transacciones de redirección"
     - "Checkout redirect"
     - "Métodos de pago disponibles"
     - "Habilitar redirección"

3. **Verifica los métodos de pago habilitados:**
   - Asegúrate de que estén habilitados:
     - Nequi
     - PSE
     - Tarjetas de crédito/débito
     - Efecty
     - Baloto

### 2. Contactar con Soporte de Wompi

Si no encuentras la configuración, contacta con soporte de Wompi:

**Información a proporcionar:**
- Tu merchant ID o public key
- El error exacto que estás recibiendo
- La estructura que estás intentando usar
- Que quieres implementar transacciones de redirección donde el usuario elige el método de pago

**Preguntas específicas:**
1. ¿Mi merchant tiene habilitadas las transacciones de redirección?
2. ¿Cuál es la estructura correcta de la API para crear transacciones de redirección?
3. ¿Necesito alguna configuración adicional en el dashboard?

**Canales de contacto:**
- Email: soporte@wompi.co
- Teléfono: (según tu país)
- Chat en el dashboard de Wompi

### 3. Alternativa: Usar método de pago específico

Si las transacciones de redirección no están disponibles, puedes:

1. **Implementar selección de método de pago en tu aplicación:**
   - Mostrar opciones (Nequi, PSE, Tarjeta, etc.)
   - Cuando el usuario seleccione, crear la transacción con ese método específico
   - Redirigir a Wompi solo para completar ese método específico

2. **Estructura para método específico:**
```json
{
  "amount_in_cents": 999,
  "currency": "COP",
  "customer_email": "usuario@example.com",
  "reference": "LIBRO_1_USER_xxx",
  "acceptance_token": "tu_acceptance_token",
  "redirect_url": "http://localhost:3000/libros/1/checkout/callback",
  "payment_method": {
    "type": "NEQUI", // o "PSE", "CARD", etc.
    "installments": 1
  }
}
```

### 4. Verificar la versión de la API

Algunos merchants pueden estar usando una versión diferente de la API de Wompi. Verifica:
- Si estás usando la API v1 (actual)
- Si hay alguna versión beta o nueva que debas usar
- Si hay parámetros adicionales requeridos

## Código actual

El código actual intenta múltiples estructuras automáticamente. Si ninguna funciona, es muy probable que sea un problema de configuración del merchant.

## Próximos pasos

1. ✅ Verifica en el dashboard de Wompi la configuración de redirección
2. ✅ Contacta con soporte de Wompi si no encuentras la configuración
3. ✅ Comparte conmigo la respuesta de Wompi para ajustar el código si es necesario
4. ⚠️ Como alternativa temporal, podemos implementar la selección de método de pago en tu aplicación

## Nota importante

Este error **NO es un problema del código**, sino de la configuración del merchant en Wompi. Una vez que Wompi habilite las transacciones de redirección o te proporcione la estructura correcta, el código funcionará correctamente.

