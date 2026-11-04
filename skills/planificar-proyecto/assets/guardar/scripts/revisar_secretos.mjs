// Revisa que no se suban secretos ni datos de personas al repositorio. Solo lee: no cambia nada.
//
// Uso (desde cualquier carpeta):
//   node "<raiz>/.claude/skills/guardar/scripts/revisar_secretos.mjs"          archivos preparados (git add)
//   node "<raiz>/.claude/skills/guardar/scripts/revisar_secretos.mjs" --todo   todos los archivos del repositorio
//
// Sale con código 1 si encuentra algo que bloquea el commit. Los avisos (no bloquean) se listan aparte.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { RAIZ, git, gitOk, args, salida } from "./_comun.mjs";

salida();
const ESTE = path.resolve(fileURLToPath(import.meta.url));

// Patrones que BLOQUEAN (secretos con formato conocido)
const BLOQUEAN = [
  ["llave privada", /-----BEGIN (?:RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----/],
  ["token de GitHub", /\bgh[pousr]_[A-Za-z0-9]{36,}\b/],
  ["token de GitHub (fine-grained)", /\bgithub_pat_[A-Za-z0-9_]{60,}\b/],
  ["llave de Stripe", /\b[sr]k_(?:live|test)_[A-Za-z0-9]{16,}\b/],
  ["secreto de webhook de Stripe", /\bwhsec_[A-Za-z0-9]{24,}\b/],
  ["llave de AWS", /\bAKIA[0-9A-Z]{16}\b/],
  ["llave de Google", /\bAIza[0-9A-Za-z_\-]{35}\b/],
  ["token de Slack", /\bxox[baprs]-[0-9A-Za-z\-]{10,}\b/],
  ["llave de SendGrid", /\bSG\.[A-Za-z0-9_\-]{22}\.[A-Za-z0-9_\-]{43}\b/],
  ["token de Resend", /\bre_[A-Za-z0-9]{20,}\b/],
  ["llave de Anthropic", /\bsk-ant-[A-Za-z0-9_\-]{20,}\b/],
  ["llave de OpenAI", /\bsk-(?:proj-)?[A-Za-z0-9_\-]{32,}\b/],
  ["JWT", /\beyJ[A-Za-z0-9_\-]{10,}\.eyJ[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}\b/],
  ["secreto OAuth de Google", /\bGOCSPX-[A-Za-z0-9_\-]{20,}\b/],
  ["token de npm", /\bnpm_[A-Za-z0-9]{30,}\b|_authToken\s*=\s*\S{10,}/],
  ["token de Cloudflare", /(?:cloudflare|cf)_?(?:api_)?(?:token|key)\b\s*[:=]\s*['"]?[A-Za-z0-9_\-]{30,}|\bv1\.0-[A-Za-z0-9_\-]{100,}/i],
  ["secreto asignado en texto", /\b(?:api[_\-]?key|api[_\-]?token|secret[_\-]?key|client[_\-]?secret|access[_\-]?token|auth[_\-]?token|secret|token|password|contrase[ñn]a|senha)\b\s*[:=]\s*['"]?[A-Za-z0-9_\-\.\/\+]{16,}['"]?(?:\s|$)/i],
];

// Archivos que BLOQUEAN por su nombre (los .example sí pueden entrar: no llevan valores reales)
const NOMBRES_BLOQUEAN = /(^|\/)(\.env|\.env\.(?!example$).*|\.dev\.vars|\.dev\.vars\.(?!example$).*|client_secret.*\.json|.*service-account.*\.json|credentials\.json|token\.json|secrets\.json|\.npmrc|.*\.(pem|key|p12|pfx|keystore|jks))$/i;

// Avisos (no bloquean): posibles datos de personas
const AVISAN = [
  ["muchos números largos seguidos (¿identificaciones o teléfonos de personas?)", /(?:\b\d{7,12}\b[\s\S]{0,80}){8,}/],
  ["muchos correos personales (¿lista de clientes?)", /(?:[\w.+-]+@(?:gmail|hotmail|outlook|yahoo|icloud)\.[a-z.]+[\s\S]{0,80}){5,}/i],
];

const BINARIOS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".pdf", ".docx", ".xlsx", ".pptx", ".mp4", ".mp3", ".zip",
  ".woff", ".woff2", ".cap", ".mov", ".wav"]);
const IGNORAR_PARTES = new Set([".git", "node_modules", ".wrangler", "dist", "build", ".venv", "__pycache__"]);

function archivos(todo) {
  if (!gitOk()) { console.log("No se pudo consultar git: el proyecto no es un repositorio todavía."); process.exit(2); }
  const salidaGit = todo
    ? git("ls-files", "--cached", "--others", "--exclude-standard")
    : git("diff", "--cached", "--name-only", "--diff-filter=ACMR");
  const out = [];
  for (const linea of salidaGit.split("\n")) {
    const rel = linea.trim().replace(/^"|"$/g, "");
    if (!rel) continue;
    if (rel.split("/").some((x) => IGNORAR_PARTES.has(x))) continue;
    const p = path.join(RAIZ, rel);
    if (path.resolve(p) === ESTE) continue;
    out.push([p, rel]);
  }
  return out;
}

function main() {
  const a = args();
  const bloqueos = [], avisos = [];
  const lista = archivos(!!a.todo);
  for (const [p, rel] of lista) {
    if (NOMBRES_BLOQUEAN.test(rel)) { bloqueos.push(`  ${rel}: archivo de secretos por su nombre`); continue; }
    let st;
    try { st = fs.statSync(p); } catch { continue; }
    if (!st.isFile() || BINARIOS.has(path.extname(p).toLowerCase())) continue;
    let texto;
    try { texto = fs.readFileSync(p, "utf8"); } catch { continue; }
    for (const [nombre, rx] of BLOQUEAN) {
      const m = rx.exec(texto);
      if (m) {
        const linea = texto.slice(0, m.index).split("\n").length;
        bloqueos.push(`  ${rel}:${linea}: ${nombre}`);
      }
    }
    const ext = path.extname(p).toLowerCase();
    const filas = texto.split("\n").length;
    if ((ext === ".csv" || ext === ".tsv") && filas > 20) avisos.push(`  ${rel}: tabla con ${filas} filas, ¿datos de personas reales? (solo datos inventados)`);
    for (const [nombre, rx] of AVISAN) if (rx.test(texto)) avisos.push(`  ${rel}: ${nombre}`);
  }
  console.log(`Revisados: ${lista.length} archivo(s) (${a.todo ? "todo el repositorio" : "preparados para commit"}).`);
  console.log("\n## Bloquean el commit");
  console.log(bloqueos.length ? bloqueos.join("\n") : "  Nada.");
  console.log("\n## Avisos (revisar, no bloquean)");
  console.log(avisos.length ? avisos.join("\n") : "  Nada.");
  if (bloqueos.length) {
    console.log("\nSECRETOS: BLOQUEADO. Quite el secreto (escriba «ver gestor de secretos», nunca el valor) y vuelva a correr.");
    process.exit(1);
  }
  console.log("\nSECRETOS: LIMPIO");
}

main();
