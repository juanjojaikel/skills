# ESTADO — {{PROYECTO}}

**Último guardado:** {{FECHA}} — planeación terminada: visión, hoja de ruta y carpeta del proyecto creadas.

> Claude: esto se carga solo al abrir el chat (vía `@ESTADO.md` del CLAUDE.md). Úselo para arrancar sin pedir contexto.
> Se actualiza con /guardar. El detalle de cada etapa está en su propio `ESTADO.md`.

## Dónde estamos
La planeación terminó el {{FECHA}} con la visión del producto y la hoja de ruta (`00. Planeacion/07-vision-producto/`).
<<una o dos líneas más: qué existe ya (cuentas, nombre, repo) y qué no; nada de código todavía>>

## ▶️ Siguiente paso exacto
**{{PRIMERA_ETAPA}} → {{PRIMERA_SUBETAPA}}.** Claude lee `{{PRIMERA_ETAPA}}/ESTADO.md` y
`{{PRIMERA_ETAPA}}/{{PRIMERA_SUBETAPA}}/LEEME.md`, nombra el chat `{{NOMBRE_CHAT}}` y abre con el guion de arranque y
las skills de la ficha con sus enlaces. Entregable: <<qué queda al terminar esa subetapa>>.

## Etapas activas ahora
- **{{PRIMERA_ETAPA}} → {{PRIMERA_SUBETAPA}}**: lo siguiente. <<qué otras subetapas pueden ir en paralelo>>

## A medias
- Nada a medias.

## Pendientes
{{PENDIENTES_PERSONAS}}
**De Claude (cuando se lo pidan):**
- [ ] <<pendiente>>

## Preguntas abiertas
- <<pregunta>> — desde {{FECHA}} (<<quién la responde>>).

## Bloqueos y avisos
- <<herramientas que faltan, cuentas por abrir, límites del plan de Claude>>

## Tablero de etapas
| Etapa | Estado | Dónde va | Detalle |
|---|---|---|---|
{{TABLERO}}

## Decisiones recientes (máx. 10; todas en `DECISIONES.md`)
- {{FECHA}} — <<las decisiones de la planeación, una línea cada una, con su número en DECISIONES.md>>

## Bitácora (máx. 10; las viejas en `99. Archivo/BITACORA.md`)
### {{FECHA}} — Planeación completa desde cero
- Hecho: entrevista (`00. Planeacion/01-entrevista/`), investigación con agentes y verificación adversarial
  (`00. Planeacion/02-investigacion/`), opciones técnicas (`00. Planeacion/03-arquitectura/`), acta del Consejo
  (`00. Planeacion/04-consejo/`), catálogo de skills (`00. Planeacion/06-herramientas-claude-code/`), visión del producto
  aprobada y hoja de ruta (`00. Planeacion/07-vision-producto/`), carpetas y fichas de todas las etapas, `CLAUDE.md`,
  `DECISIONES.md`, `README.md`, la skill `/guardar` y <<el repositorio en GitHub>>.
- Commit: <<pendiente del primer /guardar>>
