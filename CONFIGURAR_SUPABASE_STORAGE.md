# 🗄️ Configuración de Supabase Storage para PDFs

## 📋 Pasos para Configurar

### Paso 1: Crear el Bucket

1. Ve a tu **Dashboard de Supabase** → **Storage**
2. Haz clic en **"New bucket"**
3. Configura:
   - **Name**: `libros-pdfs`
   - **Public bucket**: ❌ **DESACTIVADO** (mantener privado)
   - Haz clic en **"Create bucket"**

### Paso 2: Configurar Políticas de Seguridad (RLS)

Necesitas permitir que los usuarios autenticados que compraron el libro puedan leer el PDF.

1. Ve a **Storage** → **Policies** → Selecciona el bucket `libros-pdfs`
2. Haz clic en **"New Policy"**
3. Selecciona **"For full customization"**
4. Pega esta política SQL:

```sql
-- Política: Permitir lectura de PDFs a usuarios que compraron el libro
CREATE POLICY "Usuarios pueden leer PDFs de libros comprados"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'libros-pdfs' AND
  auth.uid() IS NOT NULL AND
  auth.uid() IN (
    SELECT user_id 
    FROM compras_libros 
    WHERE estado_pago = 'completado'
    AND libro_id::text = (storage.foldername(name))[1]
  )
);
```

**Nota**: Esta política asume que organizas los PDFs en carpetas con el ID del libro. Si prefieres otra estructura, ajusta la política.

**Alternativa más simple** (si no usas carpetas por ID):
```sql
-- Política más permisiva: cualquier usuario autenticado que haya comprado cualquier libro
CREATE POLICY "Usuarios autenticados con compras pueden leer PDFs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'libros-pdfs' AND
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 
    FROM compras_libros 
    WHERE user_id = auth.uid() 
    AND estado_pago = 'completado'
  )
);
```

### Paso 3: Subir el PDF

1. Ve a **Storage** → **libros-pdfs**
2. Haz clic en **"Upload file"**
3. Sube tu archivo PDF
4. **Importante**: 
   - Si usas la política con carpetas por ID, crea una carpeta con el ID del libro (ej: `1/`) y sube el PDF ahí
   - Si usas la política simple, sube el PDF directamente en la raíz

### Paso 4: Actualizar la Base de Datos

Tienes dos opciones para el campo `archivo_pdf_url`:

#### Opción A: Ruta Relativa (Recomendado)
Usa solo la ruta del archivo relativa al bucket:
```
libros-pdfs/1/mi-libro.pdf
```
o si está en la raíz:
```
libros-pdfs/mi-libro.pdf
```

#### Opción B: URL Completa de Referencia
Puedes usar una URL completa que el código detectará y convertirá a signed URL:
```
https://[TU-PROYECTO].supabase.co/storage/v1/object/libros-pdfs/mi-libro.pdf
```

**Cómo actualizar:**
1. Ve a **Table Editor** → `libros`
2. Edita el libro
3. En `archivo_pdf_url`, pega la ruta (Opción A) o URL (Opción B)
4. Guarda

### Paso 5: Probar

1. Compra un libro (o simula la compra)
2. Haz clic en "Leer ahora"
3. El sistema generará automáticamente una URL firmada válida por 1 hora
4. Deberías ver el PDF en el visor

---

## 🔍 Estructura Recomendada de Carpetas

Para mejor organización, puedes estructurar así:

```
libros-pdfs/
  ├── 1/
  │   └── libro-completo.pdf
  ├── 2/
  │   └── otro-libro.pdf
  └── 3/
      └── tercer-libro.pdf
```

En este caso, en la base de datos usarías:
- `archivo_pdf_url`: `libros-pdfs/1/libro-completo.pdf`

---

## ⚙️ Configuración del Código

El código ya está configurado para:
- ✅ Detectar automáticamente si el PDF está en Supabase Storage
- ✅ Generar URLs firmadas válidas por 1 hora
- ✅ Funcionar con URLs externas también
- ✅ Manejar errores si falla la generación de URL firmada

---

## 🆘 Solución de Problemas

**Error: "Access denied" o "Forbidden"**
- Verifica que la política RLS esté correctamente configurada
- Asegúrate de que el usuario haya comprado el libro
- Verifica que `estado_pago` sea 'completado'

**Error: "File not found"**
- Verifica que la ruta en `archivo_pdf_url` sea correcta
- Asegúrate de que el archivo exista en el bucket
- Revisa que el nombre del bucket sea exactamente `libros-pdfs`

**La URL firmada no se genera**
- Verifica que el bucket no sea público (debe ser privado)
- Revisa la consola del servidor para ver errores
- Asegúrate de que la ruta del archivo sea correcta

**El PDF no carga en el visor**
- Abre la consola del navegador (F12) para ver errores
- Verifica que la URL firmada sea válida (prueba abriéndola directamente)
- Asegúrate de que el PDF no esté corrupto

---

## 📝 Notas Importantes

- **Seguridad**: Los PDFs están protegidos. Solo usuarios que compraron el libro pueden acceder.
- **Expiración**: Las URLs firmadas expiran después de 1 hora. El visor regenerará la URL si es necesario.
- **Tamaño**: Supabase Storage tiene límites según tu plan. PDFs muy grandes pueden requerir optimización.
- **Nombres**: Usa nombres descriptivos y únicos para los archivos.

