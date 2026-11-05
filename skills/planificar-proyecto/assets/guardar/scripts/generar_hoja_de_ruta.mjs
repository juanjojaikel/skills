// Genera hoja-de-ruta.html a partir de hoja-de-ruta.json (la fuente). Si el HTML ya existe, solo reemplaza su <script>.
//
// Uso (desde cualquier carpeta):
//   node "<raiz>/.claude/skills/guardar/scripts/generar_hoja_de_ruta.mjs"
//   ... --comprobar            no escribe: sale con código 1 si el HTML no coincide con el JSON
//   ... --json <ruta> --html <ruta>   otras rutas (p. ej. antes de crear la estructura del proyecto)
import fs from "node:fs";
import path from "node:path";
import { RUTA_HOJA, leerJson, escribirTexto, args, salida, revisarOrden } from "./_comun.mjs";

salida();

function esc(s) {
  return String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}

function bloque(hr) {
  const E = hr.etapas.map((e) => ({
    n: e.n, t: e.titulo, o: e.objetivo, entra: e.entra || "", p: e.por_que || "",
    s: (e.subetapas || []).map((s) => `${s.carpeta}: ${s.descripcion}`),
    h: e.como || [], k: (e.skills || []).map((s) => ({ n: s.nombre, u: s.url })), d: e.terminada || "",
  }));
  if (!E.length) E.push({ n: "", t: "(sin etapas)", o: "", entra: "", p: "", s: [], h: [], k: [], d: "" });
  for (const e of E) if (!e.s.length) e.s = ["(sin subetapas)"];
  return `<script>
// Datos generados desde hoja-de-ruta.json (versión ${esc(hr.version)}) por generar_hoja_de_ruta.mjs. No editar aquí: editar el JSON y regenerar.
var E=${JSON.stringify(E)};
function esc(s){return String(s).replace(/[&<>]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;"}[c]})}
var html="";
E.forEach(function(e,i){
 var sk=e.k.map(function(k){return '<div class="sk">• '+esc(k.n)+' — <a href="'+esc(k.u)+'" target="_blank" rel="noopener">'+esc(k.u)+'</a></div>'}).join("");
 var list=e.k.map(function(k){return k.n+" — "+k.u}).join("\\n");
 html+='<details class="etapa"'+(i<2?" open":"")+'><summary><h2><span class="num">'+e.n+'</span>'+esc(e.t)+'</h2><div class="obj">'+esc(e.o)+'</div></summary><div class="body">'+
 (e.p?'<h4>Por qué importa (para quien empieza de cero)</h4><div>'+esc(e.p)+'</div>':'')+
 (e.entra?'<h4>Entra cuando</h4><div>'+esc(e.entra)+'</div>':'')+
 '<h4>Subetapas (una carpeta y un chat cada una)</h4><ul>'+e.s.map(function(x){return"<li>"+esc(x)+"</li>"}).join("")+'</ul>'+
 (e.h.length?'<h4>Cómo</h4><ul>'+e.h.map(function(x){return"<li>"+esc(x)+"</li>"}).join("")+'</ul>':'')+
 (e.k.length?'<h4>Skills</h4><div class="skills">'+sk+'</div><button class="copy" data-t="'+esc(list).replace(/"/g,"&quot;")+'">Copiar enlaces</button>':"")+
 (e.d?'<div class="done"><b>Terminada cuando:</b> '+esc(e.d)+'</div>':'')+'</div></details>';
});
document.getElementById("etapas").innerHTML=html;
document.querySelectorAll("button.copy").forEach(function(b){b.addEventListener("click",function(){try{navigator.clipboard.writeText(b.getAttribute("data-t"));b.textContent="Copiado"}catch(e){}})});
</script>`;
}

function ciclo(lista) {
  return (lista || []).map((p, i) => `<span>${i + 1}. ${esc(p)}</span>`).join("→");
}

function cascaron(hr) {
  const nombre = esc(hr.proyecto || "Proyecto");
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${nombre} — Hoja de ruta</title>
<style>
:root{--bg:#fbfaf7;--fg:#1d1d1b;--muted:#6b6a65;--line:#e4e1d8;--card:#ffffff;--acc:#d9480f;--ok:#2b8a3e;--warn:#b7791f;--chip:#f1efe8}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#161614;--fg:#ecebe6;--muted:#a3a29b;--line:#34332f;--card:#1f1f1c;--acc:#ff8a4c;--ok:#69db7c;--warn:#f6c453;--chip:#2a2926}}
:root[data-theme="dark"]{--bg:#161614;--fg:#ecebe6;--muted:#a3a29b;--line:#34332f;--card:#1f1f1c;--acc:#ff8a4c;--ok:#69db7c;--warn:#f6c453;--chip:#2a2926}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif}
.wrap{max-width:980px;margin:0 auto;padding:24px 16px 80px}
h1{font-size:2rem;margin:0 0 4px}h2{margin:0 0 4px;font-size:1.3rem}
.sub,.muted{color:var(--muted)}
.card{border:1px solid var(--line);background:var(--card);border-radius:10px;padding:14px 18px;margin:14px 0}
.ok{border-left:4px solid var(--ok)}.warn{border-left:4px solid var(--warn)}
details.etapa{border:1px solid var(--line);background:var(--card);border-radius:10px;margin:12px 0;padding:0}
details.etapa>summary{cursor:pointer;padding:14px 18px;list-style:none}
details.etapa>summary::-webkit-details-marker{display:none}
details.etapa[open]>summary{border-bottom:1px solid var(--line)}
.body{padding:12px 18px 16px}
.num{display:inline-block;min-width:2.2em;font-weight:800;color:var(--acc)}
.obj{color:var(--muted);font-size:.95rem;margin-left:2.4em}
h4{margin:14px 0 4px;font-size:.95rem;text-transform:uppercase;letter-spacing:.04em;color:var(--muted)}
ul{margin:4px 0;padding-left:22px}
code{background:var(--chip);padding:0 4px;border-radius:4px;font-size:.88em}
.skills{display:flex;flex-direction:column;gap:4px}
.sk{font-size:.9rem}
.sk a{color:var(--acc);word-break:break-all}
.done{border-left:4px solid var(--ok);background:var(--chip);padding:6px 10px;border-radius:6px;margin-top:10px;font-size:.93rem}
.ciclo{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:8px 0}
.ciclo span{background:var(--chip);border:1px solid var(--line);border-radius:14px;padding:2px 10px;font-size:.88rem}
button.copy{border:1px solid var(--line);background:var(--card);color:var(--fg);border-radius:6px;padding:4px 10px;cursor:pointer;margin:6px 6px 0 0}
</style>
</head>
<body><div class="wrap">

<h1>${nombre} — Hoja de ruta por etapas</h1>
<p class="sub">Versión <code>${esc(hr.version)}</code> · Sale de <code>${esc(hr.fuente || "vision-producto.html")}</code>. Los datos viven en <code>hoja-de-ruta.json</code>; este HTML se regenera con <code>generar_hoja_de_ruta.mjs</code>.</p>

<div class="card ok">
<b>Cómo está pensada.</b> Por orden de construcción: primero la base (cuentas, pruebas de lo incierto, diseño, base técnica, seguridad), después las funciones del MVP <b>una por una</b>, después la landing y el lanzamiento, y luego las versiones siguientes. Cada etapa es una carpeta; cada subetapa es una carpeta y <b>un chat</b>. Cada carpeta trae una ficha (<code>LEEME.md</code>): objetivo, qué se entrega, cuándo está terminada y las skills con su enlace. Ninguna etapa tiene fecha: termina cuando su resultado existe y se verificó.
</div>

${hr.ciclo_modulo && hr.ciclo_modulo.length ? `<div class="card">
<b>Ciclo de cada módulo con código</b>
<div class="ciclo">${ciclo(hr.ciclo_modulo)}</div>
</div>` : ""}

${hr.ciclo_no_codigo && hr.ciclo_no_codigo.length ? `<div class="card">
<b>Ciclo sin código</b>
<div class="ciclo">${ciclo(hr.ciclo_no_codigo)}</div>
</div>` : ""}

<div class="card">
<b>Reglas de cada chat</b> (están en el <code>CLAUDE.md</code> del proyecto):
<ul>
<li>Se abre un chat y se pregunta «¿con qué seguimos?». Claude lee <code>ESTADO.md</code>, nombra el chat (<code>${nombre} · NN Etapa · NN-subetapa</code>) y arranca con el guion de arranque: dónde vamos, por qué importa la etapa, qué se entrega y <b>las skills con su enlace</b>.</li>
<li>Al terminar se corre <b>/guardar</b>: actualiza <code>ESTADO.md</code>, las fichas y <code>DECISIONES.md</code>, revisa que no haya secretos, <b>y sube todo a GitHub</b> con una nota impersonal de qué cambió.</li>
<li>Lo que no se verificó es pendiente, no hecho. Nada se borra: lo superado va a <code>99. Archivo</code> con su porqué.</li>
</ul>
</div>

<div id="etapas"></div>

</div>
${bloque(hr)}
</body></html>
`;
}

function main() {
  const a = args();
  const rutaJson = typeof a.json === "string" ? path.resolve(a.json) : RUTA_HOJA;
  const rutaHtml = typeof a.html === "string" ? path.resolve(a.html) : path.join(path.dirname(rutaJson), "hoja-de-ruta.html");
  const hr = leerJson(rutaJson, null);
  if (!hr || !Array.isArray(hr.etapas)) { console.log(`No se pudo leer ${rutaJson} (debe tener "etapas").`); process.exit(2); }
  // El orden se revisa aquí porque aquí se aprueba: corregirlo después obliga a rehacer fichas.
  const orden = revisarOrden(hr);
  for (const x of orden.problemas) console.log(`✗ ${x}`);
  for (const x of orden.avisos) console.log(`· ${x}`);
  console.log(`ORDEN: ${orden.problemas.length ? `${orden.problemas.length} PROBLEMA(S): corríjalos en el JSON antes de pedir la aprobación` : "POSIBLE"}${orden.avisos.length ? ` · ${orden.avisos.length} aviso(s)` : ""}`);
  const nuevo = bloque(hr);
  const html = fs.existsSync(rutaHtml) ? fs.readFileSync(rutaHtml, "utf8") : null;
  if (a.comprobar) {
    const i = html ? html.indexOf("<script>") : -1, j = html ? html.indexOf("</script>") + "</script>".length : -1;
    if (html && i >= 0 && html.slice(i, j) === nuevo) console.log("hoja-de-ruta.html coincide con hoja-de-ruta.json");
    else { console.log("hoja-de-ruta.html NO coincide con hoja-de-ruta.json: corra generar_hoja_de_ruta.mjs"); process.exit(1); }
    return;
  }
  if (html && html.includes("<script>") && html.includes("</script>")) {
    const i = html.indexOf("<script>"), j = html.indexOf("</script>") + "</script>".length;
    escribirTexto(rutaHtml, html.slice(0, i) + nuevo + html.slice(j));
    console.log(`${path.basename(rutaHtml)} regenerada desde ${path.basename(rutaJson)} (solo el bloque de datos)`);
  } else {
    escribirTexto(rutaHtml, cascaron(hr));
    console.log(`${path.basename(rutaHtml)} creada desde ${path.basename(rutaJson)}`);
  }
}

main();
