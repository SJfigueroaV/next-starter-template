# 📋 Variables de Entorno Necesarias para Wompi

## ✅ Variables Requeridas para Wompi

Para que la integración con Wompi funcione correctamente, necesitas estas **3 variables** en tu archivo `.env.local`:

```env
# Wompi - Claves de API
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_test_tu_clave_publica_aqui
WOMPI_PRIVATE_KEY=prv_test_tu_clave_privada_aqui
WOMPI_INTEGRITY_SECRET=tu_integrity_secret_aqui
```

### 📝 Descripción de cada variable:

1. **`NEXT_PUBLIC_WOMPI_PUBLIC_KEY`**
   - **Dónde obtenerla:** Dashboard de Wompi > Desarrollo > Programadores > "Llaves del API" > "Llave pública"
   - **Formato:** Empieza con `pub_test_` (modo prueba) o `pub_prod_` (producción)
   - **⚠️ IMPORTANTE:** Debe empezar con `NEXT_PUBLIC_` para que sea accesible en el cliente
   - **Uso:** Se usa en el componente de checkout del cliente

2. **`WOMPI_PRIVATE_KEY`**
   - **Dónde obtenerla:** Dashboard de Wompi > Desarrollo > Programadores > "Llaves del API" > "Llave privada" (click en "Mostrar")
   - **Formato:** Empieza con `prv_test_` (modo prueba) o `prv_prod_` (producción)
   - **⚠️ IMPORTANTE:** NO debe empezar con `NEXT_PUBLIC_` (es secreta, solo servidor)
   - **Uso:** Se usa en el servidor para crear transacciones

3. **`WOMPI_INTEGRITY_SECRET`**
   - **Dónde obtenerla:** Dashboard de Wompi > Desarrollo > Programadores > "Secretos para integración técnica" > "Integridad" (click en "Mostrar")
   - **Formato:** String largo (alrededor de 64 caracteres)
   - **⚠️ IMPORTANTE:** NO debe empezar con `NEXT_PUBLIC_` (es secreta, solo servidor)
   - **Uso:** Se usa en el servidor para verificar que los webhooks vengan realmente de Wompi

## ✅ Variables Requeridas para Supabase

También necesitas estas variables para que la autenticación y base de datos funcionen:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
```

### 📝 Descripción:

1. **`NEXT_PUBLIC_SUPABASE_URL`**
   - URL de tu proyecto Supabase
   - Se obtiene en: Supabase Dashboard > Settings > API

2. **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**
   - Clave anónima de Supabase (pública, pero con RLS)
   - Se obtiene en: Supabase Dashboard > Settings > API

3. **`SUPABASE_SERVICE_ROLE_KEY`**
   - Clave de servicio (bypass RLS, solo servidor)
   - Se obtiene en: Supabase Dashboard > Settings > API
   - **⚠️ IMPORTANTE:** NO debe empezar con `NEXT_PUBLIC_` (es secreta)

## 📋 Checklist Completo

Verifica que tengas todas estas variables en tu `.env.local`:

### Para Wompi:
- [ ] `NEXT_PUBLIC_WOMPI_PUBLIC_KEY` (empieza con `pub_test_` o `pub_prod_`)
- [ ] `WOMPI_PRIVATE_KEY` (empieza con `prv_test_` o `prv_prod_`)
- [ ] `WOMPI_INTEGRITY_SECRET` (string largo)

### Para Supabase:
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`

## 🔍 Cómo Verificar que Están Configuradas

1. **Reinicia tu servidor de desarrollo:**
   ```bash
   # Detén el servidor (Ctrl+C)
   npm run dev
   ```

2. **Revisa la consola:**
   - Si ves mensajes como `⚠️ WOMPI_PRIVATE_KEY no está configurada`, falta esa variable
   - Si no ves advertencias, todas las variables están configuradas

3. **Prueba crear una transacción:**
   - Ve a un libro y click en "Comprar ahora"
   - Si funciona, las variables están correctas

## ⚠️ Errores Comunes

### Error: "Wompi no está configurado"
- **Causa:** Faltan `WOMPI_PRIVATE_KEY` o `NEXT_PUBLIC_WOMPI_PUBLIC_KEY`
- **Solución:** Agrega ambas variables a `.env.local` y reinicia el servidor

### Error: "WOMPI_INTEGRITY_SECRET no está configurada"
- **Causa:** Falta el Integrity Secret
- **Solución:** Obtén el secret del Dashboard de Wompi y agrégalo a `.env.local`

### Error: "No se puede leer propiedad de undefined"
- **Causa:** La variable pública no tiene `NEXT_PUBLIC_` al inicio
- **Solución:** Asegúrate de que `NEXT_PUBLIC_WOMPI_PUBLIC_KEY` empiece con `NEXT_PUBLIC_`

## 📝 Ejemplo Completo de `.env.local`

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Wompi - Modo Prueba (Sandbox)
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WOMPI_PRIVATE_KEY=prv_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WOMPI_INTEGRITY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 🚀 Para Producción

Cuando estés listo para producción:

1. Cambia a claves de producción en Wompi Dashboard
2. Actualiza las variables:
   ```env
   NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_prod_...
   WOMPI_PRIVATE_KEY=prv_prod_...
   WOMPI_INTEGRITY_SECRET=... (el mismo)
   ```
3. Configura estas variables en tu plataforma de hosting (Vercel, Netlify, etc.)

