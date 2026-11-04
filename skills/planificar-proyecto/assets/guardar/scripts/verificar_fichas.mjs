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
import fs from "node:fs";
import path from "node:path";
import { RAIZ, RUTA_HOJA, RUTA_CATALOGO_JSON, hojaDeRuta, leerJson, leerTexto, personas, rutasRotasEn, relativa, existe, args, salida } from "./_comun.mjs";

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
const MARCA = /<<[^>]{1,120}>>/;
const COAUTH = /co-authored/i;

function atribuciones() {
  const nombres = personas().map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const verbos = "(?:hizo|escribi[oó]|propuso|cre[oó]|decidi[oó]|sugiri[oó]|pens[oó]|redact[oó]|dijo|pidi[oó]|quiere|prefiere|mencion[oó]|confirm[oó]|said|decided|asked|wants|wrote|disse|decidiu|pediu)";
  const partes = [`\\bclaude ${verbos}\\b`];
  if (nombres.length) partes.push(`\\b(?:${nombres.join("|")}) ${verbos}\\b`, `\\bseg[uú]n (?:${nombres.join("|")})\\b`);
  return new RegExp(partes.join("|"), "i");
}

function urlsPermitidas(hr) {
  const out = new Set();
  for (const e of hr.etapas) for (const s of e.skills || []) if (s.url) out.add(s.url.replace(/\/+$/, "").toLowerCase());
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
  for (const r of rutasRotasEn(texto, p)) problemas.push(`ruta entre acentos graves que no existe: \`${r}\``);
  const lineas = texto.split("\n");
  lineas.forEach((l, i0) => {
    const i = i0 + 1;
    const corto = l.trim().slice(0, 90);
    if (rxAtrib.test(l)) problemas.push(`línea ${i}: atribución narrativa: «${corto}»`);
    if ([...l].some((c) => c.charCodeAt(0) < 32 && c !== "\t")) problemas.push(`línea ${i}: caracteres de control en el texto (una ruta con barra mal escapada): «${corto}»`);
    if (SKILL_LINEA.test(l) && !SKILL_ESTADO.test(l)) problemas.push(`línea ${i}: skill sin estado «· instalada» o «· por instalar» (corra anotar_skills.mjs): «${corto}»`);
    if (MARCA.test(l)) problemas.push(`línea ${i}: marca por llenar: «${corto}»`);
    if (COAUTH.test(l)) problemas.push(`línea ${i}: Co-Authored`);
  });
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
