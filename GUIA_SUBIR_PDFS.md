# 📚 Guía para Subir PDFs de Libros

Hay varias formas de almacenar y servir los PDFs de tus libros. Te explico las opciones:

## 🎯 Opción 1: Supabase Storage (Recomendado)

Esta es la opción más integrada y segura para PDFs privados.

### Paso 1: Crear el Bucket en Supabase

1. Ve a tu **Dashboard de Supabase** → **Storage**
2. Haz clic en **"New bucket"**
3. Configura el bucket:
   - **Name**: `libros-pdfs` (o el nombre que prefieras)
   - **Public bucket**: ❌ **DESACTIVADO** (para mantener los PDFs privados)
   - Haz clic en **"Create bucket"**

### Paso 2: Configurar Políticas de Acceso

Necesitas crear una política que permita a los usuarios autenticados que compraron el libro acceder al PDF.

1. Ve a **Storage** → **Policies** → Selecciona tu bucket `libros-pdfs`
2. Haz clic en **"New Policy"**
3. Selecciona **"For full customization"**
4. Agrega esta política SQL:

```sql
-- Política: Los usuarios pueden leer PDFs de libros que compraron
CREATE POLICY "Usuarios pueden leer PDFs comprados"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'libros-pdfs' AND
  auth.uid() IN (
    SELECT user_id 
    FROM compras_libros 
    WHERE estado_pago = 'completado'
    AND libro_id::text = (storage.foldername(name))[1]
  )
);
```

**Nota**: Esta política asume que el nombre del archivo incluye el ID del libro. Si prefieres otra estructura, ajusta la política.

### Paso 3: Subir el PDF

1. Ve a **Storage** → **libros-pdfs**
2. Haz clic en **"Upload file"**
3. Sube tu archivo PDF
4. **Importante**: Nombra el archivo incluyendo el ID del libro, por ejemplo: `1-mi-libro.pdf` o crea una carpeta con el ID del libro

### Paso 4: Obtener la URL del PDF

Después de subir el archivo, necesitas generar una **URL firmada** (signed URL) que expire después de un tiempo. Esto es más seguro que URLs públicas.

**Opción A: Usar la API de Supabase (Recomendado)**

En tu código, cuando necesites mostrar el PDF, genera una URL firmada:

```typescript
// En el servidor (page.tsx o API route)
const { data } = await supabase
  .storage
  .from('libros-pdfs')
  .createSignedUrl(`ruta/al/archivo.pdf`, 3600) // URL válida por 1 hora

const pdfUrl = data?.signedUrl;
```

**Opción B: URL Pública (Solo si el bucket es público)**

Si haces el bucket público (no recomendado para PDFs pagados), puedes usar:

```
https://[TU-PROYECTO].supabase.co/storage/v1/object/public/libros-pdfs/ruta/al/archivo.pdf
```

### Paso 5: Actualizar la Base de Datos

Una vez que tengas la URL del PDF, actualiza el registro del libro en Supabase:

```sql
UPDATE libros 
SET archivo_pdf_url = 'https://[TU-PROYECTO].supabase.co/storage/v1/object/public/libros-pdfs/mi-libro.pdf'
WHERE id = 1;
```

O desde el **Table Editor** de Supabase, edita el campo `archivo_pdf_url` del libro.

---

## 🌐 Opción 2: Cloudflare R2 (Si ya lo usas)

Si ya tienes Cloudflare R2 configurado:

1. Sube el PDF a tu bucket de R2
2. Obtén la URL pública o genera una URL firmada
3. Actualiza el campo `archivo_pdf_url` en la tabla `libros`

---

## 📁 Opción 3: Public Folder (Solo para desarrollo/testing)

⚠️ **NO recomendado para producción** porque los PDFs serían públicos y accesibles sin autenticación.

1. Coloca el PDF en `public/pdfs/`
2. Usa la URL: `/pdfs/mi-libro.pdf`
3. Actualiza `archivo_pdf_url` en la base de datos

---

## 🔐 Opción 4: URLs Firmadas Dinámicas (Más Seguro)

Para máxima seguridad, puedes generar URLs firmadas cada vez que el usuario accede al visor:

### Modificar el código del visor

1. En `src/app/libros/[id]/leer/page.tsx`, en lugar de pasar `archivo_pdf_url` directamente, genera una URL firmada:

```typescript
// Si el PDF está en Supabase Storage
if (libro.archivo_pdf_url?.includes('supabase.co/storage')) {
  // Extraer la ruta del archivo
  const filePath = libro.archivo_pdf_url.split('/libros-pdfs/')[1];
  
  // Generar URL firmada válida por 1 hora
  const { data: signedUrlData } = await supabase
    .storage
    .from('libros-pdfs')
    .createSignedUrl(filePath, 3600);
  
  libro.archivo_pdf_url = signedUrlData?.signedUrl || libro.archivo_pdf_url;
}
```

---

## 📝 Resumen de Pasos Recomendados

1. ✅ Crear bucket `libros-pdfs` en Supabase Storage (privado)
2. ✅ Configurar política RLS para acceso controlado
3. ✅ Subir PDFs al bucket
4. ✅ Actualizar `archivo_pdf_url` en la tabla `libros` con la ruta del archivo
5. ✅ (Opcional) Implementar URLs firmadas dinámicas para mayor seguridad

---

## 🧪 Probar que Funciona

1. Sube un PDF de prueba
2. Actualiza un libro con la URL del PDF
3. Compra el libro (o simula la compra)
4. Haz clic en "Leer ahora"
5. Deberías ver el PDF en el visor

---

## ⚠️ Notas Importantes

- **Seguridad**: Los PDFs deben estar protegidos. No uses URLs públicas si los libros son de pago.
- **Tamaño**: Supabase Storage tiene límites según tu plan. PDFs muy grandes pueden requerir optimización.
- **URLs Firmadas**: Expiran después del tiempo especificado (recomendado: 1 hora). El visor regenerará la URL si es necesario.
- **Nombres de archivo**: Usa nombres descriptivos y únicos. Considera incluir el ID del libro en el nombre.

---

## 🆘 Solución de Problemas

**Error: "Access denied"**
- Verifica que la política RLS esté correctamente configurada
- Asegúrate de que el usuario haya comprado el libro
- Verifica que el `estado_pago` sea 'completado'

**Error: "File not found"**
- Verifica que la ruta del archivo en `archivo_pdf_url` sea correcta
- Asegúrate de que el archivo exista en el bucket

**PDF no carga en el visor**
- Verifica que la URL sea accesible (prueba abriéndola directamente en el navegador)
- Revisa la consola del navegador para ver errores
- Asegúrate de que el PDF no esté corrupto

