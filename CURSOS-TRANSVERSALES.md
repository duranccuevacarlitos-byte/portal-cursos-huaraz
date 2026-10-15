# Aporte de cursos transversales

## Archivos

- `cursos.html`: se integran imágenes, contenidos desplegables y enlaces a consulta sobre el catálogo actualizado.
- `cursos-transversales.css`: estilos exclusivos de `.courses-page`; tarjetas de tres columnas en escritorio, dos hasta 900 px y una hasta 520 px.
- `cursos-transversales.js`: controlador único para búsqueda, categoría, precio, prerrequisitos, accesos rápidos y reinicio.
- `assets/cursos/`: las seis portadas recuperadas, con nombres descriptivos y su propia guía.
- `script.js`: corrección mínima compartida, para revisar por separado al integrar con el equipo.

## Aportes conservados

Se conservaron las seis descripciones originales, los niveles y los valores `data-price` y `data-prereq` del repositorio actualizado. Los precios almacenados son 120, 200, 80, 60, 40 y 150 soles, respectivamente; solo IA tiene `data-prereq="yes"`. Estos datos preexistían y no se validaron como información oficial.

Se conservaron exactamente los tres horarios presentes: Web, IA y Redes. No se inventaron horarios para los otros cursos. El diseño del buscador, los accesos rápidos y los controles de precio y prerrequisitos también se mantienen.

No se modificaron `index.html`, `contacto.html`, `categorias.html`, `nosotros.html` ni `style.css`; se comprobó su integridad mediante SHA-256.

## Contenidos y búsqueda

Los objetivos, temas e ideas de proyecto añadidos son una propuesta didáctica, no un sílabo oficial confirmado. Cada curso dispone de un apartado nativo `details` para mantener compacta su tarjeta.

Las relaciones de búsqueda están en `relatedTerms` y se ejecutan localmente. Ejemplos: computación encuentra Web, Ofimática y Redes; Excel encuentra Ofimática; ChatGPT encuentra IA; Photoshop encuentra Diseño. La búsqueda ignora tildes, mayúsculas y palabras de enlace. Se combina con todos los filtros. Los accesos rápidos inician una nueva consulta restableciendo los filtros.

Las imágenes se muestran a 160 px de alto en escritorio y 148 px en móvil. El contenido permanece visible sin JavaScript; los controles que dependen de él quedan ocultos.

## Corrección compartida

`script.js` ahora inicializa las páginas internas sin intentar acceder al canvas de la portada. La opción de movimiento reducido se procesa después de inicializar las variables y el temporizador inicial puede cancelarse. Solo los enlaces de ancla participan en la navegación por secciones.

La función demostrativa de contacto de ese archivo se limita a la portada. La página `contacto.html` conserva su controlador propio, evitando dos manejadores de envío sobre el mismo formulario.

## Verificación

Pasaron las comprobaciones de sintaxis JavaScript, estructura HTML, identificadores, rutas, imágenes y datos conservados. Se probaron búsquedas relacionadas, rangos de precio, prerrequisitos, filtros combinados, accesos rápidos, reinicio, resultados vacíos y exclusión del formulario interno del controlador antiguo.

La revisión visual en navegador queda pendiente: la herramienta de navegador no estuvo disponible en esta sesión. Abre `cursos.html` y recarga con Ctrl + F5. Comprueba escritorio, móvil, menú, filtros y contenidos desplegables.

La carpeta descargada carece de `.git`. Para integrar con GitHub utiliza un clon del repositorio del docente, una rama de trabajo y únicamente los archivos de este aporte. Revisa el cambio compartido de `script.js` en un commit separado. No sustituyas los demás archivos del equipo con copias anteriores.
