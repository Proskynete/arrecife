# Design System · Eduardo Álvarez · v1.0.0

> **This file is a verbatim transcription and is deliberately NOT translated.**
>
> Extracted from `Design System - Eduardo Alvarez.html` (a Claude Design canvas)
> on 27 Aug 2026, and re-synced from `Design System.dc.html` on 24 Sep 2026
> three times: first for Iconografía and the destructive buttons, then for the
> canvas update that applied §§ 68–75 and the older actions listed in
> `docs/decisions/`, and last for the canvas update that applied the remaining
> actions (§§ 2, 4, 4b, 9, 13, 17, 27, 39, 45, 57, 75) and the flat dark
> section. It is the text and the monospaced specifications; the
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
iconos 
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
radios por nombre · chip · control · card · panel 
transición 150ms ease-out 
foco: borde bioluz más el anillo del sistema, 2px + offset 3px 
una sola sombra 
contraste AA verificado 
movimiento · 150ms ease-out, solo color y borde · cinco excepciones con un solo criterio, feedback de progreso o de continuidad espacial: spinner del botón · panel lateral · shimmer del skeleton · altura del acordeón · halo de la firma 
Iconografía 
Phosphor · regular es la línea del sistema 
Phosphor es la única familia de iconos del sistema. No se mezcla con otra, no se dibujan iconos a mano y no se usan emojis como iconos. Se elige porque su peso regular cae sobre el trazo que ya nombra la identidad: 16/256 = 0.0625em contra el 1.6/24 = 0.0667em del documento. Seis por ciento de diferencia, que no es un píxel en ninguna pantalla. No hubo que derivar nada. 
Todo pasa por la primitiva <Icon as={Books} /> de @eduardoalvarez/arrecife/icons , que fija peso y tamaño. El sistema no publica un set de iconos: publica cómo se dibujan. 
REGULAR POR DEFECTO · DOS DESVÍOS DECLARADOS 
light 
Metadato y decoración. Fecha, duración, categoría. Nunca es interactivo, nunca lleva color de acento. 
regular 
El peso por defecto. Todo lo que se puede pulsar: botones, enlaces con icono, controles del reproductor. 
fill 
Estado activo. Guardado, reproduciendo, completado. El relleno dice «esto ya pasó», el trazo dice «puedes hacerlo». 
La primitiva pone regular sola; light y fill se piden con tone : quiet para light, current para fill, y solo por esas dos razones. 
thin · bold · duotone quedan fuera. Están en la librería, pero usarlos rompe la relación peso ↔ jerarquía. 
TAMAÑO · 1em, NO UNA ESCALA 
label 
13px 
ui 
15px 
lead 
18px 
vacío 
El icono mide 1em y hereda del texto que acompaña. Nadie elige un número. 
La única excepción es el icono suelto de estado vacío, que no acompaña a nada. 
No hay escala 16/20/24. Una escala propia se desincroniza del texto en cuanto cambia el cuerpo. 
ALINEACIÓN ÓPTICA CON TEXTO 
8 min de lectura 
Escuchar episodio 
./artículos 
gap 8px entre icono y texto, siempre. 
El icono hereda el color del texto salvo que sea metadato, donde baja a bruma. 
Icono a la izquierda cuando clasifica, a la derecha cuando indica movimiento. 
El play va en regular: aún no suena. Pasa a fill mientras reproduce. 
LOS QUE YA SE USAN · MUESTRA, NO CATÁLOGO 
Estos son los que aparecen hoy en el sitio, no los que están permitidos. Phosphor entero está disponible: el panel de cursos importa 89 iconos distintos y 77 son de su dominio, así que cerrar un set aquí solo obligaría a saltárselo. La regla que sí vincula es la de arriba — peso y tamaño — más una: un icono por concepto. Si «artículo» ya es article, no aparece después como note ni file-text. 
article 
microphone-stage 
graduation-cap 
users-three 
tree-structure 
stack 
funnel 
terminal-window 
rss-simple 
envelope-simple 
magnifying-glass 
arrow-right 
arrow-up-right 
github-logo 
linkedin-logo 
youtube-logo 
check-circle 
warning 
trash 
x 
Bioluz solo en los ocho de contenido, que son navegables. Los de utilidad van en bruma; los de estado heredan su color semántico. 
Pendiente: hay ph-fish y ph-waves en la librería, pero Tiburoncín no se dibuja con un icono de stock — la aleta es un asset propio. 
Botones 
6 variantes · 3 tamaños · 5 estados 
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
hover #5FE3D1 · focus ring 2px #35D6C0 + offset 3px · disabled · la misma variante al 50% de opacidad 
Leer artículos 
Leer artículos 
Leer artículos 
Leer artículos 
Enviando 
secundario · borde #2C4D5D · texto #EDF4F3 · fondo transparente
hover: borde y texto pasan a #35D6C0 . Nunca se rellena el fondo. 
Inscribirme 
Inscribirme 
Inscribirme 
Agotado 
Solo un botón arena por pantalla. Es el de conversión. 
conversión · bg #F2A65A · texto #2A1605 · solo cursos, charlas y mentoría 
Eliminar cuenta 
Eliminar cuenta 
Eliminar cuenta 
Eliminar cuenta 
Solo para lo irreversible. Nunca para «cancelar» un formulario. 
Revocar acceso 
Revocar acceso 
Revocar acceso 
Revocar acceso 
El de borde sí se rellena en hover: es la excepción a la regla del secundario. 
destructivo · bg #F4736B · texto #2B0A08 · hover #F78D86 · disabled · la misma variante al 50% de opacidad 
destructivoBorde · borde y texto #F4736B · hover rellena a coral con tinta #2B0A08 
modo claro · bg #C0392B · texto #FFF6F4 · hover #A32F22 — el coral claro no pasa AA con tinta oscura encima 
./ver_todos → 
./ver_todos → 
Pequeño · 13.5px 
Medio · 15px 
Grande · 17px 
↗ 
↗ 
terciario mono · formato ./acción → · en la escala del control · hover bioluz subrayado offset 4px 
tamaños · alturas fijas sm 32 · md 40 · lg 48 · un solo radio, control, para los tres · icono 42×42 · icon-sm 32×32, solo para UI densa 
Formulario 
newsletter · contacto · admin del blog 
Nombre 
default 
Correo 
focus · borde bioluz más el anillo del sistema, 2px + offset 3px 
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
checkbox 20px · r6 
Mensual 
Anual 
radio 20px · punto 10px 
Borrador 
Publicado 
switch 44×24 · pomo 16px 
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
categoría · píldora r999 mono 11.5px arena, borde arena al 28 % — la variante rellena solo para el filtro activo 
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
rol en mono 13px muted 
tarjeta · sin superficie propia, hereda el fondo · borde #1E3441 · r14 · pad 26px 
hover · borde a #2C4D5D , sin elevación ni escala. Nada se mueve. 
curso con portada · el título va en el cuerpo, no sobre la portada · la portada no se mueve en hover 
Navegación 
la estética CLI vive acá 
Eduardo Álvarez 
./artículos 
./charlas 
./cursos 
./hablemos 
~ / artículos / el-camino-hacia-mi-primera-charla 
Todos 
Spec-Driven Development 
Desarrollo con IA 
IA 
← 
Anterior 1 
2 
3 
Siguiente → 
FOOTER · FORMA BASE 
Eduardo Álvarez 
«SVG» 
«SVG» 
«SVG» 
«SVG» 
«SVG» 
«SVG» 
$ cd ~/eduardoalvarez.dev/2026 
FOOTER · FORMA COMPLETA 
Eduardo Álvarez 
Cursos para construir con IA, directos y al grano. 
./reportar_un_problema → 
Aprendizaje 
./ inicio ./ cursos ./ comunidad 
Cuenta 
./ mis cursos ./ mis diplomas 
Legal 
./ términos ./ privacidad ./ cookies 
$ cd ~/cursos.eduardoalvarez.dev/2026 
nav · 64px, o 56 en un shell con barra lateral · rgba(9,19,25,.86) + blur 14px · items mono 12.5px formato ./sección , activo bioluz con subrayado 1px 
tabs · grupo sobre surface sin borde · r10 · pad 4 · activo con fondo #17303E · paginación mono con «Anterior» y «Siguiente», página actual en bioluz sólido 
sin espacio · el nav y las pestañas hacen scroll horizontal; la paginación se envuelve y se centra 
footer · redes como iconos de 19px en plancton, gap 18px, hover bioluz · marcas en sólido, funcionales en trazo 1.6 · cada enlace con aria-label , que es lo que reemplaza al texto visible 
footer completo · segunda forma: marca, descripción, redes y acción a la izquierda, columnas a la derecha, firma cerrando tras un hairline · la firma imprime el dominio del sitio , no el de la identidad 
halo de la firma · barra de 2px de ancho, 1em de alto, radio pill, en bioluz; el halo es un anillo de box-shadow que crece hasta 5px y se desvanece en 1.5s ease-in-out; solo con movimiento permitido, en reposo la barra es sólida 
Feedback 
el único lugar donde van las caras 
Nuevo artículo publicado 
Ya está en el feed y en el RSS. 
Suscripción confirmada 
Nos vemos el primer lunes del mes. 
Este borrador tiene cambios sin guardar 
Se guardan solos cada 30 segundos. 
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
ESTADO VACÍO · HUECO DE TABLA O WIDGET 
Todavía no hay borradores. 
aviso · fondo al 8% del color semántico sobre abismo, borde al 22% · radio de tarjeta · marca con uno de cuatro íconos Phosphor — info, check-circle, warning, x-circle — en el color semántico · 12px entre ícono y texto · nunca emoji · la receta 8/22 vale en ambos modos; el error oscuro es el caso límite · un color semántico no es color de texto sobre su propio tinte, en ningún modo 
toast · receta «strong» del aviso · r14 · 16px de separación 
estado vacío · una cara a 66px + título 15px/500 + explicación 13.5px muted · hueco de tabla o widget · sin cara, sin superficie, glifo opcional del proyecto + línea 15px muted · skeleton shimmer 1.4s lineal 
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
Microfrontends sin dolor 
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
SERIES DE GRÁFICOS · CUATRO, POR TONO 
oscuro 
0 · bioluz 
1 · arena 
2 · tiburón 
3 · plancton 
claro 
0 · bioluz oscura 
1 · arena oscura 
2 · tiburón 
3 · muted 
tabla · panel con el hairline de tarjeta · cabecera mono 11.5px muted · celdas con 12px · divisiones hairline · hover surface (segunda fila) · el contenedor con scroll es un punto de foco del teclado 
stat · número display 800 en tinta primaria · bioluz en el badge y la sparkline · arena en el número solo para alert y achievement 
series · se distinguen por tono, no por luminosidad · umbral de objeto gráfico 3:1 · una quinta serie no se inventa: se agrupa en «otros» 
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
prose · 18px/1.75 bruma · máximo 68ch · h2 y h3 en display · metadatos mono 13px · cita con borde arena 3px, pad 16, interlineado 1.75, cursiva, sin fondo 
código inline · fondo corriente r4 pad 2px 6px · bloque · r14 · fondo casco, keywords arena, strings bioluz, comentarios plancton 
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
modal · surface sobre velo casco al 70% rgba(11,21,36,.7) · r16 · máx 760px · la cara solo cuando la acción es destructiva o celebratoria 
menú y select · surface elevada · r16 · pad 4 · items r6 de 36px · tooltip · r6 · espuma sobre oscuro, texto casco 13px/500 — se invierte a propósito para que destaque 
Secciones de página 
hero · encabezado · newsletter 
HERO · PORTADA 
Technical Lead · Spec-Driven Development 
Eduardo
Álvarez 
Enseño a construir software con IA sin dejar de entender lo que hacemos. 
Aquí reúno lo que voy aprendiendo sobre Spec-Driven Development, desarrollo con IA y liderar un equipo de desarrollo: artículos, charlas y la newsletter mensual, sin spam. 
Leer artículos 
Sobre mí 
hero-gradient linear-gradient(160deg, #091319 60%, #0d2129 100%) · r16 · pad 44px 40px 40px
texto al 62% del ancho · display 800/76 en pantalla completa · eyebrow mono bioluz uppercase 0.12em
Uno por sitio. Es el único bloque con degradado y la única pose de mascota; sangra por el borde inferior derecho, nunca centrada. En móvil la pose baja bajo los botones y se centra. La pose puede ir centrada solo en una página que es solo eso, sin contenido después. 
degradados · oscuro: hero linear-gradient(160deg, #091319 60%, #0d2129 100%) es el único de página; la sección es superficie plana fosa #10202B 
claro: hero linear-gradient(160deg, #F6F2EA 60%, #FFFFFF 100%) · sección linear-gradient(150deg, #FFFFFF 0%, #F6F2EA 100%) · og linear-gradient(145deg, #F6F2EA 55%, #FFFFFF 100%) 
ENCABEZADO DE PÁGINA INTERNA 
/artículos 
Artículos 
Artículos sobre Spec-Driven Development, desarrollo con IA y lo que voy aprendiendo liderando un equipo. 
Sin degradado, sin pose, sin fondo. Eyebrow mono bioluz uppercase · h1 44/700 · bajada 18px 
h1 44/700 es la escala del sitio de lectura; un panel de admin titula sus pantallas en h3 (25px) 
Mismo patrón en las seis páginas internas. Es lo que hace que el hero de portada se sienta especial. 
NEWSLETTER · SECCIÓN COMPLETA 
NEWSLETTER 
Artículos sobre Spec-Driven Development y desarrollo con IA 
Una edición mensual. Directamente en tu correo, sin intermediarios y sin ruido. 
Tu nombre 
tu@correo.dev 
«SVG» Suscribirme 
Sin spam. Solo cuando tengo algo que vale. 
un solo panel en superficie plana fosa #10202B · r16 · pad 26 · dos columnas desde 768 px, apilado por debajo · en el teléfono el botón va a ancho completo · con pose no lleva cara 
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
¡Éxito! 
Revisa tu correo para confirmar la suscripción. 
éxito · aviso bajo el formulario, no lo reemplaza 
Error 
No pudimos procesar tu suscripción. Inténtalo de nuevo. 
error de envío · el de validación va bajo cada campo, en 12px 
un solo panel en superficie plana fosa #10202B · r16 · pad 26 · máx 760px centrado · campos con label 13px/500 
avisos · receta «strong»: fondo al 10% del color semántico, borde al 100% · radio de tarjeta · ícono Phosphor en el color semántico, 12px hasta el texto 
La cara va aquí y en 404, en ningún otro lugar del portfolio. Acompaña al «sin spam»: el usuario ya decidió leer, no está evaluando si contratarte. 
Reproductor de audio 
3 modos · full · compact · banner 
Un solo componente con tres modos. Los controles son los mismos en todos: retroceder 15 s, play/pausa, adelantar 15 s, velocidad y volumen. Lo que cambia es el tamaño del botón, el grosor de la pista y qué se oculta bajo 640 px. 
MODO FULL · PODCASTS · 4 ESTADOS 
Entender antes de construir 
0:00 48:20 
«SVG» 
«SVG» 
«SVG» 
1x 
«SVG» 
reposo · pista 8px vacía · botón 48px · pomo oculto hasta hover 
Entender antes de construir 
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
contenedor fosa · borde #22414F · radio control · pad 16px 
pista 8px sobre corriente, relleno bioluz, pomo 16px espuma visible solo en hover · tiempos mono 12px bajo la pista
saltos de ±15 s en muted, hover a espuma · velocidad como chip sobre corriente · volumen oculto bajo 640 px 
los íconos tienen tamaños fijos por modo, no 1em: son controles, no acompañan texto 
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
Technical Lead · Spec-Driven Development 
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
borde de tarjeta #EBE6DC · borde de input #E6DFD2 · borde del secundario #D3C8B2 · superficie elevada #EFE9DE · hover bioluz #0C7466 · hover arena #96511F 
separación entre secciones 96 · contenedor ancho 1180 
$ cd ~/eduardoalvarez.dev/design-system
