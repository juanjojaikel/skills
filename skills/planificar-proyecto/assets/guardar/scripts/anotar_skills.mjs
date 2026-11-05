// Anota en cada ficha (LEEME.md) si cada skill está instalada o por instalar, según el catálogo. Idempotente.
//
// Uso (desde cualquier carpeta):
//   node "<raiz>/.claude/skills/guardar/scripts/anotar_skills.mjs"              anota todas las fichas
//   ... --comprobar                                                              solo lista las líneas sin estado
//
// Una línea de skill es «- nombre — https://…». Se le agrega « · instalada» o « · por instalar». «Instalada» = el
// catálogo la marca con tipo «instalada», «integrada» o «mcp» (o instalada: true); para la raíz de un repositorio, basta
// con que alguna de sus skills esté instalada. Si además existe la carpeta en ~/.claude/skills/<nombre> de ESTA
// computadora, también cuenta (con --sin-local se ignora esa comprobación: útil si quien corre el script no es la
// persona que va a usar el proyecto).
//
// Valores de «tipo» en el catálogo: instalada · por-instalar · plugin (se instala como plugin: cuenta como por
// instalar) · sub-skill (una skill dentro de un repositorio) · repositorio · integrada (viene con Claude Code) · mcp.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { RAIZ, RUTA_CATALOGO_JSON, caminar, carpetaCodigo, leerJson, relativa, args, salida } from "./_comun.mjs";

salida();
const LINEA = /^(\s*[-*]\s+)(.+?)(\s[—–-]\s+)(https?:\/\/\S+)(.*)$/;
const YA = /·\s*(instalada|por instalar|integrada|sin URL|installed|to install|built-in)/i;
const INSTALADAS = ["instalada", "integrada", "mcp", "installed"];
const POR_INSTALAR = " · por instalar (revisar el código, instalar y anotar en el catálogo)";

function estados() {
  const cat = leerJson(RUTA_CATALOGO_JSON, []) || [];
  const porUrl = new Map(), porRepo = new Map();
  for (const e of cat) {
    const u = String((e && e.url) || "").replace(/\/+$/, "").toLowerCase();
    if (!u.startsWith("http")) continue;
    const tipo = String((e && e.tipo) || "").toLowerCase();
    const inst = INSTALADAS.some((t) => tipo.includes(t)) || e.instalada === true;
    porUrl.set(u, (porUrl.get(u) || false) || inst);
    if (u.includes("github.com")) {
      const repo = u.split("/").slice(0, 5).join("/");
      porRepo.set(repo, (porRepo.get(repo) || false) || inst);
    }
  }
  return { porUrl, porRepo };
}

function instaladaLocal(nombre) {
  const base = nombre.replace(/\s*\(.*\)\s*$/, "").trim().split(/[\s/]+/).pop();
  const dir = path.join(os.homedir(), ".claude", "skills", base);
  try { return fs.statSync(path.join(dir, "SKILL.md")).isFile(); } catch { return false; }
}

function main() {
  const a = args();
  const { porUrl, porRepo } = estados();
  const codigo = carpetaCodigo();
  let cambiados = 0;
  const pendientes = [];
  for (const p of caminar()) {
    if (path.basename(p) !== "LEEME.md") continue;
    const partes = relativa(p).split("/");
    if (partes.includes("99. Archivo") || partes.includes(".claude")) continue;
    if (codigo && partes[0] === codigo && partes.length > 2) continue; // dentro del código solo cuenta la ficha de la etapa
    const texto = fs.readFileSync(p, "utf8");
    const salidaLineas = [];
    let tocado = false;
    for (let l of texto.split("\n")) {
      const m = LINEA.exec(l);
      if (m && !YA.test(l)) {
        const u = m[4].replace(/[.,;:)»]+$/, "").replace(/\/+$/, "").toLowerCase();
        const repo = u.includes("github.com") ? u.split("/").slice(0, 5).join("/") : u;
        let inst = porUrl.get(u);
        if (inst === undefined && u.split("/").length === 5) inst = porRepo.get(repo);
        if (!inst && !a["sin-local"] && instaladaLocal(m[2])) inst = true;
        let estado;
        if (u.includes("code.claude.com")) estado = " · integrada en Claude Code";
        else if (inst) estado = " · instalada";
        else estado = POR_INSTALAR;
        if (a.comprobar) pendientes.push(`  ${relativa(p)}: ${l.trim().slice(0, 80)}`);
        else { l = l.replace(/\s+$/, "") + estado; tocado = true; }
      }
      salidaLineas.push(l);
    }
    if (tocado && !a.comprobar) {
      fs.writeFileSync(p, salidaLineas.join("\n"), "utf8");
      cambiados++;
    }
  }
  if (a.comprobar) console.log(pendientes.length ? pendientes.join("\n") : "Todas las skills de las fichas tienen estado.");
  else console.log(`Fichas anotadas: ${cambiados}` + (a["sin-local"] ? "" : ` («instalada» se decidió con el catálogo y con ~/.claude/skills de esta computadora, ${os.hostname()}; si el proyecto lo va a usar otra persona, corra con --sin-local)`));
}

main();
