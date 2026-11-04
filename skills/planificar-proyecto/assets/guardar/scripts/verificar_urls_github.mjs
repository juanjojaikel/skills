// Comprueba contra la API de GitHub que las URLs de skills existen, y opcionalmente las agrega al catálogo.
//
// Uso (desde cualquier carpeta):
//   node ".../verificar_urls_github.mjs" --informe fichas-informe.json      las URLs que verificar_fichas.mjs marcó
//   node ".../verificar_urls_github.mjs" https://github.com/owner/repo/tree/main/skills/x ...
//   ... --agregar      las que existen se agregan a catalogo-skills-urls.json y .md (tipo «sub-skill» o «repo-github»)
//
// Necesita `gh` con sesión iniciada. Solo lee de GitHub; en disco solo escribe el catálogo si se pasa --agregar.
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { RUTA_CATALOGO_JSON, RUTA_CATALOGO_MD, leerJson, escribirTexto, fechaIso, args, salida } from "./_comun.mjs";

salida();
const RX = /^https?:\/\/github\.com\/([^\/\s]+)\/([^\/\s#?]+)(?:\/(?:tree|blob)\/([^\/\s]+)\/(.+?))?\/?$/;

function gh(argsGh) {
  try {
    return [0, execFileSync("gh", ["api", ...argsGh], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 60000 }).trim()];
  } catch (e) {
    return [e.status || 1, String((e.stdout || "") + (e.stderr || "")).trim()];
  }
}

function existeUrl(url) {
  const m = RX.exec(url.trim());
  if (!m) return [false, "no es una URL de github.com reconocible"];
  let [, owner, repo, ref, ruta] = m;
  repo = repo.replace(/\.git$/, "");
  if (!ruta) {
    const [code, out] = gh([`repos/${owner}/${repo}`, "--jq", '.full_name + " estrellas=" + (.stargazers_count|tostring) + " licencia=" + (.license.spdx_id // "ninguna") + " actualizado=" + .pushed_at[:10]']);
    return [code === 0, out];
  }
  const [code, out] = gh([`repos/${owner}/${repo}/contents/${ruta}?ref=${ref}`, "--jq", 'if type=="array" then ("carpeta con " + (length|tostring) + " entradas") else .type end']);
  return [code === 0, out];
}

function main() {
  const a = args();
  const urls = new Map();
  for (const u of a._) urls.set(u.replace(/\/+$/, ""), new Set());
  if (typeof a.informe === "string") {
    const inf = leerJson(a.informe, {});
    for (const [etapa, datos] of Object.entries(inf || {})) {
      for (const lst of Object.values((datos && datos.problemas) || {})) {
        for (const p of lst) {
          const m = /(https?:\/\/github\.com\/\S+)/.exec(p);
          if (m) {
            const k = m[1].replace(/\/+$/, "");
            if (!urls.has(k)) urls.set(k, new Set());
            urls.get(k).add(etapa);
          }
        }
      }
    }
  }
  if (!urls.size) { console.log("Nada que comprobar."); return; }

  const cat = leerJson(RUTA_CATALOGO_JSON, []) || [];
  const ya = new Set(cat.map((e) => String((e && e.url) || "").replace(/\/+$/, "")));
  const nuevas = [];
  for (const u of [...urls.keys()].sort()) {
    const [ok, detalle] = existeUrl(u);
    console.log(`${ok ? "✓" : "✗"} ${u}  (${detalle.slice(0, 90)})`);
    if (ok && a.agregar && !ya.has(u)) {
      const [, owner, repo, , ruta] = RX.exec(u);
      nuevas.push({
        nombre: `${owner}/${repo}${ruta ? ` › ${ruta}` : ""}`,
        url: u,
        origen: `gh api ${fechaIso()}: comprobado que existe (${detalle.slice(0, 80)})`,
        tipo: ruta ? "sub-skill" : "repo-github",
        etapas: [...urls.get(u)].sort(),
      });
    }
  }
  if (nuevas.length) {
    cat.push(...nuevas);
    escribirTexto(RUTA_CATALOGO_JSON, JSON.stringify(cat, null, 2) + "\n");
    let md = fs.existsSync(RUTA_CATALOGO_MD) ? fs.readFileSync(RUTA_CATALOGO_MD, "utf8") : "# Catálogo de skills y herramientas → URL\n\n**Total: 0 entradas.**\n";
    md += `\n## Agregadas el ${fechaIso()} (comprobadas con gh api)\n\n| Nombre | URL | Tipo | Etapas |\n|---|---|---|---|\n`;
    for (const e of nuevas) md += `| ${e.nombre} | ${e.url} | ${e.tipo} | ${e.etapas.join(", ")} |\n`;
    // el total del encabezado se cuenta en el JSON, nunca se copia
    md = md.replace(/\*\*Total: \d+ entradas\.\*\*/, `**Total: ${cat.length} entradas.**`);
    escribirTexto(RUTA_CATALOGO_MD, md);
    console.log(`\nAgregadas al catálogo: ${nuevas.length} (total ahora: ${cat.length})`);
  }
}

main();
