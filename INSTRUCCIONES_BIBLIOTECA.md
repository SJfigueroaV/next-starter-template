# 📚 Guía de Implementación - Biblioteca de Libros

## ✅ Lo que ya está implementado

1. **Estructura de páginas:**
   - `/libros` - Página principal con catálogo de libros ✅
   - Layout independiente que no afecta la página principal ✅

2. **Funcionalidades:**
   - Sidebar con categorías (inspirado en Kindle) ✅
   - Búsqueda de libros ✅
   - Filtros por categoría ✅
   - Ordenamiento (Reciente, Título A-Z, Precio) ✅
   - Grid de libros con portadas ✅
   - Verificación de compras ✅

## 🚀 Pasos para completar la implementación

### 1. Crear las tablas en Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Abre el **SQL Editor**
3. Crea una nueva query
4. Copia y pega el contenido del archivo `supabase_libros_schema.sql`
5. Ejecuta la query

Esto creará:
- Tabla `libros` con todos los campos necesarios
- Tabla `compras_libros` para rastrear las compras
- Índices para mejorar el rendimiento
- Políticas de seguridad (RLS)
- Triggers para actualizar fechas automáticamente

### 2. Agregar libros a la base de datos

Puedes agregar libros de dos formas:

**Opción A: Desde el Dashboard de Supabase**
1. Ve a **Table Editor** > `libros`
2. Haz clic en **Insert** > **Insert row**
3. Completa los campos:
   - `titulo` (requerido) - Ejemplo: "El Camino de la Fe"
   - `autor` (requerido) - Ejemplo: "Juan Pérez"
   - `descripcion` (opcional) - Ejemplo: "Una guía inspiradora..."
   - `precio` (requerido) - Ejemplo: 9.99
   - `portada_url` (opcional) - URL de la imagen de portada
   - `archivo_pdf_url` (opcional) - URL del PDF del libro
   - `categoria` (opcional) - Ejemplo: "Espiritualidad", "Historia"
   - `fecha_publicacion` (opcional, se genera automáticamente)

**Opción B: Usando SQL**
```sql
INSERT INTO libros (titulo, autor, descripcion, precio, categoria, portada_url, archivo_pdf_url)
VALUES (
  'Título del Libro',
  'Nombre del Autor',
  'Descripción del libro...',
  12.99,
  'Espiritualidad',
  'https://ejemplo.com/portada.jpg',
  'https://ejemplo.com/libro.pdf'
);
```

### 3. Almacenar archivos (portadas y PDFs)

Tienes varias opciones:

**Opción A: Supabase Storage (Recomendado)**
1. Ve a **Storage** en el dashboard de Supabase
2. Crea un bucket llamado `libros` (o el nombre que prefieras)
3. Configura las políticas de acceso:
   - Para portadas: Haz el bucket público para lectura
   - Para PDFs: Mantén el bucket privado y usa signed URLs
4. Sube las portadas y PDFs
5. Obtén las URLs públicas y úsalas en la base de datos

**Ejemplo de política para portadas públicas:**
```sql
-- En Supabase Dashboard > Storage > Policies
CREATE POLICY "Portadas públicas"
ON storage.objects FOR SELECT
USING (bucket_id = 'libros' AND (storage.foldername(name))[1] = 'portadas');
```

**Opción B: Cloudflare R2 o S3**
- Si ya tienes almacenamiento configurado, usa esas URLs

**Opción C: URLs externas**
- Si los archivos están en otro servidor, usa esas URLs directamente

### 4. Integrar sistema de pago (Pendiente)

Actualmente, el botón de compra crea una compra directa sin procesamiento de pago real. Para producción, necesitas integrar:

**Opción A: Stripe (Recomendado)**
1. Crea una cuenta en [Stripe](https://stripe.com)
2. Instala el paquete: `npm install @stripe/stripe-js`
3. Crea una API route en Next.js para manejar el checkout
4. Configura webhooks para actualizar el estado de pago
5. Actualiza el componente de detalle del libro para usar Stripe

**Ejemplo básico de integración con Stripe:**
```typescript
// app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const { libroId, precio } = await request.json();
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Libro',
        },
        unit_amount: Math.round(precio * 100),
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/libros/${libroId}?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/libros/${libroId}`,
  });

  return NextResponse.json({ sessionId: session.id });
}
```

**Opción B: PayPal**
- Similar a Stripe pero con PayPal SDK

**Opción C: Otro proveedor**
- Adapta el código según el proveedor que elijas

### 5. Crear páginas adicionales (Opcional)

Si quieres agregar más funcionalidad:

**Página de detalle del libro (`/libros/[id]`):**
- Información completa del libro
- Botón de compra
- Vista previa (si está disponible)

**Visor de PDF (`/libros/[id]/leer`):**
- Solo accesible para usuarios que compraron el libro
- Visor de PDF integrado

## 📝 Notas importantes

1. **Seguridad**: Las políticas RLS están configuradas para que:
   - Todos puedan ver los libros
   - Solo los usuarios autenticados puedan ver sus propias compras
   - Solo los usuarios autenticados puedan crear compras

2. **Visor de PDF**: Si implementas el visor, asegúrate de:
   - Verificar que el usuario haya comprado el libro
   - Usar URLs firmadas para PDFs privados
   - Considerar usar un visor de PDF más avanzado como PDF.js

3. **Pruebas**: Antes de ir a producción:
   - Prueba la compra de libros
   - Verifica que el visor funciona correctamente
   - Prueba en diferentes dispositivos
   - Verifica que las políticas RLS funcionan correctamente

## 🔧 Solución de problemas

**Error: "libros table does not exist"**
- Asegúrate de haber ejecutado el script SQL en Supabase

**Error: "Permission denied"**
- Verifica que las políticas RLS estén correctamente configuradas
- Asegúrate de que el usuario esté autenticado

**Los libros no se muestran**
- Verifica que hay libros en la tabla
- Revisa la consola del navegador para errores
- Verifica que las variables de entorno de Supabase estén configuradas

**El visor de PDF no carga**
- Verifica que la URL del PDF sea pública y accesible
- Asegúrate de que el usuario haya comprado el libro
- Revisa la consola del navegador para errores CORS

## 📚 Recursos adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [PDF.js para visor avanzado](https://mozilla.github.io/pdf.js/)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

