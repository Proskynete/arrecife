# Design System · Eduardo Álvarez · v1.0.0

> **This file is a verbatim transcription and is deliberately NOT translated.**
>
> Extracted from `Design System - Eduardo Alvarez.html` (a Claude Design canvas)
> on 27 Aug 2026. It is the text and the monospaced specifications; the
> illustrations and SVGs do not survive extraction and show up as «SVG».
>
> The canvas is still the source, and the canvas is in Spanish. This copy is in
> the repo so it can be grepped and so a drift like the Shiki theme's `#E05252`
> cannot go unnoticed for months again — and that only works while the copy
> matches the canvas word for word. Translating it would break exactly the
> property it exists for. The rest of the repo is in English; this file and
> `brand-manual.md` are the two exceptions, and this is why.

~/design-system 
v1.0.0 
botones 
formulario 
etiquetas 
tarjetas 
navegación 
feedback 
datos 
contenido 
capas 
secciones 
audio 
og 
claro 
Librería de componentes · Eduardo Álvarez 
Cada componente con todos sus estados 
Los estados se muestran uno al lado del otro en vez de al pasar el mouse: así se pueden comparar, medir y copiar. Debajo de cada grupo va la especificación exacta en monoespaciada — es lo que necesita quien lo implemente. 
radio control 10px 
radio card 14px 
transición 150ms ease-out 
foco: borde bioluz, sin outline 
una sola sombra 
contraste AA verificado 
Botones 
4 variantes · 3 tamaños · 5 estados 
DEFAULT 
HOVER 
FOCUS 
DISABLED 
LOADING 
Leer artículos 
Leer artículos 
Leer artículos 
Leer artículos 
Cargando 
primario · bg #35D6C0 · texto #06171A · 15px/500 · pad 12px 22px · r10
hover #5FE3D1 · focus ring 2px #35D6C0 + offset 3px · disabled bg #1C3B40 texto #5D7D80 
Trabajar juntos 
Trabajar juntos 
Trabajar juntos 
Trabajar juntos 
Enviando 
secundario · borde #2C4D5D · texto #EDF4F3 · fondo transparente
hover: borde y texto pasan a #35D6C0 . Nunca se rellena el fondo. 
Inscribirme 
Inscribirme 
Inscribirme 
Agotado 
Solo un botón arena por pantalla. Es el de conversión. 
conversión · bg #F2A65A · texto #2A1605 · solo cursos, charlas y mentoría 
./ver_todos → 
./ver_todos → 
Pequeño · 13.5px 
Medio · 15px 
Grande · 17px 
↗ 
terciario mono · formato ./acción → · hover bioluz subrayado offset 4px
tamaños · sm 8px 14px r8 · md 12px 22px r10 · lg 15px 30px r12 · icono 42×42 r10 
Formulario 
newsletter · contacto · admin del blog 
Nombre 
default 
Correo 
focus · borde bioluz, sin outline 
Correo 
Falta el dominio del correo. 
Slug 
disabled 
Resumen del artículo 
Después de múltiples rechazos, finalmente pude dar mi primera charla internacional. 
textarea · min-height 96px 84 / 160 
Categoría 
engineering-culture 
career-strategy 
ai-native-engineering 
▾ 
Buscar 
/ 
buscar en artículos 
prefijo mono bioluz · atajo «/» 
Sin marcar 
✓ Marcado 
Bloqueado 
checkbox 19px · r5 
Mensual 
Anual 
radio 19px · borde 5px 
Borrador 
Publicado 
switch 42×24 · pomo 18px 
Sin spam. Solo cuando tengo algo que vale. 
Etiquetas y estados 
categoría · estado · métrica 
engineering-culture 
career-strategy 
ai-native-engineering 
activa 
Publicado 
Borrador 
Fallo de build 
Archivado 
Nuevo 
8 min de lectura 
v5.0.1 
6 módulos 
En vivo 
categoría · píldora r999 mono 11.5px arena, borde #4A3A25 — la variante rellena solo para el filtro activo
estado · cuadrada r6 sans 12.5px/500, fondo al 8% del color sobre abismo · métrica · píldora mono muted 
Tarjetas 
artículo · charla · curso · enlace 
engineering-culture 
18 ago 2026 · 8 min 
El camino hacia mi primera charla internacional 
Después de múltiples rechazos y mucho esfuerzo, finalmente pude dar mi primera charla internacional en CaribeConf. 
./leer → 
agosto 2026 
charla 
Microfrontends sin dolor 
Cómo unificamos 12 aplicaciones bajo una sola experiencia. 
CaribeConf · Barranquilla 
RUTA · FRONTEND 
Microfrontends sin dolor 
38% · módulo 3 de 6 
LINKS · FILA 
Portfolio ↗ 
Cursos ↗ 
Mentoría 1:1 ↗ 
AUTOR 
Eduardo Álvarez 
Technical Lead · Chile 
avatar 52px · nombre 15px/500
rol en mono 12px muted 
tarjeta · bg #0B1620 sobre fosa, o fosa sobre abismo · borde #1E3441 · r14 · pad 26px
hover · borde a #2C4D5D , sin elevación ni escala. Nada se mueve. 
Navegación 
la estética CLI vive acá 
Eduardo Álvarez 
./artículos 
./charlas 
./cursos 
./hablemos 
~ / artículos / el-camino-hacia-mi-primera-charla 
Todos 
Liderazgo 
Plataforma 
IA 
← 
1 
2 
3 
→ 
ADMIN · SIDEBAR 
▸ Artículos 
▸ Borradores 
▸ Newsletter 
▸ Media 
v5.0.1 · main 
FOOTER 
Eduardo Álvarez 
«SVG» 
«SVG» 
«SVG» 
«SVG» 
«SVG» 
«SVG» 
$ cd ~/eduardoalvarez.dev/2026 
nav · 64px · rgba(9,19,25,.86) + blur 14px · items mono 12.5px formato ./sección , activo bioluz con subrayado 1px
tabs · grupo con borde único, activo con fondo #17303E · paginación mono, página actual en bioluz sólido
footer · redes como iconos de 19px en plancton, gap 18px, hover bioluz · marcas en sólido, funcionales en trazo 1.6 · cada enlace con aria-label , que es lo que reemplaza al texto visible 
Feedback 
el único lugar donde van las caras 
✦ 
Nuevo artículo publicado 
Ya está en el feed y en el RSS. 
✓ 
Suscripción confirmada 
Nos vemos el primer lunes del mes. 
! 
Este borrador tiene cambios sin guardar 
Se guardan solos cada 30 segundos. 
✕ 
No se pudo publicar 
Falta el resumen y la imagen de portada. 
404 · aguas desconocidas 
Nadaste fuera del mapa. Volvamos a la superficie. 
Error del servidor 
Algo se rompió de mi lado. Ya lo estoy mirando. 
Sin resultados 
No encontré nada con ese término. Prueba con menos palabras. 
Módulo completado 
Sigues tú: microfrontends sin dolor. 
TOAST · ESQUINA INFERIOR DERECHA 
Artículo guardado 
hace 2 segundos 
✕ 
SKELETON · CARGA 
aviso · fondo al 8% del color semántico sobre abismo, borde al 22% · r12 · glifo mono a la izquierda, nunca emoji
estado vacío · una cara a 66px + título 15px/500 + explicación 13.5px muted · skeleton shimmer 1.4s lineal 
Datos 
admin del blog · métricas de charla 
TÍTULO 
CATEGORÍA 
FECHA 
ESTADO 
El camino hacia mi primera charla internacional 
engineering-culture 
2026-08-18 
Publicado 
La IA no reemplaza tu experiencia. La pone a prueba 
career-strategy 
2026-06-30 
Publicado 
Plataformas internas que nadie odia 
platform 
— 
Borrador 
12 
APLICACIONES 
4h 20m 
DURACIÓN 
0 
DESIGN SYSTEM 
Progreso del curso 
38% 
tabla · cabecera fosa mono 11.5px muted · filas 17px 24px, alternas #0D1A22 · divisiones al 25% de opacidad
métrica · display 800, bioluz para lo neutro y arena solo cuando el número es el problema 
Contenido largo 
prose · 18px · 68ch 
El design system va antes del split 
Sin una librería compartida, los microfrontends no descentralizan: fragmentan. Lo hicimos en el orden equivocado y lo pagamos dos veces — una en tiempo de equipo y otra en la confianza del usuario, que es la más difícil de recuperar. 
Los microfrontends resuelven un problema de organización, no de código. 
El paquete @ui/core tenía que existir primero. Recién después tiene sentido partir la aplicación. 
single-spa.config.ts 
import { registerApplication } from 'single-spa' 
// una entrada por dominio, no por equipo 
registerApplication ( 'cursos' , loadCursos ) 
Una librería de UI compartida y versionada. 
Un contrato de rutas que el shell impone. 
Telemetría común desde el primer día. 
EN ESTA PÁGINA 
El problema 
La arquitectura 
Cuándo NO usarlos 
El marco de decisión 
prose · 18px/1.75 bruma · máximo 68ch · h2 y h3 en display · cita con borde arena 3px, cursiva, sin fondo
código inline · fondo corriente r4 pad 2px 6px · bloque · fondo casco, keywords arena, strings bioluz, comentarios plancton 
Capas 
modal · menú · tooltip 
¿Despublicar el artículo? 
Sale del feed y del RSS de inmediato. El enlace queda roto para quien lo haya compartido. 
Cancelar 
Despublicar 
MENÚ 
Editar 
Duplicar 
Ver en el sitio 
Eliminar 
TOOLTIP 
Se guarda cada 30 s 
⌘S 
modal · fosa sobre velo rgba(6,15,20,.72) · r16 · máx 440px · la cara solo cuando la acción es destructiva o celebratoria
menú · corriente r12 pad 7px, item r8 · tooltip · espuma sobre oscuro, texto casco 13px/500 — se invierte a propósito para que destaque 
Secciones de página 
hero · encabezado · newsletter 
HERO · PORTADA 
Ayudo a equipos de ingeniería a escalar con criterio 
Eduardo
Álvarez 
Ayudo a equipos de ingeniería a escalar con criterio — desde la arquitectura de plataforma hasta la cultura de liderazgo técnico en la era de la IA. 
Este sitio reúne mis artículos sobre liderazgo técnico, arquitectura de plataformas y el impacto de la IA en los equipos de software. 
Leer artículos 
Trabajar juntos 
hero-gradient linear-gradient(160deg, #091319 60%, #0d2129 100%) · r16 · pad 44px 40px 40px
texto al 62% del ancho · display 800/76 en pantalla completa · eyebrow mono bioluz uppercase 0.12em
Uno por sitio. Es el único bloque con degradado y la única pose de mascota; sangra por el borde inferior derecho, nunca centrada. En móvil la pose baja bajo los botones y se centra. 
ENCABEZADO DE PÁGINA INTERNA 
/artículos 
Artículos 
Escribiendo acerca de liderazgo de ingeniería, arquitectura de plataformas y la era de la IA. 
Acá encontrarás deep-dives técnicos, ensayos de opinión sobre cómo la IA está cambiando la forma en que escribimos software, y reflexiones prácticas sobre liderar equipos. Todo escrito desde la trinchera, no desde la teoría de libro. 
Sin degradado, sin pose, sin fondo. La ruta en mono muted arriba hace de eyebrow · h1 44/700 · bajada 17px · párrafo de contexto 15px
Mismo patrón en las seis páginas internas. Es lo que hace que el hero de portada se sienta especial. 
NEWSLETTER · SECCIÓN COMPLETA 
NEWSLETTER 
Artículos sobre liderazgo, plataforma y la era de la IA 
Una edición mensual. Directamente en tu correo, sin intermediarios y sin ruido. 
Tu nombre 
tu@correo.dev 
«SVG» Suscribirme 
Sin spam. Solo cuando tengo algo que vale. 
panel con degradado de sección · r20 · pad 44px · dos columnas hasta 900 px, luego apilado
la pose del escritorio va en su recuadro con r12 — es la única ilustración del sistema con fondo propio, así que necesita el radio para no chocar con el panel
Es la excepción al «un solo degradado por sitio»: la sección de newsletter y el hero comparten ese permiso porque nunca aparecen juntos en la misma pantalla. 
NEWSLETTER · COMPONENTE SUBSCRIBE 
Newsletter 
Recibe mensualmente los últimos artículos directamente en tu correo. 
Nunca te enviaré spam, solo contenido de calidad. 
Nombre 
Email 
«SVG» Suscribirme 
Sin spam. Solo cuando tengo algo que vale. 
reposo · en fila desde 640px; bajo eso apilado y botón a ancho completo 
Procesando... 
enviando · botón a 60% de opacidad, campos deshabilitados 
«SVG» 
¡Éxito! 
Revisa tu correo para confirmar la suscripción. 
éxito · aviso bajo el formulario, no lo reemplaza 
«SVG» 
Error 
No pudimos procesar tu suscripción. Inténtalo de nuevo. 
error de envío · el de validación va bajo cada campo, en 12px 
panel fosa o #0B1620 · r16 · pad 30px · máx 760px centrado · campos con label 13px/500
avisos · fondo al 10% del color semántico, borde al 100%, r12 · glifo mono a la izquierda
La cara va aquí y en 404, en ningún otro lugar del portfolio. Acompaña al «sin spam»: el usuario ya decidió leer, no está evaluando si contratarte. 
Reproductor de audio 
3 modos · full · compact · banner 
Un solo componente con tres modos. Los controles son los mismos en todos: retroceder 15 s, play/pausa, adelantar 15 s, velocidad y volumen. Lo que cambia es el tamaño del botón, el grosor de la pista y qué se oculta bajo 640 px. 
MODO FULL · PODCASTS · 4 ESTADOS 
Liderar sin dejar de escribir código 
0:00 48:20 
«SVG» 
«SVG» 
«SVG» 
1x 
«SVG» 
reposo · pista 8px vacía · botón 48px · pomo oculto hasta hover 
Liderar sin dejar de escribir código 
14:58 48:20 
«SVG» 
«SVG» 
«SVG» 
1.5x 
«SVG» 
reproduciendo + hover · pomo espuma 16px con sombra · velocidad cicla 1 → 1.25 → 1.5 → 1.75 → 2 
0:00 0:00 
«SVG» 
«SVG» 
cargando · spinner dentro del botón · duración sin metadatos muestra 0:00 
0:00 0:00 
«SVG» 
«SVG» 
«SVG» 
error · el botón pasa a rojo con icono reintentar; hover al 80%. Sin cara: es un fallo técnico 
contenedor fosa · borde #22414F · r8 · pad 16px
pista 8px sobre corriente, relleno bioluz, pomo 16px espuma visible solo en hover · tiempos mono 12px bajo la pista
saltos de ±15 s en muted, hover a espuma · velocidad como chip sobre corriente · volumen oculto bajo 640 px 
MODO COMPACT · SIDEBAR 
21:04 48:20 
«SVG» 
«SVG» 
«SVG» 
1x 
pista 6px · botón 34px · pomo 12px · sin volumen
sin contenedor propio: hereda la tarjeta que lo aloja 
MODO BANNER · NARRACIÓN DE ARTÍCULO 
Narración de audio 
3:12 / 11:40 
«SVG» 
«SVG» Reproducir 
«SVG» 
1x 
«SVG» 
único modo con onda de 5 barras y botón en píldora con etiqueta · la onda anima solo mientras suena
al salir de pantalla aparece el reproductor flotante : barra de 1px arriba, tarjeta fosa al 95% con blur y borde superior bioluz al 25% 
Imágenes OG 
1200×630 real, mostradas al 47% 
Cuatro plantillas, no una por pieza. Todas comparten la misma retícula: eyebrow arriba, titular a la izquierda, firma abajo y la mascota anclada a la derecha. Lo único que cambia es el fondo y qué pose entra. Están dibujadas a su tamaño real y escaladas para verse acá, así que las medidas de abajo son las de producción. 
ENGINEERING-CULTURE · 8 MIN 
El camino hacia mi primera charla internacional 
eduardoalvarez.dev 
artículo · degradado 145° sobre abismo
categoría y tiempo de lectura en arena · una cara según el tono del texto 
NUEVO CURSO 
Microfrontends sin dolor 
6 módulos · 4h 20m
cursos.eduardoalvarez.dev 
curso · la única plantilla en claro
pose completa a la izquierda · eyebrow y URL en arena oscura #A65B27 
CHARLA · CARIBECONF 2026 
Microfrontends sin dolor 
Cómo escalar React —y tu equipo— sin romperlo todo. 
Barranquilla, Colombia · agosto 2026 
charla · eyebrow en bioluz con evento y año
pose sangrando por la esquina, igual que la portada de slide 
Eduardo Álvarez 
Ayudo a equipos de ingeniería a escalar con criterio 
por defecto · recreada desde scripts/generate-og-default.mjs 
aleta en bioluz a 200px con halo · divisor en x=290 · Geist 72/700 y 28/400, no la display 
RETÍCULA 
lienzo 1200×630 · margen 64px 
eyebrow mono 20px · tracking 0.12em
titular display 800 58px · máx 3 líneas al 70% del ancho
excepción: la plantilla por defecto usa Geist 72/700 y su propia retícula de dos columnas — la define el generador, no esta tabla
firma mono 21px con la aleta a 34px
mascota anclada a la derecha, alto máx 430px 
GENERACIÓN 
Se generan en el build con Satori o resvg, nunca a mano. El título entra como texto y se trunca a 3 líneas; si no cabe, se recorta con elipsis en vez de bajar el tamaño. 
Sobre la aleta: espuma en las tres plantillas oscuras, dos azules en la de curso. Es el error más fácil de cometer en un generador, porque el fondo es un parámetro. 
Modo claro 
cursos · lectura larga · PDF 
Empezar módulo 
Ver programa 
Inscribirme 
./ver_todos → 
ruta · frontend 
Completado 
MÓDULO 03 
El contrato de rutas del shell 
Cómo el orquestador impone un contrato sin convertirse en un framework propio. 
64% 
Terminaste el módulo. Sigue el 04. 
botón primario en claro · #0B1524 sobre papel
bioluz y arena pasan a sus variantes oscuras 
En claro el acento NO se usa como fondo de botón primario: bioluz y arena no dan contraste suficiente con texto oscuro encima.
El primario pasa a casco sólido, y los acentos viven en sus variantes oscuras #0D7C6F (4.55:1) / #A65B27 (4.54:1) para texto y bordes — medidos sobre papel, no los valores del primer borrador, que se quedaban en 3.57 y 3.95 y no pasaban AA. 
$ cd ~/eduardoalvarez.dev/design-system