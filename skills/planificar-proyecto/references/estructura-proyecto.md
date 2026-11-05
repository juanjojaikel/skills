# La carpeta del proyecto, archivo por archivo

La carpeta es la memoria del proyecto. Está hecha para que un chat nuevo de Claude Code, sin ningún contexto, arranque
leyendo `CLAUDE.md` (que importa `ESTADO.md`) y sepa exactamente qué sigue; y para que cualquier persona que entre
después (un socio nuevo, alguien que compre el proyecto) entienda cómo se hizo todo y por qué. Es también la raíz del
repositorio de GitHub.

```
<Nombre del proyecto>\
├── CLAUDE.md                 solo lo estable: qué es, roles, protocolo de chat, ciclos, decisiones fijas, seguridad, GitHub, mapa
├── ESTADO.md                 la foto de hoy: dónde vamos, siguiente paso exacto, pendientes por persona, tablero, bitácora (10)
├── DECISIONES.md             todas las decisiones, numeradas, con fecha y porqué; solo se agrega; lo superado se marca ⚠️
├── CHANGELOG.md              una entrada por cada paso a producción (versión, fecha, qué entró, por qué, qué se verificó)
├── README.md                 presentación del repositorio: qué es, por dónde empezar, cómo está organizado
├── proyecto.json             nombre, descripción, personas, idioma, carpeta de código (lo leen los scripts)
├── .gitignore · .gitattributes
├── .claude\skills\guardar\   la skill /guardar con sus seis scripts en Node
├── 00. Planeacion\           referencia (terminada al crear la estructura)
│   ├── ESTADO.md · LEEME.md
│   ├── 01-entrevista\              entrevista.md
│   ├── 02-investigacion\           un .md por lente + _verificaciones.md
│   ├── 03-arquitectura\            opciones-tecnicas.md (y lo que la etapa 04 reutilice)
│   ├── 04-consejo\                 acta-consejo-<fecha>.md
│   ├── 05-nombre-y-marca\          opciones-de-nombre.md (si se corrió la lente 10)
│   ├── 06-herramientas-claude-code\ catalogo-skills-urls.md y .json
│   └── 07-vision-producto\         vision-producto.html, hoja-de-ruta.json, hoja-de-ruta.html
├── 01. Fundacion\ … NN. …\   una carpeta por etapa de la hoja de ruta
│   ├── ESTADO.md             estado de la etapa: tabla de subetapas, a medias, siguiente paso, pendientes, bitácora
│   ├── LEEME.md              ficha de la etapa: objetivo, por qué, subetapas, cómo, skills, qué lee Claude
│   └── NN-subetapa\LEEME.md  ficha de la subetapa (ver abajo); el resto de archivos de la subetapa van aquí
└── 99. Archivo\LEEME.md      lo superado, con la razón
```

## Qué va en cada archivo (y qué no)

| Archivo | Lleva | No lleva |
|---|---|---|
| `CLAUDE.md` | Lo que no cambia por sesión: qué es el proyecto en 5 líneas, dónde está la fuente de verdad, personas y roles, el protocolo de cada chat, los ciclos, las decisiones fijas numeradas, seguridad, GitHub, convenciones de escritura, mapa de carpetas. Y la línea `@ESTADO.md` que carga el estado. | Nada que cambie por sesión: ni «última sesión», ni «próximos pasos», ni pendientes. Eso vive en `ESTADO.md`. |
| `ESTADO.md` | «Último guardado» (UNA línea) · Dónde estamos (3 líneas) · ▶️ Siguiente paso exacto (etapa/subetapa, qué lee Claude, nombre del chat) · Etapas activas · A medias · Pendientes por persona · Preguntas abiertas · Bloqueos y avisos · Tablero de etapas · Decisiones recientes (10) · Bitácora (10). | Historia larga (va a `99. Archivo\BITACORA.md`), detalle de etapas (va al `ESTADO.md` de cada una). |
| `<etapa>\ESTADO.md` | Lo mismo que el raíz pero de UNA etapa, por subetapa. | — |
| `<etapa>\LEEME.md` | Objetivo, por qué importa, entra cuando, terminada cuando, tabla de subetapas, cómo se trabaja, skills de la etapa con URL, qué lee Claude para arrancar. | Estado (eso es el ESTADO). |
| `<subetapa>\LEEME.md` | La ficha: objetivo, qué se entrega, terminada cuando, entra cuando, qué lee Claude para arrancar, skills con URL (`nombre — https://…`), cómo se trabaja, qué necesita del responsable, archivos de esta carpeta (una línea cada uno). | — |
| `DECISIONES.md` | `N. **fecha — decisión.** Por qué. Dónde aplica.` Se agrega al final. Si una se cae: ⚠️ en la vieja y cuál la reemplaza. | Borrados. |
| `CHANGELOG.md` | Versiones en producción. Hasta la primera: «Sin versiones» y los hitos del repositorio. | Trabajo diario. |

La regla de oro es **no duplicar**: el detalle vive en el ESTADO y el LEEME de la etapa; el ESTADO raíz resume y enlaza;
el `CLAUDE.md` no repite nada del estado.

## El `CLAUDE.md` del proyecto

`assets/plantillas/CLAUDE.md` trae la estructura con marcas `<<…>>` que se llenan con la entrevista, la visión y la hoja
de ruta. Las secciones:

1. **Qué es este proyecto** — 5 líneas: producto, para quién, país, personas, dónde está la fuente de verdad
   (`00. Planeacion\07-vision-producto\vision-producto.html` y `hoja-de-ruta.json`).
2. **Personas y roles** — quién construye, quién vende, quién opera, quién valida qué; la regla «<usuario> valida;
   Claude hace el trabajo; se le pide solo lo que exige su criterio, firma, contraseña o tarjeta».
3. **Protocolo de cada chat (OBLIGATORIO)** — un chat por subetapa; al abrir: correr `cambios_sesion.mjs --inicio`,
   leer `ESTADO.md` → ESTADO de la etapa → LEEME de la subetapa, nombrar el chat `<Proyecto> · NN Etapa · NN-subetapa`,
   primera respuesta = guion de arranque; al cerrar: `/guardar`; «sigamos» = el siguiente paso exacto; sin fechas ni
   atrasos; modelos y presupuesto.
4. **Ciclo de trabajo** — los dos ciclos del JSON.
5. **Decisiones fijas** — las reglas de la visión §11, numeradas.
6. **Seguridad** — secretos (gestor, nunca el valor), datos de personas, dependencias, los dos momentos de seguridad por
   módulo.
7. **GitHub** — repo, ramas `develop`/`main`, cómo se pasa a producción, mensaje de commit impersonal sin
   `Co-Authored-By`, nada se borra.
8. **Convenciones de escritura** — las de `reglas-de-escritura.md`, resumidas.
9. **Mapa de carpetas** — una línea por carpeta.

Tiene que caber en unas 150-200 líneas: se carga en cada chat.

## `crear_estructura.mjs`

```
node "<ruta-de-esta-skill>/scripts/crear_estructura.mjs" --raiz "<carpeta>" --proyecto proyecto.json [--hoja <ruta>]
```

- Lee `proyecto.json` (nombre, descripción, personas, idioma, graba, carpeta_codigo, repo) y `hoja-de-ruta.json`
  (por defecto `<raiz>/00. Planeacion/07-vision-producto/hoja-de-ruta.json`).
- Crea las carpetas de cada etapa y subetapa, `99. Archivo\`, y las fichas: `ESTADO.md` y `LEEME.md` por etapa
  (con la tabla de subetapas, el porqué, el cómo, las skills y «terminada cuando» desde el JSON) y `LEEME.md` por
  subetapa con las nueve secciones, llenas con los campos del JSON (`objetivo`, `descripcion`, `terminada`, `entra`,
  `vision`, `lee`, `skills`, `como`, `necesita`); lo que falte en el JSON queda como marca `<<…>>`.
- Si no existe todavía `00. Planeacion/07-vision-producto/vision-producto.html`, lo crea desde la plantilla (con el
  nombre, el borrador 1 y la fecha puestos) para que la visión se escriba ahí.
- Escribe los archivos de la raíz desde `assets/plantillas/` reemplazando `{{PROYECTO}}`, `{{DESCRIPCION}}`,
  `{{FECHA}}`, `{{PERSONAS}}`, `{{TABLERO}}`, `{{MAPA}}` y dejando `<<…>>` donde hace falta criterio.
- Copia `assets/guardar/` a `.claude/skills/guardar/`.
- **No pisa nada que exista**: si un archivo ya está, lo deja y lo reporta.
- Al final imprime qué creó y la lista de marcas `<<…>>` que quedan por llenar.

Después de correrlo, Claude llena las marcas que queden y corre los tres verificadores hasta que salgan limpios. Si
quedan muchas marcas en las fichas, lo barato es completar los campos en `hoja-de-ruta.json`, borrar las fichas que
se quieran regenerar y volver a correr el script (no pisa lo que existe), no editar 60 archivos uno por uno.

Al escribir «Qué lee Claude para arrancar» recuerde la regla 8: lo que ya existe va entre acentos graves (el verificador
comprueba que exista) y lo que todavía no existe, como un entregable de una subetapa anterior, entre «comillas
angulares». Un `verificador` que avisa «ruta que no existe» en esa sección casi siempre es eso.

## El catálogo de skills

`00. Planeacion\06-herramientas-claude-code\catalogo-skills-urls.json` es una lista de `{nombre, url, tipo, etapas,
origen, comprobada}`. Valores de `tipo`: `instalada` (ya está en `~/.claude/skills` o como plugin activo) · `por-instalar`
· `plugin` (se instala como plugin de Claude Code; cuenta como por instalar hasta que se active) · `sub-skill` (una skill
dentro de un repositorio con varias) · `repositorio` (la raíz de un repositorio de skills) · `integrada` (viene con
Claude Code, URL de `code.claude.com`) · `mcp` (un servidor MCP). `anotar_skills.mjs` marca «instalada» solo con
`instalada`, `integrada` y `mcp` (o `instalada: true`), y mira además `~/.claude/skills` de la computadora donde corre;
si quien corre el script no es quien va a usar el proyecto, se corre con `--sin-local`.

## Proyecto sin código

Si no hay carpeta de código, `proyecto.json` no lleva `carpeta_codigo`, el `CLAUDE.md` no lleva la sección de código
dentro de «Ciclo de trabajo» (solo el ciclo sin código) y `cambios_sesion.mjs` mira todo por fecha de archivo.
