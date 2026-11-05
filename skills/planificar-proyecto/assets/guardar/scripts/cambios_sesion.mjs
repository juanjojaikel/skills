// Qué cambió en el proyecto desde el último guardado, agrupado por etapa. Solo lee: no cambia nada.
//
// Uso (desde cualquier carpeta):
//   node "<raiz>/.claude/skills/guardar/scripts/cambios_sesion.mjs"              informe completo
//   node "<raiz>/.claude/skills/guardar/scripts/cambios_sesion.mjs" --inicio     chequeo corto al abrir un chat
//   node "<raiz>/.claude/skills/guardar/scripts/cambios_sesion.mjs" --verificar  rutas rotas y archivos sin registrar
//   ... --desde 2026-11-04T09:00                                                 otro punto de partida
//
// «Último guardado» = la fecha de modificación de ESTADO.md en la raíz. Si no existe, se miran las últimas 24 h.
import fs from "node:fs";
import path from "node:path";
import { RAIZ, ESTADO, REGISTROS_EXT, caminar, carpetaCodigo, git, gitOk, registros, rutasRotasEn, relativa, args, leerTexto, salida } from "./_comun.mjs";

salida();

function archivosCambiados(desde) {
  const codigo = carpetaCodigo();
  const out = [];
  for (const p of caminar()) {
    const rel = relativa(p);
    if (codigo && rel.split("/")[0] === codigo) continue; // el código se mira con git, no por fecha
    let m;
    try { m = fs.statSync(p).mtime; } catch { continue; }
    if (m > desde) out.push([p, m]);
  }
  return out.sort((a, b) => a[1] - b[1]);
}

function etapaDe(p) {
  const partes = relativa(p).split("/");
  return partes.length > 1 ? partes[0] : "(raíz)";
}

function gitEstado() {
  if (!gitOk()) return null;
  const rama = git("branch", "--show-current") || `${git("symbolic-ref", "--short", "HEAD")} (sin commits)`;
  const sucios = git("status", "--short").split("\n").filter((l) => l.trim()).length;
  const upstream = git("rev-parse", "--abbrev-ref", "@{u}");
  const sinSubir = upstream ? git("rev-list", "--count", "@{u}..HEAD") || "0" : "sin upstream";
  return { rama, sinCommit: sucios, sinSubir, log: git("log", "--oneline", "-5") || "(sin commits)" };
}

function sinRegistrar(cambios) {
  let texto = "";
  for (const f of registros()) texto += (leerTexto(f) || "") + "\n";
  const out = [];
  for (const [p] of cambios) {
    const nombre = path.basename(p);
    if ([ESTADO, "LEEME.md", "CLAUDE.md"].includes(nombre)) continue;
    if (!REGISTROS_EXT.includes(path.extname(p).toLowerCase())) continue;
    if (relativa(p).startsWith(".claude/")) continue;
    if (!texto.includes(nombre)) out.push(`  ${relativa(p)}`);
  }
  return out;
}

function rutasRotas() {
  const malas = new Set();
  for (const f of registros()) {
    const texto = leerTexto(f);
    if (texto === null) continue;
    for (const r of rutasRotasEn(texto, f)) malas.add(`  ${relativa(f)} → \`${r}\` no existe`);
  }
  return [...malas].sort();
}

function fmt(d) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function main() {
  const a = args();
  const estado = path.join(RAIZ, ESTADO);
  let desde, origen;
  if (typeof a.desde === "string") { desde = new Date(a.desde); origen = "--desde"; }
  else if (fs.existsSync(estado)) { desde = fs.statSync(estado).mtime; origen = "último guardado (ESTADO.md)"; }
  else { desde = new Date(Date.now() - 24 * 3600 * 1000); origen = "sin ESTADO.md: últimas 24 h"; }

  const cambios = archivosCambiados(desde).filter(([p]) => p !== estado);
  console.log(`Proyecto: ${RAIZ}`);
  console.log(`Desde: ${fmt(desde)} (${origen})`);

  if (a.verificar) {
    const rr = rutasRotas(), sr = sinRegistrar(cambios);
    console.log("\n## Rutas rotas en los registros");
    console.log(rr.length ? rr.join("\n") : "  Ninguna.");
    console.log("\n## Archivos tocados que ningún registro menciona");
    console.log(sr.length ? sr.join("\n") : "  Ninguno.");
    console.log("\nVERIFICACIÓN " + (!rr.length && !sr.length ? "LIMPIA" : `CON ${rr.length + sr.length} AVISO(S)`));
    process.exitCode = rr.length + sr.length ? 1 : 0;
    return;
  }

  if (a.inicio) {
    if (cambios.length) {
      const etapas = [...new Set(cambios.map(([p]) => etapaDe(p)))].sort();
      console.log(`AVISO: ${cambios.length} archivo(s) cambiaron DESPUÉS del último guardado, en: ${etapas.join(", ")}.`);
      console.log("Probablemente una sesión anterior cerró sin /guardar. Revise con el informe completo antes de seguir.");
    } else console.log("OK: nada cambió después del último guardado. ESTADO.md está al día.");
    const g = gitEstado();
    if (!g) console.log("AVISO GitHub: el proyecto todavía no es un repositorio de git. /guardar lo inicia y lo sube.");
    else if (!git("remote")) console.log(`AVISO GitHub: el repositorio es solo local (rama ${g.rama}, ${g.sinCommit} archivo(s) sin commit, sin remoto). Falta crearlo en GitHub con el OK de la persona; /guardar lo hace y sube todo.`);
    else if (g.sinSubir === "sin upstream") console.log(`AVISO GitHub: la rama ${g.rama} no está enlazada con GitHub (nada subido). /guardar hace \`git push -u origin develop\`.`);
    else if (g.sinCommit || g.sinSubir !== "0") console.log(`AVISO GitHub: rama ${g.rama} con ${g.sinCommit} archivo(s) sin commit y ${g.sinSubir} commit(s) sin subir. /guardar los sube.`);
    else console.log(`GitHub: rama ${g.rama} al día con origin.`);
    return;
  }

  const codigo = carpetaCodigo();
  if (!cambios.length) console.log(`Sin archivos cambiados${codigo ? ` (fuera de ${codigo})` : ""}.`);
  const porEtapa = new Map();
  for (const c of cambios) {
    const e = etapaDe(c[0]);
    if (!porEtapa.has(e)) porEtapa.set(e, []);
    porEtapa.get(e).push(c);
  }
  for (const [etapa, lista] of porEtapa) {
    console.log(`\n## ${etapa}  (${lista.length})`);
    for (const [p, m] of lista) console.log(`  ${fmt(m).slice(5)}  ${relativa(p)}`);
  }

  console.log("\n## ESTADO.md por etapa");
  const dirs = fs.readdirSync(RAIZ, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^\d\d\. /.test(d.name) && !d.name.startsWith("99"))
    .map((d) => d.name).sort();
  for (const d of dirs) {
    const e = path.join(RAIZ, d, ESTADO);
    const tocada = porEtapa.get(d);
    if (!fs.existsSync(e)) { console.log(`  ${d}: SIN ESTADO.md${tocada ? "  <- tocada en esta sesión: crearlo" : ""}`); continue; }
    const me = fs.statSync(e).mtime;
    const ult = tocada ? tocada.filter(([p]) => p !== e).reduce((mx, [, m]) => (m > mx ? m : mx), new Date(0)) : null;
    const marca = ult && ult > me ? "  <- DESACTUALIZADO: actualizarlo" : "";
    console.log(`  ${d}: ESTADO.md del ${fmt(me).slice(5)}${marca}`);
  }

  console.log("\n## GitHub (git)");
  const g = gitEstado();
  if (!g) console.log("  el proyecto todavía no es un repositorio de git");
  else {
    console.log(`  rama ${g.rama} · ${g.sinCommit} archivo(s) sin commit · ${g.sinSubir} commit(s) sin subir a GitHub`);
    console.log("  últimos commits:\n    " + g.log.replace(/\n/g, "\n    "));
  }

  const rr = rutasRotas(), sr = sinRegistrar(cambios);
  console.log("\n## Rutas rotas en los registros");
  console.log(rr.length ? rr.join("\n") : "  Ninguna.");
  console.log("\n## Archivos tocados que ningún registro menciona (agréguelos al LEEME de su subetapa o al ESTADO)");
  console.log(sr.length ? sr.join("\n") : "  Ninguno.");
}

main();
