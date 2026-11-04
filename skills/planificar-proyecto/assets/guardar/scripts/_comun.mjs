// Funciones compartidas por los scripts de /guardar. Sin dependencias: solo Node (18 o posterior).
// La raíz del proyecto es la carpeta que contiene `.claude/skills/guardar/scripts/` (cuatro niveles arriba).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
export const ESTADO = "ESTADO.md";
export const DIR_PLANEACION = path.join(RAIZ, "00. Planeacion");
export const RUTA_HOJA = path.join(DIR_PLANEACION, "07-vision-producto", "hoja-de-ruta.json");
export const RUTA_CATALOGO_JSON = path.join(DIR_PLANEACION, "06-herramientas-claude-code", "catalogo-skills-urls.json");
export const RUTA_CATALOGO_MD = path.join(DIR_PLANEACION, "06-herramientas-claude-code", "catalogo-skills-urls.md");
export const RUTA_PROYECTO = path.join(RAIZ, "proyecto.json");

export const IGNORAR = new Set(["node_modules", ".git", ".wrangler", "dist", "build", ".turbo", "__pycache__", ".venv", ".cache",
  "coverage", "settings.local.json", ".DS_Store"]);
export const REGISTROS_EXT = [".md", ".html", ".py", ".mjs", ".js", ".ts", ".tsx", ".json", ".pdf", ".txt", ".csv", ".tsv",
  ".png", ".jpg", ".jpeg", ".mp4", ".xlsx", ".docx", ".pptx", ".toml", ".yml", ".yaml", ".css", ".svg"];
export const ESPERADOS = new Set(["BITACORA.md"]); // rutas que las plantillas mencionan aunque todavía no existan

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/** Fecha absoluta al estilo de los registros: 4-nov-2026. */
export function fechaCorta(d = new Date()) {
  return `${d.getDate()}-${MESES[d.getMonth()]}-${d.getFullYear()}`;
}
export function fechaIso(d = new Date()) {
  return d.toISOString().slice(0, 10);
}
export function fechaHora(d = new Date()) {
  const hh = String(d.getHours()).padStart(2, "0"), mm = String(d.getMinutes()).padStart(2, "0");
  return `${fechaCorta(d)} ${hh}:${mm}`;
}

export function leerTexto(p) {
  try { return fs.readFileSync(p, "utf8"); } catch { return null; }
}
export function leerJson(p, porDefecto = null) {
  const t = leerTexto(p);
  if (t === null) return porDefecto;
  try { return JSON.parse(t.replace(/^﻿/, "")); } catch (e) { throw new Error(`JSON inválido en ${p}: ${e.message}`); }
}
export function escribirTexto(p, texto) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, texto.replace(/\r\n/g, "\n"), "utf8");
}
export function existe(p) {
  try { fs.statSync(p); return true; } catch { return false; }
}
export function relativa(p) {
  return path.relative(RAIZ, p).split(path.sep).join("/");
}

/** proyecto.json de la raíz (nombre, personas, carpeta_codigo…) o {} si no existe. */
export function proyecto() {
  return leerJson(RUTA_PROYECTO, {}) || {};
}
export function hojaDeRuta() {
  return leerJson(RUTA_HOJA, null);
}
/** Carpeta del código (se mira con git, no por fecha): proyecto.json > hoja-de-ruta.json > ninguna. */
export function carpetaCodigo() {
  const p = proyecto();
  if (p.carpeta_codigo) return p.carpeta_codigo;
  const h = hojaDeRuta();
  return (h && h.carpeta_codigo) || null;
}
/** Nombres de las personas del proyecto (para bloquear atribuciones narrativas). */
export function personas() {
  const p = proyecto();
  const h = hojaDeRuta();
  const lista = [...(p.personas || []), ...((h && h.personas) || [])];
  return [...new Set(lista.map((x) => (typeof x === "string" ? x : x && x.nombre)).filter(Boolean))];
}

/** Recorre los archivos del proyecto (sin las carpetas ignoradas). */
export function* caminar(dir = RAIZ, saltar = IGNORAR) {
  let entradas;
  try { entradas = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entradas) {
    if (saltar.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* caminar(p, saltar);
    else if (e.isFile()) yield p;
  }
}

/** git -C <raíz> <args>; devuelve stdout recortado o "" si falla. */
export function git(...args) {
  try {
    return execFileSync("git", ["-C", RAIZ, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 30000 }).trim();
  } catch { return ""; }
}
export function gitOk() {
  try {
    execFileSync("git", ["-C", RAIZ, "rev-parse", "--is-inside-work-tree"], { stdio: "ignore", timeout: 10000 });
    return true;
  } catch { return false; }
}

const COMANDOS = ["npx ", "npm ", "pnpm ", "git ", "claude ", "uv ", "py ", "python", "node ", "curl ", "wrangler ", "gh ", "cd "];

/** ¿Un texto entre acentos graves parece una ruta del proyecto (y no un comando, una URL, un owner/repo)? */
export function pareceRuta(s) {
  if (/[<>*{}|?"@]/.test(s) || s.includes("://") || s.includes(" && ") || s.length > 200) return false;
  if (/^[\/$~\-]|^http/.test(s) || COMANDOS.some((c) => s.startsWith(c))) return false;
  if (s.includes("\\")) return true;
  const min = s.toLowerCase();
  const conExt = REGISTROS_EXT.some((e) => min.endsWith(e));
  if (s.includes("/")) {
    // con barra normal solo cuenta si termina en extensión conocida o empieza por una carpeta de etapa (NN. Nombre)
    return conExt || /^\d\d\. /.test(s);
  }
  return !s.includes(" ") && conExt && !min.startsWith(".") && path.parse(s).name.length > 0;
}

let _nombresCache = null;
function nombresDelProyecto() {
  if (!_nombresCache) {
    _nombresCache = new Set();
    for (const p of caminar()) _nombresCache.add(path.basename(p));
  }
  return _nombresCache;
}

/** Rutas entre acentos graves que no existen, relativas a `bases` (la raíz, la carpeta del archivo, su padre). */
export function rutasRotasEn(texto, archivo) {
  const malas = new Set();
  const bases = [RAIZ, path.join(RAIZ, ".claude", "skills", "guardar"), path.dirname(archivo), path.dirname(path.dirname(archivo))];
  const vistos = new Set();
  for (const m of texto.matchAll(/`([^`\n]+)`/g)) {
    const s = m[1];
    if (vistos.has(s)) continue;
    vistos.add(s);
    let s2 = s.trim().replace(/[\\\/]+$/, "").replace(/\\\\/g, "\\");
    if (!pareceRuta(s2)) continue;
    const norm = s2.replace(/\\/g, "/");
    if (ESPERADOS.has(path.basename(norm))) continue;
    let ok = path.isAbsolute(norm) ? existe(norm) : bases.some((b) => existe(path.join(b, norm)));
    if (!ok && !path.isAbsolute(norm) && !norm.includes("/")) ok = nombresDelProyecto().has(norm);
    if (!ok) malas.add(s);
  }
  return [...malas].sort();
}

/** Los archivos que hacen de registro: CLAUDE.md, ESTADO.md, DECISIONES.md, CHANGELOG.md, README.md y todos los ESTADO/LEEME. */
export function registros() {
  const codigo = carpetaCodigo();
  const out = ["CLAUDE.md", ESTADO, "DECISIONES.md", "CHANGELOG.md", "README.md"].map((n) => path.join(RAIZ, n));
  for (const p of caminar()) {
    const nombre = path.basename(p);
    const partes = relativa(p).split("/");
    if ((nombre === ESTADO || nombre === "LEEME.md") && !partes.includes(".claude") && !(codigo && partes[0] === codigo && partes.length > 2)) out.push(p);
  }
  return [...new Set(out)].filter(existe);
}

/** Lee los argumentos `--clave valor` y las banderas `--bandera`. */
export function args(argv = process.argv.slice(2)) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const k = a.slice(2);
      const v = argv[i + 1];
      if (v !== undefined && !v.startsWith("--")) { out[k] = v; i++; } else out[k] = true;
    } else out._.push(a);
  }
  return out;
}

export function salida() {
  if (process.stdout.setEncoding) process.stdout.setEncoding("utf8");
}
