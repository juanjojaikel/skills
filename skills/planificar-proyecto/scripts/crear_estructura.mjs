// Crea la carpeta del proyecto a partir de hoja-de-ruta.json y proyecto.json. No pisa nada que ya exista.
//
// Uso:
//   node "<ruta-de-esta-skill>/scripts/crear_estructura.mjs" --raiz "<carpeta del proyecto>" --proyecto proyecto.json [--hoja <ruta>]
//
// Crea: las carpetas de cada etapa y subetapa, 99. Archivo, ESTADO.md y LEEME.md por etapa, LEEME.md por subetapa
// (esqueletos con todas las secciones), los archivos de la raíz desde assets/plantillas (CLAUDE.md, ESTADO.md,
// DECISIONES.md, CHANGELOG.md, README.md, .gitignore, .gitattributes), proyecto.json en la raíz, el catálogo inicial de
// skills (desde las skills de la hoja de ruta) y la skill /guardar en .claude/skills/guardar/. Al final lista lo creado
// y las marcas <<…>> que quedan por llenar.
//
// Las fichas se llenan desde hoja-de-ruta.json: cada subetapa puede traer, además de carpeta/titulo/descripcion/entra,
// los campos objetivo, terminada, vision (secciones de la visión que usa), lee (lista de archivos que Claude lee),
// skills (lista {nombre, url}; si falta, hereda las de la etapa), como (lista de pasos) y necesita (lista). Cada etapa
// puede traer vision (secciones). Lo que falte queda como marca <<…>> para que Claude lo complete.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

if (process.stdout.setEncoding) process.stdout.setEncoding("utf8");

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const SKILL = path.resolve(AQUI, "..");
const PLANTILLAS = path.join(SKILL, "assets", "plantillas");
const GUARDAR = path.join(SKILL, "assets", "guardar");
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const hoy = new Date();
const FECHA = `${hoy.getDate()}-${MESES[hoy.getMonth()]}-${hoy.getFullYear()}`;

function argumento(nombre) {
  const i = process.argv.indexOf(`--${nombre}`);
  return i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : null;
}
function leerJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8").replace(/^﻿/, ""));
}

const raiz = path.resolve(argumento("raiz") || process.cwd());
const rutaProyecto = argumento("proyecto") ? path.resolve(argumento("proyecto")) : path.join(raiz, "proyecto.json");
const rutaHoja = argumento("hoja") ? path.resolve(argumento("hoja")) : path.join(raiz, "00. Planeacion", "07-vision-producto", "hoja-de-ruta.json");

if (!fs.existsSync(rutaProyecto)) { console.log(`Falta ${rutaProyecto}: escriba proyecto.json (nombre, descripcion, personas, idioma, graba, carpeta_codigo).`); process.exit(2); }
if (!fs.existsSync(rutaHoja)) { console.log(`Falta ${rutaHoja}: primero la hoja de ruta (fase 5).`); process.exit(2); }
const proy = leerJson(rutaProyecto);
const hoja = leerJson(rutaHoja);
if (!proy.nombre) { console.log("proyecto.json necesita al menos «nombre»."); process.exit(2); }
if (!Array.isArray(hoja.etapas) || !hoja.etapas.length) { console.log("hoja-de-ruta.json necesita «etapas»."); process.exit(2); }

const creados = [], saltados = [], marcas = new Map();

function escribir(p, texto) {
  if (fs.existsSync(p)) { saltados.push(rel(p)); return; }
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const t = texto.replace(/\r\n/g, "\n");
  fs.writeFileSync(p, t, "utf8");
  creados.push(rel(p));
  const n = rel(p).startsWith(".claude/") ? 0 : (t.match(/<<[^>]{1,120}>>/g) || []).length;
  if (n) marcas.set(rel(p), n);
}
function carpeta(p) {
  if (!fs.existsSync(p)) { fs.mkdirSync(p, { recursive: true }); creados.push(rel(p) + "/"); }
}
function rel(p) {
  return path.relative(raiz, p).split(path.sep).join("/");
}
function plantilla(nombre, valores) {
  let t = fs.readFileSync(path.join(PLANTILLAS, nombre), "utf8");
  for (const [k, v] of Object.entries(valores)) t = t.split(`{{${k}}}`).join(v);
  return t;
}
function copiarCarpeta(desde, hasta) {
  for (const e of fs.readdirSync(desde, { withFileTypes: true })) {
    const a = path.join(desde, e.name), b = path.join(hasta, e.name);
    if (e.isDirectory()) copiarCarpeta(a, b);
    else escribir(b, fs.readFileSync(a, "utf8"));
  }
}

// ---- valores comunes ----
const personas = (proy.personas || []).map((p) => (typeof p === "string" ? { nombre: p, rol: "" } : p));
// «La dueña» → «la dueña» cuando el nombre empieza con artículo (va en medio de una frase); los nombres propios no cambian.
const enFrase = (n) => n.replace(/^(La|El|Los|Las|O|A|Os|As|The)\s/, (m) => m.toLowerCase());
const nombres = personas.map((p) => enFrase(p.nombre));
const usuario = nombres.length === 0 ? "la persona dueña del proyecto" : nombres.length === 1 ? nombres[0] : nombres.slice(0, -1).join(", ") + " y " + nombres[nombres.length - 1];
const valida = nombres.length > 1 ? "validan" : "valida";
const personasTabla = personas.length
  ? personas.map((p) => `| ${p.nombre} | ${p.rol || "<<rol>>"} | ${p.hace || "<<qué hace>>"} | ${p.valida || "<<qué valida>>"} |`).join("\n")
  : "| <<nombre>> | <<rol>> | <<qué hace>> | <<qué valida>> |";
const personasLista = personas.length ? personas.map((p) => `${p.nombre} (${p.rol || "rol por definir"})`).join(" · ") : "<<personas y roles>>";
const codigo = proy.carpeta_codigo || hoja.carpeta_codigo || "";
const primera = hoja.etapas.find((e) => e.n !== "00" && (e.subetapas || []).length) || hoja.etapas[0];
const primeraSub = primera && primera.subetapas && primera.subetapas[0] ? primera.subetapas[0] : null;
const nombreChat = primeraSub ? `${proy.nombre} · ${primera.n} ${primera.titulo} · ${primeraSub.carpeta}` : `${proy.nombre} · …`;
const tablero = hoja.etapas.map((e) => {
  const estado = e.n === "00" ? "🟢 terminada (referencia)" : e === primera ? "🟡 **activa: lo siguiente**" : "⚪";
  const donde = e.n === "00" ? "Visión y hoja de ruta en `00. Planeacion/07-vision-producto/`" : e === primera && primeraSub ? primeraSub.carpeta : (e.entra || "—");
  return `| ${e.carpeta} | ${estado} | ${donde} | [ESTADO](${encodeURI(e.carpeta)}/ESTADO.md) |`;
}).join("\n");
const mapa = hoja.etapas.map((e) => `- \`${e.carpeta}\` — ${e.objetivo || e.titulo}`).join("\n") + "\n- `99. Archivo` — lo superado, con un LEEME que dice por qué.";
const lista = (arr, vacio) => (arr && arr.length ? arr.map((x, i) => `${i + 1}. ${x}`).join("\n") : vacio);
const pendientesPersonas = personas.length
  ? personas.map((p) => `**De ${enFrase(p.nombre)}:**\n- [ ] <<pendiente>>`).join("\n")
  : "**De la persona dueña del proyecto:**\n- [ ] <<pendiente>>";

const valores = {
  PROYECTO: proy.nombre,
  DESCRIPCION: proy.descripcion || "<<qué es el producto, para quién y dónde, en una línea>>",
  FECHA,
  PERSONAS_TABLA: personasTabla,
  PERSONAS_LISTA: personasLista,
  USUARIO: usuario,
  VALIDA: valida,
  PENDIENTES_PERSONAS: pendientesPersonas,
  TABLERO: tablero,
  MAPA: mapa,
  NOMBRE_CHAT: nombreChat,
  PRIMERA_ETAPA: primera ? primera.carpeta : "<<etapa>>",
  PRIMERA_SUBETAPA: primeraSub ? primeraSub.carpeta : "<<subetapa>>",
  CICLO_MODULO: lista(hoja.ciclo_modulo, "(este proyecto no lleva código)"),
  CICLO_NO_CODIGO: lista(hoja.ciclo_no_codigo, "1. Plan corto y OK · 2. Ejecutar · 3. Verificar · 4. /guardar"),
  GUION: lista(hoja.guion_de_arranque, "<<guion de arranque>>"),
  CARPETA_CODIGO: codigo || "(sin código)",
  LINEA_CODIGO: codigo ? `- **Código:** vive en \`${codigo}\` dentro del mismo repositorio; su propio \`CLAUDE.md\` manda adentro.` : "- Este proyecto no lleva código: aplica solo el ciclo sin código.",
  REPO: proy.repo ? "`" + proy.repo + "`" : `por crear en GitHub con el OK de ${usuario} (hasta entonces el repositorio es solo local y se anota en «Bloqueos y avisos» del ESTADO.md)`,
  IDIOMA: proy.idioma || "español",
  GRABA: (() => {
    const g = String(proy.graba === true ? "graba" : proy.graba || "no").toLowerCase();
    if (/graba|c[aá]mara|record/.test(g)) return "Se graba: el guion de arranque se escribe para leerse en cámara, para alguien que no sabe nada de IA ni de apps.";
    if (/ense|teach|socio|partner/.test(g)) return "Se enseña a otra persona: el guion de arranque se escribe para que alguien que no sabe nada de IA ni de apps lo lea y lo siga.";
    return "No: el guion de arranque igual de claro, pero más corto.";
  })(),
  VERSION_HOJA: hoja.version || FECHA,
};

// ---- raíz ----
for (const [archivo, destino] of [["CLAUDE.md", "CLAUDE.md"], ["ESTADO.md", "ESTADO.md"], ["DECISIONES.md", "DECISIONES.md"],
  ["CHANGELOG.md", "CHANGELOG.md"], ["README.md", "README.md"], ["gitignore", ".gitignore"], ["gitattributes", ".gitattributes"],
  ["99-Archivo-LEEME.md", path.join("99. Archivo", "LEEME.md")]]) {
  escribir(path.join(raiz, destino), plantilla(archivo, valores));
}
escribir(path.join(raiz, "proyecto.json"), JSON.stringify({ ...proy, carpeta_codigo: codigo || undefined }, null, 2) + "\n");
carpeta(path.join(raiz, "99. Archivo"));

// ---- etapas y subetapas ----
for (const e of hoja.etapas) {
  const ed = path.join(raiz, e.carpeta);
  carpeta(ed);
  const subs = e.subetapas || [];
  const skills = (e.skills || []).length ? e.skills.map((s) => `- ${s.nombre} — ${s.url}`).join("\n") : "- Ninguna asignada en `00. Planeacion/07-vision-producto/hoja-de-ruta.json`. <<agregar las del catálogo que sirvan>>";
  const como = (e.como || []).length ? e.como.map((c) => `- ${c}`).join("\n") : "- <<cómo se trabaja en esta etapa>>";
  const esPlaneacion = e.n === "00";
  const estadoEtapa = esPlaneacion ? "🟢 terminada (referencia)" : e === primera ? "🟡 activa" : "⚪ sin empezar";
  const tablaSub = subs.length
    ? subs.map((s) => `| ${s.carpeta} | ${esPlaneacion ? "🟢" : "⚪"} | ${esPlaneacion ? "<<qué hay>>" : "Nada todavía"} | ${esPlaneacion ? "— (se consulta)" : "<<siguiente>>"} |`).join("\n")
    : "| (sin subetapas) | — | — | — |";
  const fichaSub = subs.length
    ? subs.map((s) => `| \`${s.carpeta}/\` | ${s.titulo} | ${s.descripcion} | ${s.entra || "<<entra cuando>>"} |`).join("\n")
    : "| (sin subetapas) | — | — | — |";

  escribir(path.join(ed, "ESTADO.md"), `# ESTADO — ${e.carpeta}

**Estado:** ${estadoEtapa} · **Último guardado:** ${FECHA} — creada con la hoja de ruta (versión ${valores.VERSION_HOJA})
**Entra cuando:** ${e.entra || "<<qué tiene que existir antes>>"} · **Terminada cuando:** ${e.terminada || "<<resultado verificable>>"}

> Rutas relativas a la raíz del proyecto. El detalle de cada subetapa está en su \`LEEME.md\`.

## Subetapas
| Subetapa | Estado | Qué hay | Siguiente |
|---|---|---|---|
${tablaSub}

## A medias
- Nada a medias.

## ▶️ Siguiente paso
${esPlaneacion ? "Ninguno: la etapa es referencia y se consulta. El siguiente paso del proyecto está en el `ESTADO.md` raíz." : e === primera && primeraSub ? `**${primeraSub.carpeta}.** Se lee \`${e.carpeta}/${primeraSub.carpeta}/LEEME.md\`. Nombre del chat: \`${nombreChat}\`.` : `Entra cuando: ${(e.entra || "<<…>>").replace(/\.\s*$/, "")}.`}

## Pendientes (con dueño)
- Ninguno todavía.

## Bitácora (máx. 10)
### ${FECHA} — Creada con la hoja de ruta
- Se creó este ESTADO y las fichas (\`LEEME.md\`) de la etapa y de sus ${subs.length} subetapa(s) a partir de \`00. Planeacion/07-vision-producto/hoja-de-ruta.json\` (versión ${valores.VERSION_HOJA}).
`);

  escribir(path.join(ed, "LEEME.md"), `# ${e.carpeta} — ${e.titulo}

**Objetivo:** ${e.objetivo || "<<una frase>>"}
**Por qué importa:** ${e.por_que || "<<para alguien que no sabe nada: qué se construye, qué pasa si se salta, qué se tiene al terminar>>"}
**Entra cuando:** ${e.entra || "<<qué tiene que existir antes>>"}
**Terminada cuando:** ${e.terminada || "<<resultado verificable>>"}
**Estado:** ver \`${e.carpeta}/ESTADO.md\`.

> Rutas relativas a la raíz del proyecto. Fuente de esta ficha: \`00. Planeacion/07-vision-producto/hoja-de-ruta.json\` (etapa ${e.n}, versión ${valores.VERSION_HOJA}).

## Subetapas
| Carpeta | Título | Qué se entrega | Entra cuando |
|---|---|---|---|
${fichaSub}

## Cómo se trabaja
${como}
- Un chat por subetapa; el chat se nombra \`${proy.nombre} · ${e.n} ${e.titulo} · <subetapa>\`.

## Skills de la etapa
${skills}

Cada subetapa lista en su ficha el subconjunto que usa, más las del catálogo que le sirven (\`00. Planeacion/06-herramientas-claude-code/catalogo-skills-urls.md\`).

## Qué lee Claude para arrancar la etapa
- \`ESTADO.md\` (raíz; se carga solo) y \`${e.carpeta}/ESTADO.md\`.
- \`00. Planeacion/07-vision-producto/hoja-de-ruta.json\` — entrada «${e.carpeta}» y los ciclos.
- \`00. Planeacion/07-vision-producto/vision-producto.html\` — ${e.vision || "<<las secciones que esta etapa usa>>"}.
- El \`LEEME.md\` de la subetapa que toque.
`);

  for (const s of subs) {
    const sd = path.join(ed, s.carpeta);
    carpeta(sd);
    const presentes = fs.readdirSync(sd).filter((n) => n !== "LEEME.md" && !n.startsWith(".")).sort();
    const archivosLineas = ["- `LEEME.md` — esta ficha.", ...presentes.map((n) => "- `" + n + "` — <<qué es, para qué sirve>>")].join("\n");
    const lista2 = (v) => (Array.isArray(v) ? v : v ? [v] : []);
    const skillsSub = Array.isArray(s.skills) ? s.skills : (e.skills || []);
    const skillsLineas = skillsSub.length
      ? skillsSub.map((k) => `- ${k.nombre} — ${k.url}`).join("\n")
      : Array.isArray(s.skills) ? "- Ninguna específica: se usan las de la etapa (ver `" + e.carpeta + "/LEEME.md`)." : "- <<las del catálogo que sirven aquí, con URL exacta>>";
    const leeLineas = [
      "- `" + e.carpeta + "/ESTADO.md` y este archivo.",
      "- `00. Planeacion/07-vision-producto/vision-producto.html` — " + (s.vision || e.vision || "<<secciones que aplican>>") + ".",
      ...lista2(s.lee).map((x) => "- " + x),
    ];
    if (!lista2(s.lee).length) leeLineas.push("- <<archivos de 00. Planeacion o de etapas anteriores que esta subetapa necesita; los que todavía no existen van entre «comillas angulares», no entre acentos graves>>");
    const comoSub = esPlaneacion
      ? "Terminada; se consulta. Si hace falta ampliarla: 1) plan corto y OK · 2) ejecutar · 3) verificar · 4) /guardar."
      : lista2(s.como).length ? lista2(s.como).map((x, i) => `${i + 1}. ${x}`).join("\n") : "<<los pasos del ciclo que aplican (módulo con código o sin código), con lo concreto de esta subetapa>>";
    const necesitaSub = lista2(s.necesita).length ? lista2(s.necesita).map((x) => "- " + x).join("\n") : "- <<validación, firma, pago o credencial que solo esa persona puede dar; o «Nada pendiente»>>";
    escribir(path.join(sd, "LEEME.md"), `# ${e.carpeta} / ${s.carpeta} — ${s.titulo}

**Objetivo:** ${s.objetivo || "<<una frase: qué queda resuelto al terminar>>"}
**Qué se entrega:** ${s.descripcion || "<<qué se entrega>>"}
**Terminada cuando:** ${s.terminada || "<<criterio verificable: qué archivo, pantalla o prueba existe>>"}
**Entra cuando:** ${s.entra || "<<qué tiene que existir antes>>"}

> Rutas relativas a la raíz del proyecto.

## Qué lee Claude para arrancar
${leeLineas.join("\n")}

## Skills (con enlace)
${skillsLineas}

## Cómo se trabaja
${comoSub}

## Qué necesita del responsable
${necesitaSub}

## Archivos de esta carpeta
${archivosLineas}
`);
  }
}

// ---- visión: si todavía no existe, el esqueleto desde la plantilla con sus marcas ----
const rutaVision = path.join(raiz, "00. Planeacion", "07-vision-producto", "vision-producto.html");
if (!fs.existsSync(rutaVision)) escribir(rutaVision, plantilla("vision-producto.html", { ...valores, BORRADOR: "1" }));

// ---- catálogo inicial de skills (desde la hoja de ruta) ----
const dirCat = path.join(raiz, "00. Planeacion", "06-herramientas-claude-code");
const catJson = path.join(dirCat, "catalogo-skills-urls.json");
if (!fs.existsSync(catJson)) {
  const vistos = new Map();
  for (const e of hoja.etapas) for (const s of e.skills || []) {
    if (!s.url) continue;
    const k = s.url.replace(/\/+$/, "");
    if (!vistos.has(k)) vistos.set(k, { nombre: s.nombre, url: k, tipo: "por-instalar", etapas: [], origen: `hoja-de-ruta.json ${valores.VERSION_HOJA}` });
    vistos.get(k).etapas.push(e.carpeta);
  }
  const cat = [...vistos.values()];
  escribir(catJson, JSON.stringify(cat, null, 2) + "\n");
  escribir(path.join(dirCat, "catalogo-skills-urls.md"), `# Catálogo de skills y herramientas → URL (${proy.nombre})

**Fecha:** ${FECHA}. Toda skill o repositorio que se cite en una ficha lleva aquí su URL exacta. Las nuevas se agregan con
\`node .claude/skills/guardar/scripts/verificar_urls_github.mjs --agregar <url>\` (comprueba en GitHub que existe).
Datos completos en \`catalogo-skills-urls.json\`.

**Total: ${cat.length} entradas.**

| Nombre | URL | Tipo | Etapas |
|---|---|---|---|
${cat.map((c) => `| ${c.nombre} | ${c.url} | ${c.tipo} | ${c.etapas.join(", ")} |`).join("\n")}
`);
}

// ---- la skill /guardar ----
const destinoGuardar = path.join(raiz, ".claude", "skills", "guardar");
const skillMd = fs.readFileSync(path.join(GUARDAR, "SKILL.md"), "utf8");
let skillLleno = skillMd;
for (const [k, v] of Object.entries(valores)) skillLleno = skillLleno.split(`{{${k}}}`).join(v);
escribir(path.join(destinoGuardar, "SKILL.md"), skillLleno);
copiarCarpeta(path.join(GUARDAR, "scripts"), path.join(destinoGuardar, "scripts"));

// ---- hoja-de-ruta.html: si no existe, se genera desde el JSON (CLAUDE.md y README.md lo citan) ----
const rutaHtml = path.join(path.dirname(rutaHoja), "hoja-de-ruta.html");
if (!fs.existsSync(rutaHtml)) {
  try {
    execFileSync(process.execPath, [path.join(destinoGuardar, "scripts", "generar_hoja_de_ruta.mjs"), "--json", rutaHoja, "--html", rutaHtml], { cwd: raiz, stdio: ["ignore", "pipe", "pipe"] });
    if (fs.existsSync(rutaHtml)) creados.push(rel(rutaHtml));
  } catch (e) { console.log("No se pudo generar hoja-de-ruta.html: " + String(e.stderr || e.message).trim().slice(0, 200)); }
}

// ---- ESTADO.md raíz con la fecha más nueva (cambios_sesion.mjs mide desde ahí) ----
try { const ahora = new Date(); fs.utimesSync(path.join(raiz, "ESTADO.md"), ahora, ahora); } catch { }

// ---- informe ----
console.log(`Proyecto: ${proy.nombre}\nRaíz: ${raiz}\n`);
console.log(`Creados (${creados.length}):`);
for (const c of creados) console.log(`  + ${c}`);
if (saltados.length) {
  console.log(`\nYa existían, no se tocaron (${saltados.length}):`);
  for (const s of saltados) console.log(`  = ${s}`);
}
const totalMarcas = [...marcas.values()].reduce((a, b) => a + b, 0);
console.log(`\nMarcas <<…>> por llenar: ${totalMarcas} en ${marcas.size} archivo(s)` + (marcas.size ? ":" : "."));
for (const [f, n] of [...marcas].sort((a, b) => b[1] - a[1])) console.log(`  ${n}\t${f}`);
if (totalMarcas) console.log("\nPara que queden menos marcas: complete en hoja-de-ruta.json los campos por subetapa (objetivo, terminada, vision, lee, skills, como, necesita) y por etapa (vision), borre las fichas que quiera regenerar y vuelva a correr este script (no pisa lo que existe).");
console.log(`\nSiguiente: llenar las marcas que queden (CLAUDE.md, ESTADO.md, DECISIONES.md y las fichas), luego
  node ".claude/skills/guardar/scripts/verificar_fichas.mjs"     → FICHAS: LIMPIAS
  node ".claude/skills/guardar/scripts/anotar_skills.mjs"
  node ".claude/skills/guardar/scripts/cambios_sesion.mjs" --verificar → VERIFICACIÓN LIMPIA`);
