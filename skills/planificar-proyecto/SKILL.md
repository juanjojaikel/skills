---
name: planificar-proyecto
description: "Lleva una idea de app, SaaS, plataforma, marketplace o negocio digital desde cero hasta un plan completo y una carpeta de proyecto lista para construir con Claude Code, aunque la persona nunca haya programado. Hace una entrevista corta sin jerga, investiga con agentes el mercado, la competencia, la ley del país y las opciones técnicas, pasa todo por un Consejo de 5 asesores, y escribe la visión, la hoja de ruta por etapas, las decisiones y la skill /guardar. Úsela siempre que alguien quiera empezar un producto digital nuevo y todavía no tenga plan: «tengo una idea», «quiero hacer una app», «por dónde empiezo», «I want to build an app», «tenho uma ideia de app», aunque no la nombre. También si pide hoja de ruta, etapas o estructura de carpetas para un proyecto nuevo. No es para proyectos que ya tienen plan o código (agregar funciones, continuar etapas) ni para una tarea suelta: fijar precios, marketing de algo ya publicado, comparar competidores, diseñar una página, o validar si un curso se vendería."
---

# Planificar Proyecto — de la idea al plan listo para construir

Esta skill existe porque la mayoría de los proyectos que una persona empieza con IA mueren por lo mismo: se arranca a
construir sin saber qué se construye, para quién, con qué límites legales o técnicos, ni en qué orden. Y cuando el chat
se cierra, todo el contexto se pierde y el siguiente chat empieza de cero.

Lo que esta skill deja al terminar es lo contrario de eso: una carpeta de proyecto donde cada chat nuevo arranca
sabiendo exactamente dónde va, qué sigue y qué está pendiente, con la investigación hecha, las decisiones escritas con
su porqué, una hoja de ruta por etapas y subetapas, y una skill `/guardar` que al cerrar cada sesión deja todo
registrado y subido a GitHub. Es el método que se usó para planificar un SaaS real (Hyped, una app para gimnasios),
generalizado para cualquier nicho, cualquier producto digital y cualquier persona, sepa o no programar.

## Quién la usa y cómo hablarle

Quien la usa probablemente nunca ha construido una app, puede que nunca haya usado Claude Code, y puede que no sepa
qué es un repositorio, un backend o un dominio. Por eso:

- **Escriba sin jerga.** Si un término del oficio es inevitable, explíquelo en la misma línea («un repositorio: la copia
  del proyecto con historial que vive en GitHub»).
- **Responda y genere todo en el idioma en que le escriba el usuario.** La skill está escrita en español, pero si el
  usuario escribe en inglés o portugués, la entrevista, la investigación, la visión, las fichas y el `CLAUDE.md` salen
  en ese idioma. Los nombres de los archivos de sistema (`ESTADO.md`, `LEEME.md`, `DECISIONES.md`, `CHANGELOG.md`,
  `CLAUDE.md`) y de las carpetas base no se traducen: los scripts dependen de ellos.
- **Trato de usted** en español (neutro, respetuoso en toda Latinoamérica y España); si el usuario tutea con insistencia,
  siga su registro.
- **El usuario valida; Claude hace el trabajo.** Nunca le pida al usuario algo que Claude pueda averiguar o hacer solo.
  Se le pide únicamente lo que exige su criterio, su firma, su contraseña o su tarjeta.
- **Pregunte en rondas, numerado y con respuesta recomendada**, al estilo de la skill `grilling`: cada pregunta trae
  «➡️ Recomendado: …» y está redactada para que un «sí» acepte la recomendación. El usuario puede contestar todas de
  una vez o una por una. Cada pregunta de más es una razón para que alguien nuevo abandone.

## Principios que no se negocian

Son las reglas que hicieron que el método funcionara. Se copian al `CLAUDE.md` del proyecto nuevo para que rijan
en cada chat posterior.

1. **Ningún número sin fuente y fecha.** Toda cifra de la investigación lleva URL y la fecha en que se leyó. Lo que no se
   pudo confirmar se marca «no verificado», nunca se presenta como hecho.
2. **Lo que no se verificó es pendiente, no hecho.**
3. **Registros impersonales, en tercera persona, para alguien que no estuvo en el chat.** «Se decidió…», «Quedó
   pendiente…». Nunca «Claude hizo», nunca «<nombre> dijo». Fechas absolutas (`4-nov-2026`).
4. **Nada se borra.** Lo superado va a `99. Archivo\` con un `LEEME.md` que dice por qué; un error escrito antes se marca
   («⚠️ hasta el 3-nov decía X: era un error»), no se esconde.
5. **La visión del usuario manda** sobre la investigación y sobre el Consejo: ellos avisan de límites técnicos, legales
   o de mercado; no deciden el producto.
6. **Un chat por subetapa.** El usuario abre un chat y pregunta «¿con qué seguimos?»; Claude lee `ESTADO.md`, nombra el
   chat y arranca con el guion de arranque. El usuario nunca copia mensajes de contexto.
7. **Secretos y datos de personas reales: nunca** en la carpeta, en el chat ni en el repositorio. En los registros se
   escribe «ver gestor de secretos», no el valor. Datos de clientes reales: solo datos inventados (sintéticos).
8. **Presupuesto.** Una ventana pesada de Claude a la vez; agentes en serie salvo que el usuario diga lo contrario; máximo
   10 agentes por investigación; si caben menos agentes que lentes, se fusionan (la referencia dice cómo). Cada agente
   escribe su archivo por partes, para que si una corrida se corta se reanude desde lo escrito, no se repita.
9. **Sin fechas ni atrasos.** El plan no tiene calendario: cada etapa termina cuando su resultado existe y se verificó,
   no en una fecha. Las únicas fechas escritas son las de lo que ya pasó.

## Antes de empezar

1. **Mire si ya hay un proyecto planificado.** Si en la carpeta de trabajo existe `ESTADO.md` con un «Siguiente paso
   exacto», esta skill ya corrió: dígalo, no vuelva a planificar, y siga el protocolo del `CLAUDE.md` de esa carpeta.
   Si existe un `ESTADO.md` a medias (sin hoja de ruta o sin fichas), diga qué falta y retome desde esa fase.
2. **Corra la preparación** (solo lee; no instala nada):
   ```
   node "<ruta-de-esta-skill>/scripts/preparar.mjs" --raiz "<carpeta del proyecto>"
   ```
   Sin `--raiz` revisa la carpeta de trabajo. Dice si están Git, GitHub CLI (`gh`) con sesión iniciada y Node, y si la
   carpeta ya tiene una planeación o está dentro de otro repositorio. Si falta algo, explíquele
   al usuario en lenguaje llano qué es, para qué sirve y cómo instalarlo (el script imprime el enlace oficial de cada
   uno); Git y `gh` hacen falta solo al final (fase 7), así que puede empezar la entrevista y la investigación mientras
   tanto. Nunca instale nada por su cuenta sin el OK del usuario.
3. **Diga en tres líneas qué va a pasar:** una entrevista corta, una investigación con agentes que tarda un rato, un
   Consejo que revisa la idea desde cinco ángulos, la visión y la hoja de ruta para aprobar, y al final la carpeta del
   proyecto con todo adentro y en GitHub. Que sepa que al terminar va a poder abrir un chat nuevo y preguntar «¿con
   qué seguimos?».

## Las 8 fases, en orden

Cada fase produce archivos concretos dentro de `00. Planeacion\` del proyecto, y esa carpeta vive desde la fase 1 en la
carpeta definitiva del proyecto: no hay carpeta temporal ni mudanza después (las rutas de las fichas dependen de eso).
Si el usuario ya tiene una carpeta para el proyecto, use esa. Si no, la carpeta se llama como el producto; y si el
producto todavía no tiene nombre, la lente 10 de la investigación (nombre y dominio) va primero y da un nombre de
trabajo (si después cambia, se renombra la carpeta y se anota en `DECISIONES.md`).

### Fase 1 — Entrevista (lea `references/entrevista.md`)

Ronda 1: las preguntas de arranque, numeradas, con respuesta recomendada, todas de una vez. Cubren quién es la persona
y qué sabe (para ajustar el tono y la recomendación técnica), la idea, para quién, país e idioma, cómo gana plata, quién
más está en el proyecto y con qué rol, qué existe ya (nombre, dominio, cuentas, código), cuánto tiempo y dinero hay, y
si va a grabar o enseñar el proceso (eso cambia el guion de arranque de cada chat). Si el usuario ya contó parte de eso
en su mensaje, no lo vuelva a preguntar: diga qué entendió y pregunte solo lo que falta.

Resultado: `00. Planeacion\01-entrevista\entrevista.md` (las respuestas, ordenadas, con la fecha) y, en memoria de
trabajo, el **perfil del usuario** (nivel técnico, tiempo, presupuesto) que gobierna todas las recomendaciones
siguientes.

### Fase 2 — Investigación con agentes (lea `references/investigacion.md`)

Avise al usuario que esto tarda y que puede dejar la ventana abierta. Despliegue agentes con el tool `Agent`, uno por
**lente**, en serie (o en paralelo si el usuario lo pide y su plan lo aguanta), máximo 10:

1. Competencia y precios · 2. Conversación real (qué dice la gente del problema) · 3. Disposición a pagar · 4. Tamaño y
alcance · 5. Legal y regulatorio del país (datos personales, facturación, consumidor, lo específico del nicho) ·
6. Pagos y cobros en ese país · 7. Opciones técnicas (stack, hosting, autenticación, móvil) adecuadas al nivel y
presupuesto del usuario · 8. Herramientas y skills de Claude Code que sirven para este proyecto, con URL comprobada ·
9. Fracasos y aprendizajes de la categoría · 10. Nombre y dominio (solo si no hay nombre).

Las lentes 1-4 y 7-8 van siempre; 5, 6, 9 y 10 según el proyecto. Cada agente escribe su reporte en
`00. Planeacion\02-investigacion\<lente>.md` con un «Resumen para decidir» arriba, cada cifra con URL y fecha, y una
sección «Vacíos» con lo que no encontró. Luego UN agente adversarial verifica las 5 afirmaciones de más peso y deja
`_verificaciones.md` con veredicto (CONFIRMADA · CORREGIDA · REFUTADA) e impacto. La lente técnica produce
`03-arquitectura\opciones-tecnicas.md`: dos o tres caminos con costo, qué exige saber, y una recomendación para ESTE
usuario. La lente de herramientas produce `06-herramientas-claude-code\catalogo-skills-urls.md` y `.json`, con cada
URL comprobada con el script de la skill, que ya sirve aunque la estructura todavía no exista:
```
node "<ruta-de-esta-skill>/assets/guardar/scripts/verificar_urls_github.mjs" --raiz "<carpeta del proyecto>" --agregar <url> <url> ...
```
Sin `gh`, las URLs quedan con `comprobada: false`.

**Por último, concilie.** Los agentes trabajan por separado y se contradicen: un precio distinto para el mismo
competidor, una ley citada con otro alcance. Usted mismo, sin otro agente, cruza los reportes con las verificaciones y
deja `02-investigacion\_conciliacion.md` con cada contradicción, cuál dato queda y por qué (la referencia trae el
formato). El Consejo y la visión citan solo el dato conciliado: si no, un dato ya corregido se cuela en la fuente de
verdad del producto.

Si no hay `Agent` o búsqueda web, dígalo con franqueza y haga la investigación usted mismo con lo que tenga, marcando lo
que quedó más débil.

### Fase 3 — Consejo de 5 asesores (lea `references/consejo.md`)

Con los reportes, las verificaciones y la conciliación, escriba las cinco voces (el Contrario, el de Primeros Principios, el
Expansionista, el de Afuera, el Ejecutor), la revisión anónima entre pares y el veredicto del Presidente en
`00. Planeacion\04-consejo\acta-consejo-<AAAA-MM-DD>.md`. El veredicto es consejo: se lo presenta al usuario en
lenguaje llano con los tres o cuatro puntos que cambiarían la idea, y **él decide** qué acepta. Lo que acepte y lo que
rechace quedan escritos, con el porqué, en `DECISIONES.md` cuando se cree (fase 6).

### Fase 4 — Visión del producto (lea `references/vision-producto.md`)

Antes de escribir, ronda 2 de la entrevista: las decisiones que la investigación y el Consejo abrieron (alcance del MVP,
camino técnico recomendado, modelo de cobro, nombre si falta, qué se deja para la versión 2), numeradas y con respuesta
recomendada. Con eso escriba `00. Planeacion\07-vision-producto\vision-producto.html`: un documento navegable con las
secciones de la referencia (problema, para quién, roles, pantallas, módulos, cómo se cobra, versiones, reglas fijas,
riesgos por verificar, por decidir). Es un borrador numerado; el usuario lo abre, dice qué cambia, y se repite hasta que
diga «aprobado» (lo normal son dos o tres borradores). Cada borrador se guarda; el aprobado es la fuente de verdad del
producto.

### Fase 5 — Hoja de ruta (lea `references/hoja-de-ruta.md`)

Parta de `assets/hoja-de-ruta-base.json` (las etapas en orden de construcción: fundación → pruebas de concepto →
diseño → base técnica → seguridad → base visual → módulos → landing y alta → lanzamiento → versiones siguientes →
ventas → operación → código) y **adáptela a este proyecto, nunca la copie tal cual**: las pruebas de concepto salen de
los «riesgos por verificar» de la visión; los módulos, de la sección de módulos; Ventas existe solo si hay quien venda;
las etapas de código desaparecen si el producto no lleva código. Cada etapa lleva su «por qué importa» escrito para
alguien que no sabe nada, su «entra cuando», su «terminada cuando» verificable y sus skills con URL del catálogo.
Escriba `00. Planeacion\07-vision-producto\hoja-de-ruta.json` **completo, subetapa por subetapa**: además de carpeta,
título y descripción, cada subetapa lleva `objetivo`, `terminada`, `vision`, `lee`, `skills`, `como` y `necesita` (el
esquema está en la referencia). Son los textos de las fichas: con ellos en el JSON, el script de la fase 6 escribe las
60 fichas solas; sin ellos, toca llenar 60 archivos a mano. Si son muchas subetapas, escríbalo etapa por etapa y guarde
el JSON al terminar cada una, para que un corte no borre lo hecho. **Reparta según el presupuesto:** con holgura, un
agente en serie por etapa (recibe la visión y la etapa base); con plan Pro o cerca del límite de uso, escríbalo usted
mismo o junte etapas en bloques, sin pasar de 10 agentes. Si aun así no alcanza, detalle primero las etapas 01, 02 y 07
y avise cuáles quedaron cortas: nunca las deje incompletas sin decirlo. Genere el HTML con
`node "<ruta-de-esta-skill>/assets/guardar/scripts/generar_hoja_de_ruta.mjs" --json "<ruta del JSON>"`, que además
revisa el orden. Tiene que decir **ORDEN: POSIBLE**. Después lea los «entra cuando» de corrido buscando lo que un script
no ve (la referencia da ejemplos) y pídale al usuario que apruebe la hoja igual que la visión.

### Fase 6 — Crear la estructura del proyecto (lea `references/estructura-proyecto.md`)

Con la hoja de ruta aprobada:

1. Escriba `proyecto.json` (nombre, descripción en una línea, personas y roles, idioma, si graba o enseña, carpeta de
   código si la hay) y corra:
   ```
   node "<ruta-de-esta-skill>/scripts/crear_estructura.mjs" --raiz "<carpeta del proyecto>" --proyecto proyecto.json
   ```
   El script crea todas las carpetas de la hoja de ruta, un `ESTADO.md` y un `LEEME.md` por etapa y un `LEEME.md` por
   subetapa (las fichas, llenas con los campos del JSON), el `ESTADO.md`, `DECISIONES.md`, `CHANGELOG.md`,
   `README.md`, `.gitignore` y `.gitattributes` de la raíz, el `CLAUDE.md` desde la plantilla, `99. Archivo\LEEME.md`, y
   copia la skill `/guardar` con sus scripts a `.claude\skills\guardar\`. No pisa nada que ya exista. En
   `proyecto.json`, `personas[].nombre` va como se quiere leer en una frase («la Ingeniera», «el Profe», «Juanjo»),
   `graba` es `"graba"`, `"ensena"` o `"no"`, y `repo` se deja fuera hasta que exista en GitHub (el script escribe «por
   crear con el OK de …»).
2. Llene lo que el script dejó marcado con `<<…>>`, que con el JSON completo es lo que exige criterio: el `CLAUDE.md`
   (qué es el proyecto, decisiones fijas, seguridad, mapa), el `ESTADO.md` raíz (dónde estamos, siguiente paso exacto:
   la primera subetapa de la etapa 01) y `DECISIONES.md` (todas las decisiones de la planeación, numeradas, con fecha y
   porqué, incluidas las del Consejo que se aceptaron o rechazaron). Si quedan marcas en las fichas, complete los campos
   en el JSON, borre esas fichas y vuelva a correr el script: es más barato que editar 60 archivos.
3. Mueva los archivos de la planeación (entrevista, investigación, acta, visión, hoja de ruta, catálogo) a sus carpetas
   de `00. Planeacion\` si no estaban ya ahí, y marque esa etapa como terminada (es referencia).
4. Verifique en este orden, porque el primero escribe lo que el segundo exige, y corrija lo que avisen:
   `node .claude/skills/guardar/scripts/anotar_skills.mjs` (marca cada skill como instalada o por instalar; agregue
   `--sin-local` si quien corre esto no es quien va a usar el proyecto, para no contar las skills de esta computadora);
   `node .claude/skills/guardar/scripts/verificar_fichas.mjs` → **FICHAS: LIMPIAS** (fichas, marcas en la raíz, la
   visión y la hoja, y orden de las etapas);
   `node .claude/skills/guardar/scripts/cambios_sesion.mjs --verificar` → **VERIFICACIÓN LIMPIA**.

### Fase 7 — Git y GitHub

Explique en dos líneas qué es un repositorio y por qué todo el proyecto va a vivir ahí (historial completo, nada se
pierde si falla el disco, cualquiera que entre después ve cómo se hizo todo). Luego, **con el OK del usuario**:
`git init -b develop` en la raíz (rama `develop` = trabajo diario; `main` = producción, nace en el primer paso a
producción), repositorio **privado** con `gh repo create <nombre> --private --source . --remote origin`, y el primer
`/guardar` (que hace `git add -A`, corre `revisar_secretos.mjs`, commit impersonal y `push -u origin develop`).

- Si `preparar.mjs` avisó que Git no tiene nombre y correo y el usuario no está para darlos, fíjelos solo en este
  repositorio (`git config user.name` / `user.email`, sin `--global`) con el nombre del proyecto y un correo de
  relleno, y anótelo en «Bloqueos y avisos» para que el usuario los cambie.
- Si avisó que la carpeta está dentro de otro repositorio git, no haga `git init` sin decírselo al usuario: un
  repositorio anidado confunde al de afuera. Lo normal es que el proyecto viva en su propia carpeta.
- Si no hay `gh`, no hay OK para GitHub o el usuario prefiere hacerlo después: deje el repositorio local con su commit
  (`/guardar sin subir`) y anótelo en «Bloqueos y avisos» del `ESTADO.md`; `cambios_sesion.mjs --inicio` lo va a
  recordar en cada chat hasta que exista el remoto.

### Fase 8 — Cierre y entrega

Corra `/guardar` (la skill ya instalada en el proyecto; «sin subir» si no hay repositorio en GitHub todavía) para que
el `ESTADO.md` quede con la fecha de hoy y el siguiente paso exacto, y cierre con un mensaje de entrega para el usuario,
sin jerga:

- Qué quedó en la carpeta (en 5 líneas: visión, hoja de ruta, investigación, decisiones, fichas) y el enlace del
  repositorio.
- **Cómo se sigue:** abrir Claude Code en la carpeta del proyecto, abrir un chat nuevo y escribir «¿con qué seguimos?».
  Claude lee el estado, nombra el chat y arranca la primera subetapa con su guion. Al terminar cada sesión: «guardar».
- Los pendientes que son suyos (cuentas que abrir, decisiones que tomar), con el archivo donde están anotados.

## Qué NO hace esta skill

- No construye la app: deja el plan y la carpeta listos para que cada subetapa se construya en su propio chat.
- No decide por el usuario: recomienda, y escribe lo que él decidió.
- No instala herramientas ni crea cuentas sin su OK; no toca repositorios existentes.
- No da asesoría legal ni financiera: lo legal se investiga con fuentes y se marca para revisión de un profesional del
  país antes de lanzar.

## Mapa de esta skill

- `references/entrevista.md` — las preguntas de las dos rondas, con sus respuestas recomendadas y qué hacer con cada una.
- `references/investigacion.md` — las 10 lentes, el prompt de cada agente, el formato del reporte, la verificación adversarial y la conciliación.
- `references/consejo.md` — los cinco asesores, la revisión anónima y el Presidente.
- `references/vision-producto.md` — las secciones de la visión y cómo se itera con el usuario.
- `references/hoja-de-ruta.md` — cómo adaptar la base de etapas y el esquema del JSON.
- `references/estructura-proyecto.md` — la carpeta del proyecto archivo por archivo y qué va en cada uno.
- `references/reglas-de-escritura.md` — las reglas de redacción de los registros (las mismas que aplica `/guardar`).
- `assets/hoja-de-ruta-base.json` — la plantilla de etapas (se adapta, no se copia).
- `assets/plantillas/` — `CLAUDE.md`, `ESTADO.md`, `DECISIONES.md`, `CHANGELOG.md`, `README.md`, `.gitignore`,
  `.gitattributes`, `99-Archivo-LEEME.md` y `vision-producto.html` (el esqueleto de la visión con sus 15 secciones).
- `assets/guardar/` — la skill `/guardar` que se instala en cada proyecto, con sus seis scripts en Node
  (`generar_hoja_de_ruta.mjs` también crea el HTML de la hoja de ruta la primera vez).
- `scripts/preparar.mjs` — revisa Git, `gh`, Node y la carpeta. `scripts/crear_estructura.mjs` — crea la carpeta del
  proyecto desde `hoja-de-ruta.json` y `proyecto.json`.
