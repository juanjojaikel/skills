// Revisa qué herramientas hay en esta computadora antes de planificar un proyecto. Solo lee: no instala nada.
//
// Uso:  node "<ruta-de-esta-skill>/scripts/preparar.mjs" [--raiz "<carpeta del proyecto>"]
//
// Imprime, en lenguaje llano, si están Git, GitHub CLI (gh) con sesión iniciada y Node, en qué carpeta se está y si
// esa carpeta ya tiene un proyecto planificado (ESTADO.md / CLAUDE.md). Para cada cosa que falte da el enlace oficial.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

if (process.stdout.setEncoding) process.stdout.setEncoding("utf8");

function corre(cmd, args) {
  try {
    return [true, execFileSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 20000 }).trim()];
  } catch (e) {
    return [false, String((e.stdout || "") + (e.stderr || "")).trim()];
  }
}

function argumento(nombre) {
  const i = process.argv.indexOf(`--${nombre}`);
  return i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : null;
}

const raiz = path.resolve(argumento("raiz") || process.cwd());
const faltan = [];
console.log(`Carpeta de trabajo: ${raiz}`);
console.log("");

// Node: si este script corre, Node existe. Solo se informa la versión.
const nodeVer = process.versions.node;
const nodeOk = Number(nodeVer.split(".")[0]) >= 18;
console.log(`${nodeOk ? "✓" : "✗"} Node ${nodeVer}${nodeOk ? "" : " (hace falta la versión 18 o más nueva: https://nodejs.org)"}`);
if (!nodeOk) faltan.push("Node 18 o más nuevo → https://nodejs.org");

const [gitOk, gitOut] = corre("git", ["--version"]);
console.log(`${gitOk ? "✓" : "✗"} Git${gitOk ? ` (${gitOut})` : ": no está instalado"}`);
if (!gitOk) faltan.push("Git (guarda el historial del proyecto) → https://git-scm.com/downloads");
else {
  const [nombreOk, nombre] = corre("git", ["config", "--global", "user.name"]);
  const [correoOk, correo] = corre("git", ["config", "--global", "user.email"]);
  if (!nombreOk || !nombre || !correoOk || !correo) {
    console.log("  · Git no tiene nombre y correo configurados; hacen falta para el primer guardado:");
    console.log('    git config --global user.name "Su Nombre"   ·   git config --global user.email "su@correo.com"');
    console.log("    Si la persona no está para darlos, se fijan solo en el repositorio del proyecto (sin --global) con el nombre");
    console.log("    del proyecto y un correo de relleno, y se anota en «Bloqueos y avisos» del ESTADO.md para que los cambie.");
  }
  // Repositorio anidado: si la carpeta (o la más cercana que exista) ya está dentro de un repositorio git, avisar.
  let existente = raiz;
  while (!fs.existsSync(existente) && path.dirname(existente) !== existente) existente = path.dirname(existente);
  const [topOk, top] = corre("git", ["-C", existente, "rev-parse", "--show-toplevel"]);
  if (topOk && top && path.resolve(top) !== raiz) {
    console.log(`  · AVISO: esta carpeta está dentro de otro repositorio git (${path.resolve(top)}). Un git init aquí crea un`);
    console.log("    repositorio anidado que el de afuera ve como carpeta sin rastrear. Mejor planificar fuera de ese repositorio,");
    console.log("    o decidirlo con la persona y anotarlo en «Bloqueos y avisos».");
  }
}

const [ghOk, ghOut] = corre("gh", ["--version"]);
console.log(`${ghOk ? "✓" : "✗"} GitHub CLI (gh)${ghOk ? ` (${ghOut.split("\n")[0]})` : ": no está instalado"}`);
if (!ghOk) faltan.push("GitHub CLI, «gh» (crea y sube el repositorio desde aquí) → https://cli.github.com");
else {
  const [authOk, authOut] = corre("gh", ["auth", "status"]);
  const sesion = authOk || /Logged in to/.test(authOut);
  console.log(`${sesion ? "✓" : "✗"} Sesión de GitHub${sesion ? " iniciada" : " sin iniciar: corra `gh auth login` y siga las instrucciones en pantalla"}`);
  if (!sesion) faltan.push("Sesión de GitHub → en una terminal: gh auth login");
  const [userOk, user] = corre("gh", ["api", "user", "--jq", ".login"]);
  if (userOk && user) console.log(`  · Cuenta: ${user}`);
}

console.log("");
const estado = path.join(raiz, "ESTADO.md");
const claude = path.join(raiz, "CLAUDE.md");
const hoja = path.join(raiz, "00. Planeacion", "07-vision-producto", "hoja-de-ruta.json");
if (fs.existsSync(estado) && fs.existsSync(hoja)) {
  console.log("Esta carpeta YA tiene un proyecto planificado (ESTADO.md y hoja-de-ruta.json existen).");
  console.log("No vuelva a planificar: siga el protocolo del CLAUDE.md de esta carpeta («¿con qué seguimos?»).");
} else if (fs.existsSync(estado) || fs.existsSync(claude) || fs.existsSync(path.join(raiz, "00. Planeacion"))) {
  console.log("Esta carpeta tiene una planeación A MEDIAS (hay ESTADO.md, CLAUDE.md o 00. Planeacion, pero no la hoja de ruta).");
  console.log("Retome desde la fase que falte; no cree una segunda planeación.");
} else if (!fs.existsSync(raiz)) {
  console.log("La carpeta no existe todavía: se crea al escribir el primer archivo (lista para un proyecto nuevo).");
} else {
  let vacia = true;
  try { vacia = fs.readdirSync(raiz).filter((n) => !n.startsWith(".")).length === 0; } catch { }
  console.log(vacia ? "Carpeta vacía: lista para un proyecto nuevo." : "Carpeta con archivos pero sin planeación: se puede planificar aquí (nada existente se pisa).");
}

console.log("");
if (faltan.length) {
  console.log("Falta instalar (se puede empezar la entrevista y la investigación mientras tanto; hacen falta al final, para GitHub):");
  for (const f of faltan) console.log(`  - ${f}`);
  console.log("PREPARACIÓN: INCOMPLETA");
} else {
  console.log("PREPARACIÓN: LISTA");
}
