// Verifica las fichas (ESTADO.md y LEEME.md) de cada etapa contra hoja-de-ruta.json y el catálogo de skills. Solo lee.
//
// Uso (desde cualquier carpeta):
//   node "<raiz>/.claude/skills/guardar/scripts/verificar_fichas.mjs"                      informe
//   node "<raiz>/.claude/skills/guardar/scripts/verificar_fichas.mjs" --json informe.json  además, informe en JSON
//   ... --etapa "07. Modulos MVP"                                                          solo una etapa
//
// Comprueba, por etapa: que existan ESTADO.md, LEEME.md y un LEEME.md por subetapa del JSON; que cada ficha de subetapa
// tenga sus secciones; que toda URL de github.com esté en hoja-de-ruta.json o en el catálogo (otras URLs: aviso); que
// las rutas entre acentos graves existan; que no queden marcas <<…>> por llenar; que no haya atribuciones narrativas
// («Claude hizo», «<persona> dijo»), caracteres de control, skills sin estado ni «Co-Authored».
// Además, sin --etapa: marcas <<…>> y {{…}} en los archivos de la raíz, en la visión y en la hoja de ruta, y que el orden
// de los «entra cuando» sea posible (nada cita lo que no existe, nadie se espera en círculo).
import fs from "node:fs";
import path from "node:path";
import { RAIZ, RUTA_HOJA, RUTA_CATALOGO_JSON, hojaDeRuta, leerJson, leerTexto, personas, rutasRotasEn, relativa, existe, args, salida, marcasEn, revisarOrden } from "./_comun.mjs";

salida();

// Cada sección acepta el encabezado en español, inglés o portugués (las fichas se escriben en el idioma del usuario).
const SECCIONES = [
  ["Objetivo", /^\**(?:objetivo|objective|goal)\**\s*[:：]|^#+\s*(?:objetivo|objective|goal)/im],
  ["Qué se entrega", /qu[eé] se entrega|deliverables|what (?:is|gets) delivered|o que (?:se )?entrega/i],
  ["Terminada cuando", /terminad[ao] cuando|done when|complete when|conclu[ií]d[ao] quando/i],
  ["Entra cuando", /entra cuando|starts when|begins when|entra quando/i],
  ["Qué lee Claude para arrancar", /qu[eé] lee claude|what claude reads|o que (?:o )?claude l[eê]/i],
  ["Skills", /^#+\s*skills/im],
  ["Cómo se trabaja", /c[oó]mo se trabaja|how (?:we|to) work|workflow|como se trabalha/i],
  ["Qué necesita del responsable", /qu[eé] necesita|needs from|what .* needs|o que precisa/i],
  ["Archivos de esta carpeta", /archivos de esta carpeta|files in this folder|arquivos desta pasta/i],
];
const SKILL_LINEA = /^\s*[-*]\s+[^\n]+?\s[—–-]\s+https?:\/\/\S+/;
const SKILL_ESTADO = /·\s*(instalada|por instalar|integrada|sin URL|installed|to install|built-in)/i;
const URL = /https?:\/\/[^\s<>()"'`\]]+/g;
const COAUTH = /co-authored/i;
// Lo que tiene que quedar sin marcas además de las fichas. `true` = el archivo tiene que existir.
const OTROS_ARCHIVOS = [["CLAUDE.md", true], ["ESTADO.md", true], ["DECISIONES.md", true], ["README.md", false], ["CHANGELOG.md", false],
  ["99. Archivo/LEEME.md", false], ["00. Planeacion/07-vision-producto/vision-producto.html", true], ["00. Planeacion/07-vision-producto/hoja-de-ruta.json", true]];

function atribuciones() {
  const nombres = personas().map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  // Para Claude se bloquea cualquier verbo de acción (los registros nunca dicen «Claude hizo»). Para las personas, solo
  // los verbos de habla y decisión en pasado («dijo», «pidió», «decidió»): «la dueña quiere» o «la dueña valida» son
  // frases normales de una ficha, no una atribución narrativa.
  const verbosClaude = "(?:hizo|escribi[oó]|propuso|cre[oó]|decidi[oó]|sugiri[oó]|pens[oó]|redact[oó]|dijo|pidi[oó]|mencion[oó]|confirm[oó]|said|decided|asked|wrote|disse|decidiu|pediu)";
  const verbosPersona = "(?:dijo|pidi[oó]|decidi[oó]|mencion[oó]|confirm[oó]|propuso|sugiri[oó]|said|decided|asked|disse|decidiu|pediu)";
  const partes = [`\\bclaude ${verbosClaude}\\b`];
  if (nombres.length) partes.push(`\\b(?:${nombres.join("|")}) ${verbosPersona}\\b`, `\\bseg[uú]n (?:${nombres.join("|")})\\b`);
  return new RegExp(partes.join("|"), "i");
}

function urlsPermitidas(hr) {
  const out = new Set();
  for (const e of hr.etapas) {
    for (const s of [...(e.skills || []), ...(e.subetapas || []).flatMap((x) => (Array.isArray(x.skills) ? x.skills : []))]) {
      if (s.url) out.add(s.url.replace(/\/+$/, "").toLowerCase());
    }
  }
  const cat = leerJson(RUTA_CATALOGO_JSON, []);
  for (const ent of cat || []) {
    const u = ent && typeof ent === "object" ? ent.url : null;
    if (u && u.startsWith("http")) out.add(u.replace(/\/+$/, "").toLowerCase());
  }
  return out;
}

function revisarArchivo(p, permitidas, esSubetapa, rxAtrib) {
  const problemas = [], avisos = [];
  const texto = leerTexto(p) || "";
  if (esSubetapa) for (const [nombre, rx] of SECCIONES) if (!rx.test(texto)) problemas.push(`falta la sección «${nombre}»`);
  const reposPermitidos = new Set([...permitidas].filter((u) => u.includes("github.com")).map((u) => u.split("/").slice(0, 5).join("/")));
  for (const u of new Set(texto.match(URL) || [])) {
    const u2 = u.replace(/[.,;:)»]+$/, "");
    if (u2.includes("github.com") || u2.includes("code.claude.com")) {
      const u3 = u2.replace(/\/+$/, "").toLowerCase();
      const esRaiz = u3.split("/").length === 5; // https://github.com/owner/repo
      if (!permitidas.has(u3) && !(esRaiz && reposPermitidos.has(u3))) problemas.push(`URL de skill que no está en hoja-de-ruta.json ni en el catálogo: ${u2}`);
    } else avisos.push(`URL externa (no es skill; confirmar que es necesaria): ${u2}`);
  }
  for (const r of rutasRotasEn(texto, p)) problemas.push(`ruta entre acentos graves que no existe: \`${r}\` (si es un entregable futuro, escríbalo entre «comillas angulares»; los acentos graves son solo para lo que ya existe)`);
  const lineas = texto.split("\n");
  lineas.forEach((l, i0) => {
    const i = i0 + 1;
    const corto = l.trim().slice(0, 90);
    if (rxAtrib.test(l)) problemas.push(`línea ${i}: atribución narrativa: «${corto}»`);
    if ([...l].some((c) => c.charCodeAt(0) < 32 && c !== "\t")) problemas.push(`línea ${i}: caracteres de control en el texto (una ruta con barra mal escapada): «${corto}»`);
    if (SKILL_LINEA.test(l) && !SKILL_ESTADO.test(l)) problemas.push(`línea ${i}: skill sin estado «· instalada» o «· por instalar» (corra anotar_skills.mjs): «${corto}»`);
    if (COAUTH.test(l)) problemas.push(`línea ${i}: Co-Authored`);
  });
  for (const m of marcasEn(texto)) problemas.push(`línea ${m.linea}: marca por llenar: «${m.texto}»`);
  return [problemas, avisos];
}

function main() {
  const a = args();
  const hr = hojaDeRuta();
  if (!hr) { console.log(`No existe ${relativa(RUTA_HOJA)}: primero la hoja de ruta.`); process.exit(2); }
  const permitidas = urlsPermitidas(hr);
  const rxAtrib = atribuciones();
  const informe = {};
  let total = 0;
  if (!a.etapa) {
    const probs = [];
    for (const [rel, obligatorio] of OTROS_ARCHIVOS) {
      const texto = leerTexto(path.join(RAIZ, rel));
      if (texto === null) { if (obligatorio) probs.push(`${rel}: no existe`); continue; }
      for (const m of marcasEn(texto)) probs.push(`${rel}: línea ${m.linea}: marca por llenar: «${m.texto}»`);
      for (const m of new Set(texto.match(/\{\{[A-Z_]+\}\}/g) || [])) probs.push(`${rel}: plantilla sin reemplazar: ${m}`);
    }
    const orden = revisarOrden(hr);
    probs.push(...orden.problemas.map((p) => `hoja-de-ruta.json: ${p}`));
    total += probs.length;
    informe["(raíz)"] = { problemas: { raiz: probs }, avisos: { orden: orden.avisos }, n: probs.length };
    console.log(`\n## Raíz, visión y orden de la hoja de ruta: ${probs.length} problema(s), ${orden.avisos.length} aviso(s)`);
    for (const x of probs) console.log(`  ✗ ${x}`);
    for (const x of orden.avisos) console.log(`  · ${x}`);
  }
  for (const e of hr.etapas) {
    if (a.etapa && e.carpeta !== a.etapa) continue;
    const ed = path.join(RAIZ, e.carpeta);
    const probs = {}, avs = {};
    const add = (archivo, [pr, av]) => {
      const rel = relativa(archivo);
      if (pr.length) probs[rel] = pr;
      if (av.length) avs[rel] = av;
    };
    if (!existe(ed)) { probs[relativa(ed)] = ["la carpeta de la etapa no existe"]; }
    else {
      for (const nombre of ["ESTADO.md", "LEEME.md"]) {
        const f = path.join(ed, nombre);
        if (!existe(f)) probs[relativa(f)] = ["no existe"];
        else add(f, revisarArchivo(f, permitidas, false, rxAtrib));
      }
      const esperadas = new Set((e.subetapas || []).map((s) => s.carpeta));
      for (const s of [...esperadas].sort()) {
        const f = path.join(ed, s, "LEEME.md");
        if (!existe(f)) probs[relativa(f)] = ["no existe (subetapa del JSON sin ficha)"];
        else add(f, revisarArchivo(f, permitidas, true, rxAtrib));
      }
      for (const d of fs.readdirSync(ed, { withFileTypes: true }).filter((x) => x.isDirectory()).map((x) => x.name).sort()) {
        if (!esperadas.has(d) && !d.startsWith(".")) probs[relativa(path.join(ed, d))] = ["subcarpeta que no está en hoja-de-ruta.json"];
      }
    }
    const n = Object.values(probs).reduce((s, v) => s + v.length, 0);
    const na = Object.values(avs).reduce((s, v) => s + v.length, 0);
    total += n;
    informe[e.carpeta] = { problemas: probs, avisos: avs, n };
    console.log(`\n## ${e.carpeta}: ${n} problema(s), ${na} aviso(s)`);
    for (const [arch, lst] of Object.entries(probs)) for (const x of lst) console.log(`  ✗ ${arch}: ${x}`);
    for (const [arch, lst] of Object.entries(avs)) for (const x of lst) console.log(`  · ${arch}: ${x}`);
  }
  console.log(`\nFICHAS: ${total === 0 ? "LIMPIAS" : `${total} PROBLEMA(S)`}`);
  if (typeof a.json === "string") fs.writeFileSync(a.json, JSON.stringify(informe, null, 2), "utf8");
  process.exitCode = total ? 1 : 0;
}

main();
