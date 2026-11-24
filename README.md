# FISIOPRO — demo de JASVORY

Sitio responsive en HTML, CSS y JavaScript vanilla. Sin frameworks, compilación ni dependencias.

## Abrir

Abre index.html directamente en Chrome o Edge. También puedes usar un servidor local:

```powershell
cd "C:\Users\chiqu\Documents\ChatGPT\Agencia\fisiopro-demo"
npm start
```

Visita http://127.0.0.1:5174/. Node solo sirve la vista previa; no es necesario para el sitio publicado. No se necesita npm install.

## Publicar

Sube esta carpeta como proyecto independiente. En Vercel usa Framework: Other, sin comando de compilación y carpeta de salida `.`. Se incluye vercel.json. No subas únicamente index.html: también se necesitan styles.css, app.js, config.js y assets/.

Las imágenes son archivos normales y están excluidas de Git LFS mediante .gitattributes. La fotografía de portada pesa aproximadamente 186 KB.

## Editar

- index.html: contenido y estructura.
- styles.css: paleta, tipografía, composición, responsive y animaciones. Variables de color al inicio.
- config.js: número de WhatsApp, etiqueta del teléfono e Instagram.
- app.js: selector de áreas, navegación, accesibilidad y preparación del mensaje.
- assets/movimiento.jpg: imagen conceptual generada para esta demo.
- assets/favicon.svg: símbolo conceptual del sitio.

La tipografía Manrope y DM Sans se carga desde Google Fonts. Sin conexión se usa Arial como respaldo.

## Qué funciona

- Botones hacia el WhatsApp proporcionado: +57 311 5397893.
- Enlace al Instagram oficial: https://www.instagram.com/fisiopro_oficial/.
- Selector de áreas con navegación mediante flechas, Home y End.
- Formulario de tres pasos: interés, preferencia y mensaje revisable.
- Validación de interés obligatorio, nombre opcional, volver y copiar mensaje.
- El enlace final abre WhatsApp con el texto prellenado. El visitante decide si lo envía.
- Menú móvil, preguntas desplegables, cierre de diálogos con Escape y retorno del foco.
- Entradas al hacer scroll y movimiento suave con alternativa para movimiento reducido.

No se guardan datos personales ni se envían formularios a un servidor. No se confirma una reserva ni se muestran horarios ficticios disponibles. No hace falta base de datos para este alcance.

## Información real y provisional

WhatsApp e Instagram: proporcionados por Juan Jose en la conversación.
Dirección publicada en la biografía de Instagram, consultada el 24 de noviembre de 2026: Carrera 7F #156-33. Se pide confirmar ciudad, indicaciones y horario antes de desplazarse.
Presentación pública: Fisioterapia · Deporte · Salud.

El perfil de Instagram pudo consultarse en navegador, aunque la consulta web inicial falló. No se descargaron fotografías de pacientes ni material del equipo.

La identidad gráfica es una propuesta, no una reproducción del logo oficial. La foto fue generada como ilustración y se identifica como tal. Los servicios específicos, nombres y credenciales de profesionales, tarifas y horarios deben validarse con el centro. No se inventaron testimonios o resultados clínicos.

La demo tiene meta robots noindex,nofollow. Retirarla únicamente al preparar la web final para indexación.

## Comprobaciones realizadas

- npm run check: sintaxis correcta de JavaScript.
- Revisión visual en escritorio 1440 × 1000 y móvil 390 × 844.
- Imagen local cargada y sin desbordamiento horizontal de la página en esas dimensiones.
- Formulario: selección obligatoria, nombre opcional, preferencia, mensaje, volver, copia.
- Comprobación del destinatario y texto codificado en el enlace de WhatsApp, sin enviar mensajes al negocio.
- Navegación desde servicios, selección mediante teclado, menú móvil, cierre con Escape.
- Consola sin errores en la revisión final.

La preferencia de movimiento reducido está implementada en CSS y JS; no se ejecutó una auditoría de accesibilidad completa.
