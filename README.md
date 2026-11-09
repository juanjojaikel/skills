# Skills de Juanjo Jaikel para Claude Code

Skills públicas, listas para instalar en Claude Code. Cada carpeta de `skills/` es una skill completa con sus
instrucciones (`SKILL.md`), sus referencias, plantillas y scripts.

| Skill | Qué hace |
|---|---|
| [`planificar-proyecto`](skills/planificar-proyecto/) | Lleva una idea de app o producto digital desde cero hasta un plan completo y una carpeta de proyecto lista para construir con Claude Code: entrevista sin jerga, investigación con agentes, Consejo de 5 asesores, visión del producto, hoja de ruta por etapas, fichas, la skill `/guardar` y el repositorio en GitHub. |

## Cómo instalar una skill

**Opción 1 — con el instalador de skills** (recomendada; hace falta Node, que Claude Code ya trae):

```bash
npx skills add juanjojaikel/skills
```

**Opción 2 — como plugin de Claude Code** (dentro de Claude Code):

```
/plugin marketplace add juanjojaikel/skills
/plugin install planificar-proyecto@juanjojaikel
```

**Opción 3 — a mano:** descargue este repositorio (botón verde «Code» → «Download ZIP»), descomprímalo y copie la carpeta
`skills/planificar-proyecto` dentro de `~/.claude/skills/` (en Windows: `C:\Users\<su usuario>\.claude\skills\`).

Después, en cualquier chat de Claude Code, escriba `/planificar-proyecto` o simplemente cuente su idea («quiero hacer
una app para…»): la skill se activa sola.

## Qué necesita su computadora

- **Claude Code** (incluye Node): https://claude.com/claude-code
- **Git**: https://git-scm.com/downloads
- **GitHub CLI** (`gh`), con sesión iniciada (`gh auth login`): https://cli.github.com

La skill revisa todo esto al arrancar y le dice en lenguaje llano qué falta.

## Licencia

MIT. Úselas, cámbielas y compártalas; solo conserve el aviso de licencia.
