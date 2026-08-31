# Changelog

## [0.5.0](https://github.com/Proskynete/arrecife/compare/v0.4.0...v0.5.0) (2026-08-31)


### ⚠ BREAKING CHANGES

* **primitives:** `Toast`, `ToastProvider`, `ToastViewport`, `ToastTitle` y `ToastDescription` dejan de exportarse; se usa `<Toaster />` una vez y `toast()` desde donde haga falta. `ToastAction` no cambia. Migración en docs/migracion-0.5.md.

### 🚀 Novedades

* **components:** EventCalendar, la agenda con crear, editar y borrar ([6190700](https://github.com/Proskynete/arrecife/commit/61907003eeef777ba86c594791b2e95d225eda1f))
* **components:** la barra, el pie y las métricas como en el documento ([203b669](https://github.com/Proskynete/arrecife/commit/203b669379f63048ce4b34fce9a9411aebec3279))
* **primitives:** AvatarUpload, el avatar que se puede cambiar ([f888b4c](https://github.com/Proskynete/arrecife/commit/f888b4c0fadeddfb885f0b4651bf56000da7d430))
* **primitives:** el plegable anima la altura, como cuarta excepción ([b9dd44c](https://github.com/Proskynete/arrecife/commit/b9dd44ccb99ccb2c0f00ec99fefa17bc838cca52))
* **primitives:** Toaster es la única forma de mostrar un aviso ([2ec1d23](https://github.com/Proskynete/arrecife/commit/2ec1d2383ecd87c58a88c9e32543dc2112df2321))


### 📚 Documentación

* los iconos de redes van agrupados, y por qué ([1939455](https://github.com/Proskynete/arrecife/commit/19394554185a54e4e752a86e27e60f1a60acec26))

## [0.4.0](https://github.com/Proskynete/arrecife/compare/v0.3.0...v0.4.0) (2026-08-31)


### 🚀 Novedades

* **components:** ScrollingProgressBar y las cinco ranuras que faltaban ([52325cc](https://github.com/Proskynete/arrecife/commit/52325ccff7eedbda39d449c98386668df7a518bf))
* **form:** la capa de formulario y el chasis de gráficas, en su subruta ([4a40857](https://github.com/Proskynete/arrecife/commit/4a40857e9e9efc8bbe4011bf72f6313347c97541))
* **primitives:** Accordion, AlertDialog y el Toast imperativo ([239120d](https://github.com/Proskynete/arrecife/commit/239120d510ea395159719581ef69c26734d82441))
* **tema:** el modo claro y oscuro, sin parpadeo y sin React ([c99995c](https://github.com/Proskynete/arrecife/commit/c99995c8eae6313ece6ffdcf927d9120f6050866))
* **tokens:** la paleta de series de gráfica, cuatro colores por tono ([b660a30](https://github.com/Proskynete/arrecife/commit/b660a30376c794be82f6a11808d9de175a31d5d9))


### 🐛 Correcciones

* **ci:** check:exports no veía React dentro de un chunk ([3354ab1](https://github.com/Proskynete/arrecife/commit/3354ab12feb867a81480e1c3b612280c40f765ad))


### 📚 Documentación

* los dos requisitos de consumo que no dan ningún error ([0a3a7fd](https://github.com/Proskynete/arrecife/commit/0a3a7fd71124aa2dafa3b70df4a90f8fd080544d))
* main está protegida y así se trabaja con ella ([a625a49](https://github.com/Proskynete/arrecife/commit/a625a499ba871ebf7f13a8f7f0cc9f7fbfff17fc))
* mergear saltándose la regla se pide, no pasa solo ([c3aca08](https://github.com/Proskynete/arrecife/commit/c3aca08d3926885edea1f500200f0a7496ab13bb))

## [0.3.0](https://github.com/Proskynete/arrecife/compare/v0.2.0...v0.3.0) (2026-08-31)


### ⚠ BREAKING CHANGES

* **tokens:** los cinco escalones de espaciado se renombran. Los valores no cambian ni un píxel.

### 🚀 Novedades

* **tokens:** el ritmo de página lleva step, para no comerse max-w-* ([1f8b79d](https://github.com/Proskynete/arrecife/commit/1f8b79d74b6e56b9c716ce2a1fdcee06042d78a0))


### 📚 Documentación

* **agents:** cómo se sube la versión, para no editar el CHANGELOG a mano ([b6e3997](https://github.com/Proskynete/arrecife/commit/b6e3997cd8ab20e7e8e28383c1995dd449919cf8))
* del footer BREAKING CHANGE solo llega el primer párrafo ([807d891](https://github.com/Proskynete/arrecife/commit/807d891d018245a1050d135eb1688449d8ef2c2e))

## [0.2.0](https://github.com/Proskynete/arrecife/compare/v0.1.1...v0.2.0) (2026-08-27)


### 🚀 Novedades

* llms.txt generado desde los tipos, para agentes de IA ([ec7f38e](https://github.com/Proskynete/arrecife/commit/ec7f38e6f9e344c0bc6cda8e60666fcbd2db778f))


### 🐛 Correcciones

* **ci:** admitir el ámbito deps-dev en el lint del título ([cdf9cd2](https://github.com/Proskynete/arrecife/commit/cdf9cd272a1bdb975f9277ed18324f5b905dedeb))
* **ci:** admitir el ámbito deps-dev y quitar configuración muerta ([42f09d3](https://github.com/Proskynete/arrecife/commit/42f09d3486149395b1cc0355077f7f0c41345047))
* **ci:** no lintear el título de los PRs automáticos ([8c2de14](https://github.com/Proskynete/arrecife/commit/8c2de148add50164ff0738474a436ee8ee84aa08))
* **llms:** quitar las rutas absolutas del disco del documento generado ([abde074](https://github.com/Proskynete/arrecife/commit/abde074fe0b345f2d7b638ec04a0b1e5c6550d5a))


### 📚 Documentación

* AGENTS.md para el agente que trabaja en el repo ([bf21c12](https://github.com/Proskynete/arrecife/commit/bf21c12b691900183549260a5cc539d741524fd6))
* apuntar a los dos documentos para agentes ([3d18592](https://github.com/Proskynete/arrecife/commit/3d18592bfbf4235a0f0f098556ebed22e6a318a9))


### 🚀 CI/CD

* **llms:** que el check diga QUÉ cambió, no solo que cambió ([e775548](https://github.com/Proskynete/arrecife/commit/e7755486da13a4b192c6559d25b3c379e3f99b43))
* verificar que llms.txt no se queda desactualizado ([78f0e6d](https://github.com/Proskynete/arrecife/commit/78f0e6dd520e56ad437ebf5c9dd85d2a716eef94))

## [0.1.1](https://github.com/Proskynete/arrecife/compare/v0.1.0...v0.1.1) (2026-08-27)

### 🐛 Correcciones

- **ci:** componente vacío en release-please y configuración al mínimo ([1888bb3](https://github.com/Proskynete/arrecife/commit/1888bb3388ab58a5df7f801948f5e70135a59639))
- **ci:** configuración de release-please contra el esquema oficial ([206c235](https://github.com/Proskynete/arrecife/commit/206c2358964ee55c6c2be4c5cca63284c8d10171))
- **ci:** quitar el patrón de título de release-please ([c3c8796](https://github.com/Proskynete/arrecife/commit/c3c879692b7f8078cb61176cbe031c36fd27dc08))

## 0.1.0 (2026-08-27)

### 🚀 Novedades

- **brand:** catálogo de Tiburoncín, Logo, Isotipo, Mascota y galería ([c0d616b](https://github.com/Proskynete/arrecife/commit/c0d616b0478005105e2fa6df474ee20eb1b14bb8))
- **ci:** comprobar la superficie publicada ([6c8e715](https://github.com/Proskynete/arrecife/commit/6c8e7154c734e8cc64f107d8ee3d3d878b77eb46))
- **components:** AudioPlayer migrado desde eduardoalvarez.dev ([b4c5345](https://github.com/Proskynete/arrecife/commit/b4c53459ad17bc97674f8a9108f9abf0f982407c))
- **components:** AuthorCard, Stat, TableOfContents y SidebarNav ([15c64c7](https://github.com/Proskynete/arrecife/commit/15c64c731e3da10356602799e7ea4f8bf508071f))
- **components:** EmptyState, Breadcrumb, Nav, Footer, Hero y NewsletterForm ([9ef81dd](https://github.com/Proskynete/arrecife/commit/9ef81dddd0a1368313a4f596ecff52a336c75f02))
- **components:** tarjetas, bloque de código, cita y cabecera de página ([6743361](https://github.com/Proskynete/arrecife/commit/6743361f349e46dbf7ab1e07942cf100c92b12fd))
- **og:** las cuatro plantillas con la retícula del documento ([68b9ebd](https://github.com/Proskynete/arrecife/commit/68b9ebdead8c69b788d29e5e5ab430389b600f0e))
- **primitives:** capa base sobre shadcn y Radix ([81855ee](https://github.com/Proskynete/arrecife/commit/81855eea62e36f4b07b0dc170dad577313eb35a5))
- **primitives:** Code en línea, skeleton con barrido y las escalas nuevas en Text ([9f742a3](https://github.com/Proskynete/arrecife/commit/9f742a30fae68ba149dc165030dffd59d96ec68c))
- **shiki:** el tema de resaltado generado desde tokens ([af5e795](https://github.com/Proskynete/arrecife/commit/af5e7956ca914376f265b80c225e24b21d8d653c))
- **tokens:** escalas nuevas, controles, degradados y paleta de sintaxis ([a17a508](https://github.com/Proskynete/arrecife/commit/a17a5081d4d112516e16f6961db502f5444a294c))
- **tokens:** fuente única, generador de Tailwind y guarda de pureza ([f6eb94b](https://github.com/Proskynete/arrecife/commit/f6eb94bb6ad47548fce9d5f39a47ef86130d9ae4))

### 🐛 Correcciones

- **a11y:** cursor-pointer en todo lo que se pulsa ([70b0784](https://github.com/Proskynete/arrecife/commit/70b07849311024874e6127e617db71c3833de2b8))
- **alert:** tinte al 8%, glifos mono y la segunda receta ([b90affc](https://github.com/Proskynete/arrecife/commit/b90affc5106c802ef864056aaeeca29dd942cd23))
- **audio-player:** los tamaños del documento ([4e68362](https://github.com/Proskynete/arrecife/commit/4e6836247e3e811194522fdaa99d91c8a7a231d9))
- **badge:** separar categoría, estado y métrica ([1c0239a](https://github.com/Proskynete/arrecife/commit/1c0239a472f4703c0e5859db923f2b12467cf463))
- **button:** cuatro variantes, tamaños del documento y fuera el de peligro ([07d209f](https://github.com/Proskynete/arrecife/commit/07d209fa5b969982b9e2a642e0d6ed8bd75af822))
- **cards:** padding de 26, categoría en los tags y la superficie que no entra ([8f30fda](https://github.com/Proskynete/arrecife/commit/8f30fdad3109a836176980629204657af43a39bd))
- **ci:** la primera versión es 0.1.0 y feat sube la minor ([2ed3859](https://github.com/Proskynete/arrecife/commit/2ed385956dda5485ce23ff7e65818d175bc46607))
- **cn:** derivar de tokens las escalas que tailwind-merge debe conocer ([2d6c4e5](https://github.com/Proskynete/arrecife/commit/2d6c4e503346413d6d2789a768698ff0beeab836))
- **storybook:** .storybook entraba al tsconfig pero no se compilaba ([2885830](https://github.com/Proskynete/arrecife/commit/2885830b2fb0982cf657903cc20da998efba7273))
- **storybook:** el contenedor de docs también toma el fondo del token ([beeb434](https://github.com/Proskynete/arrecife/commit/beeb434631d49571554420c98150143811f1bd40))
- **storybook:** el wrapper interno de docs, que era el que pintaba blanco ([edda8c6](https://github.com/Proskynete/arrecife/commit/edda8c65ff05d1e3ca815d52d0be4cbcad91ad1f))
- **storybook:** forzar el fondo del contenedor de docs ([11fcfc7](https://github.com/Proskynete/arrecife/commit/11fcfc730f595926f04e69f171feb948b683d34a))
- **storybook:** tema de docs por la API y no a base de CSS a la contra ([86f80cf](https://github.com/Proskynete/arrecife/commit/86f80cfe7e26822a96169559824691f7164634da))
- **storybook:** tematizar el manager, que es lo que quedaba blanco ([d1643a9](https://github.com/Proskynete/arrecife/commit/d1643a9f3e648503a20fe9e016dcf3481d77c159))
- **tsconfig:** incluir .storybook por include y no por files ([ca8a8d6](https://github.com/Proskynete/arrecife/commit/ca8a8d6e26eba6e30e4bdd4019cc6673ef197542))

### 📚 Documentación

- cómo se consume, qué se decidió y por qué ([0f9654f](https://github.com/Proskynete/arrecife/commit/0f9654ff8ae25ba9d9df0a2dbb422fc8abf05e55))
- incorporar al repo los documentos de identidad y las decisiones ([ca9273f](https://github.com/Proskynete/arrecife/commit/ca9273fa821d9314f54d8d821b4ee3dfeb9446df))
- **readme:** cómo publicar una versión ([df9702b](https://github.com/Proskynete/arrecife/commit/df9702b71ba22879afcfe5a5e5513abe59af38eb))
- **readme:** la fase 5, las subrutas nuevas y la tercera corrección de contraste ([871cee9](https://github.com/Proskynete/arrecife/commit/871cee92a8fef7ea33264b869140d45cd6f4d3b2))

### 🚀 CI/CD

- no correr CI y lint dos veces por PR ([010ca3c](https://github.com/Proskynete/arrecife/commit/010ca3c249bcbaa3558ec30ff173fb053f56b56a))
- pipeline de publicación en npm y las comprobaciones de PR ([930da3d](https://github.com/Proskynete/arrecife/commit/930da3d91199eff38135e2a07456b02cd935c8a1))
- release-please y publicación de confianza con OIDC ([f005b8c](https://github.com/Proskynete/arrecife/commit/f005b8c3a0dfc0c42015140f52ebe4c37e8507e5))
