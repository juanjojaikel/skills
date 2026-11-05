---
name: guardar
description: Guarda TODO lo trabajado en la sesión del proyecto {{PROYECTO}} para que el próximo chat arranque sabiendo qué se hizo, qué quedó a medias, qué está pendiente y cuál es el siguiente paso exacto, y lo sube a GitHub. Actualiza el ESTADO.md del proyecto y de cada etapa tocada, el LEEME (ficha) de cada subetapa con archivos y skills nuevas, DECISIONES.md, CHANGELOG.md si algo pasó a producción y, solo si cambió una regla fija, el CLAUDE.md; verifica rutas y archivos sin registrar; revisa secretos; hace commit (impersonal, sin Co-Authored-By) y push a develop. Úsela cuando la persona diga «guardar», «/guardar», «guarde todo», «guarde el avance», «actualice el estado», «cierre la bitácora», «cerremos», «terminamos por hoy», al terminar una subetapa, o al cerrar cualquier tarea significativa aunque no lo pida. «Guardar sin subir» hace lo mismo pero deja solo el commit local (sin GitHub).
---

# /guardar — memoria de trabajo del proyecto + GitHub

El objetivo es doble: **que nadie tenga que dar contexto en un chat nuevo** y **que todo el proyecto quede en GitHub**
tal como está, para que cualquiera que entre después vea cómo se hizo cada cosa. El próximo chat carga solo `CLAUDE.md`,
y ese importa `ESTADO.md`. Todo lo que no quede escrito ahí se pierde; todo lo que no se suba, también.

**No pregunte nada. Haga los 9 pasos completos y reporte en máximo 6 líneas.**

`<raiz>` = la carpeta del proyecto (la que contiene este `.claude/`). Es la raíz del repositorio. Los scripts se
corren con `node` desde cualquier carpeta: `node "<raiz>/.claude/skills/guardar/scripts/<script>.mjs"`.

## Qué archivo guarda qué

| Archivo | Qué lleva | Límite |
|---|---|---|
| `<raiz>/ESTADO.md` | La foto de HOY: dónde estamos, siguiente paso exacto (etapa/subetapa y qué lee Claude), etapas activas, a medias, pendientes por persona, preguntas abiertas, bloqueos, tablero de etapas, decisiones recientes y la bitácora. | Bitácora: 10 sesiones; las viejas van a `99. Archivo/BITACORA.md`. |
| `<raiz>/<etapa>/ESTADO.md` | Lo mismo, pero de UNA etapa y por subetapa. | Bitácora de la etapa: 10 entradas. |
| `<raiz>/<etapa>/LEEME.md` | Ficha de la etapa: objetivo, por qué importa, subetapas, cómo, skills con enlace, terminada cuando. | — |
| `<raiz>/<etapa>/<subetapa>/LEEME.md` | **Ficha de la subetapa** (objetivo, qué se entrega, terminada cuando, entra cuando, qué lee Claude para arrancar, **skills con su enlace**, cómo se trabaja, qué necesita del responsable, archivos de la carpeta con una línea cada uno). | — |
| `<raiz>/DECISIONES.md` | Registro completo de decisiones: fecha, decisión, por qué, dónde aplica. Solo se agrega al final; lo superado se marca ⚠️. | — |
| `<raiz>/CHANGELOG.md` | Una entrada por cada paso de `develop` a `main` (versión, fecha, qué entró, por qué, qué se verificó). | — |
| `<raiz>/CLAUDE.md` | SOLO contexto estable (qué es, roles, protocolo, ciclo, decisiones fijas, seguridad, GitHub, convenciones, mapa). **Nada que cambie por sesión.** Se toca solo si una decisión cambió una regla fija. | — |
| `00. Planeacion/06-herramientas-claude-code/catalogo-skills-urls.md` y `.json` | Toda skill o repositorio que se use lleva ahí su URL exacta. Si se instaló una nueva, se agrega. | — |
| `00. Planeacion/07-vision-producto/hoja-de-ruta.json` | La estructura de etapas y subetapas. Si cambia, se regenera el HTML. | — |

Regla de oro: **no duplicar**. El detalle vive en el ESTADO y el LEEME de la etapa; el ESTADO raíz lo resume y enlaza;
el CLAUDE.md no repite nada del estado (solo lo importa con `@ESTADO.md`).

## Pasos (en orden, sin saltarse ninguno)

### 1. Juntar los hechos de la sesión
1. Corra el detector (solo lee):
   ```
   node "<raiz>/.claude/skills/guardar/scripts/cambios_sesion.mjs"
   ```
   Da los archivos tocados desde el último guardado agrupados por etapa, qué `ESTADO.md` de etapa quedó
   desactualizado o falta, y el estado de git (rama, sin commit, sin subir).
2. Repase TODA la conversación (también lo anterior a una compactación: use el resumen). Saque:
   - **Hecho**: qué se terminó, con el archivo o la URL que lo prueba.
   - **A medias**: qué se empezó y no se terminó, en qué punto exacto quedó y qué falta.
   - **Decidido**: decisiones de las personas del proyecto, con fecha y el porqué.
   - **Pendiente** de cada persona ({{PERSONAS_LISTA}}) y **de Claude**.
   - **Preguntas abiertas**: lo que se preguntó y nadie contestó todavía.
   - **Siguiente paso exacto**: UNA acción concreta con la etapa/subetapa y los archivos que Claude lee para arrancarla.
     Nadie copia mensajes de arranque: solo se pregunta «¿con qué seguimos?».
   - **Skills usadas** en la sesión, con su enlace (van a la ficha de la subetapa y al catálogo si son nuevas).
   - **Bloqueos y avisos**: lo que falló, límites de uso, corridas a reanudar, procesos vivos.
   - **Archivos tocados**: los del detector más los de FUERA del proyecto.
3. No invente. Lo que no se pueda comprobar en disco se escribe «según el chat, sin verificar».

### 2. Actualizar la etapa tocada
- `ESTADO.md` de la etapa (si no existe, plantilla «ESTADO de etapa»): «Estado» (⚪ sin empezar · 🟡 en curso · 🟢
  terminada · 🔴 bloqueada · ⏸️ congelada), tabla de subetapas, «A medias», «Siguiente paso», bitácora arriba.
- **LEEME de la subetapa (ficha):** cada archivo creado o cambiado lleva una línea (nombre, qué es, para qué); la lista
  de **skills usadas con enlace** se actualiza; si la subetapa terminó, se marca y se dice con qué prueba. Lo que cambió
  de rumbo se tacha con una línea de por qué; no se borra.
- **Si se cerró un módulo que usan personas** (clientes, empleados, usuarios): confirmar que su SOP de uso existe en la
  carpeta de SOPs de la etapa de Operación. Si no existe, el módulo queda «a medias», no «terminado».
- `hoja-de-ruta.json`: si se agregó, quitó o renombró una subetapa, o cambió qué la da por terminada, se corrige ahí y
  se regenera el HTML con `node "<raiz>/.claude/skills/guardar/scripts/generar_hoja_de_ruta.mjs"` (nunca a mano).
- Skills nuevas en una ficha: `verificar_urls_github.mjs --agregar <url>` (comprueba en GitHub y la mete al catálogo) y
  `anotar_skills.mjs` (le pone «· instalada» o «· por instalar» a cada línea de skill).

### 3. Actualizar `<raiz>/ESTADO.md` y `<raiz>/DECISIONES.md`
- «Último guardado» (UNA línea: fecha y una frase), «Dónde estamos» (máx. 3 líneas), «Siguiente paso exacto»,
  «Etapas activas ahora», «A medias», pendientes por persona (borre los cumplidos y anótelos en la bitácora), «Preguntas
  abiertas», «Bloqueos y avisos», tablero de etapas (una línea por etapa con estado y enlace), «Decisiones recientes»
  (máx. 10).
- Entrada de bitácora ARRIBA: fecha, título de una línea, qué se hizo, archivos tocados, commit. Si pasa de 10, las
  viejas van a `99. Archivo/BITACORA.md` (arriba la más nueva).
- **DECISIONES.md:** cada decisión nueva de la sesión se agrega al final, numerada, con fecha, por qué y dónde aplica.
  Si una decisión vieja se cayó, se marca ⚠️ en su línea y se dice cuál la reemplaza.
- **Prohibido el encabezado que crece**: «Último guardado» es UNA línea; la historia va en la bitácora.

### 4. Revisar `<raiz>/CLAUDE.md` (solo lo estable)
- Si una decisión de hoy cambia una regla fija (roles, camino técnico, planes, reglas de datos o de seguridad, protocolo,
  convenciones, mapa de carpetas), cámbiela ahí y dígalo en la bitácora. Si no, NO lo toque.
- Si encuentra en el CLAUDE.md algo que cambia por sesión, muévalo a `ESTADO.md`. Si hay una contradicción entre los
  dos, corríjala y anótela.
- Confirme que sigue teniendo la línea `@ESTADO.md`.

### 5. Fuera del proyecto, solo si aplica
- Regla o preferencia nueva de la persona que sirve para siempre y fuera de este proyecto → memoria de Claude
  (revisando antes que no exista ya). Nunca el diario.
- **Nunca** escriba datos de personas reales, secretos, tokens ni contraseñas en ningún registro («ver gestor de
  secretos», no el valor).

### 6. Cerrar lo abierto y limpiar
- Cierre lo que siga corriendo y sea de esta sesión: servidores de desarrollo, navegadores de prueba, procesos de
  `node`, `python`, `ffmpeg` (nunca otras sesiones de Claude). Si algo debe seguir corriendo, anótelo en «Bloqueos y avisos».
- Rescate de la carpeta temporal lo que se va a reusar (un script, datos inventados): muévalo a la subetapa que
  corresponde y regístrelo en su LEEME. Borre el resto de temporales.

### 7. Verificar
1. `node "<raiz>/.claude/skills/guardar/scripts/cambios_sesion.mjs" --verificar` → tiene que decir
   **VERIFICACIÓN LIMPIA** (ninguna ruta rota en los registros, ningún archivo tocado sin registrar). Si avisa algo,
   corríjalo (o explíquelo en la bitácora si es a propósito) y vuelva a correrla.
   Y `node "<raiz>/.claude/skills/guardar/scripts/verificar_fichas.mjs"` → **FICHAS: LIMPIAS** (fichas completas, URLs
   del catálogo, rutas que existen, sin marcas `<<…>>` ni atribuciones).
2. **Cuente, no copie:** todo número que quede escrito se cuenta en el disco o en la fuente en ese momento.
3. Guarde el ESTADO.md raíz AL FINAL de todo, para que su fecha quede más nueva que la de los demás archivos.
4. Lea de corrido el ESTADO.md raíz como si fuera un chat nuevo sin memoria: ¿se entiende qué sigue sin preguntar nada?

### 8. Subir a GitHub (siempre, salvo «guardar sin subir»)
**Modo «sin subir»**: si la persona dice «guardar sin subir», si no hay remoto todavía y no hay OK para crearlo, o si
no hay red, en este paso se hacen 8.1 (sin crear el remoto), 8.2, 8.3, 8.4 y 8.5, y luego 8.8; 8.6 y 8.7 se saltan. Se
anota en «Bloqueos y avisos» del `ESTADO.md` («commit local sin subir: falta <el remoto / el OK / la red>») y se reporta
así. El siguiente `--inicio` lo va a recordar.

8.1. Si el proyecto no es un repositorio todavía: `git -C "<raiz>" init -b develop`. Si Git no tiene nombre y correo
   (`git config user.name` vacío) y la persona no está para darlos: `git -C "<raiz>" config user.name "<nombre del
   proyecto>"` y `user.email "<proyecto>@example.invalid"` (solo en este repositorio) y se anota en «Bloqueos y
   avisos» para que los cambie. Si no hay remoto y hay `gh` con sesión:
   `gh repo create <nombre-del-proyecto> --private --source "<raiz>" --remote origin` (con el OK de la persona la
   primera vez; después no se pregunta). Sin `gh` o sin OK: modo «sin subir».

8.2. Confirme la rama: `git -C "<raiz>" branch --show-current` debe decir `develop`. Si dice `main` o nada:
   `git -C "<raiz>" rev-parse --verify develop` → si no existe, `git -C "<raiz>" switch -c develop`; si existe,
   `git -C "<raiz>" switch develop`. (`main` solo recibe merges desde `develop`.)

8.3. `git -C "<raiz>" add -A`

8.4. `node "<raiz>/.claude/skills/guardar/scripts/revisar_secretos.mjs"` → debe decir **SECRETOS: LIMPIO**.
   Si bloquea, quite el secreto del archivo (y de la historia si ya se había subido) y vuelva a correrlo.

8.5. Commit con mensaje impersonal: primera línea `NN etapa/subetapa: qué cambió` (p. ej. `01 Fundacion/01-cuentas:
   cuentas de GitHub y hosting abiertas`); cuerpo opcional con 2-5 líneas de qué y por qué. **Sin `Co-Authored-By`,
   sin mencionar a Claude ni a nadie.** Para mensajes de varias líneas use `git -C "<raiz>" commit -F <archivo-temporal>`.

8.6. `git -C "<raiz>" push -u origin develop` (el `-u` deja la rama enlazada con GitHub; no estorba repetirlo). Si falla
   por red o por falta de remoto, anótelo en «Bloqueos y avisos» y repórtelo: el próximo `--inicio` lo va a avisar.

8.7. **Si en esta sesión algo pasó a producción**: la entrada de `CHANGELOG.md` se escribe y se commitea en `develop` →
   `git -C "<raiz>" switch main` (o `switch -c main` la primera vez) → `git -C "<raiz>" merge --no-ff develop` →
   `git -C "<raiz>" tag -a vX.Y.Z -m "vX.Y.Z"` → `git -C "<raiz>" push origin main --tags` → `git -C "<raiz>" switch develop`.
   Nunca sin la auditoría final limpia.

8.8. Corra el detector con `--inicio`: debe decir «OK: nada cambió…». Con remoto, además, «GitHub: rama develop al día
con origin». En modo «sin subir» sin remoto, el aviso esperado es «el repositorio es solo local», sin archivos sin
commit.

### 9. Reportar
A la persona, en máx. 6 líneas: qué archivos se tocaron, el siguiente paso (etapa/subetapa), los pendientes de cada
persona, si la verificación y la revisión de secretos salieron limpias, y el commit subido (hash corto y rama).

## Reglas de escritura (aplican a todo lo que esta skill escribe)

- **Impersonal y en tercera persona:** «Se decidió…», «Se actualizó…», «Quedó pendiente…». **Nunca «Claude hizo»,
  nunca «<nombre> dijo».** Se escribe para alguien que no estuvo en el chat. Sí se pueden asignar tareas futuras por
  persona («Activar la verificación en dos pasos: {{USUARIO}}»).
- **Fechas absolutas** (`{{FECHA}}`), nunca «ayer» ni «el lunes».
- Nada de «se arregló el error»; sí «se corrigió el cruce del archivo del banco que duplicaba pagos del mismo día».
- **Si algo escrito antes estaba mal, dígalo:** «⚠️ hasta el … decía X: era un error». No lo borre en silencio.
- **Lo que no se verificó es pendiente, no hecho.**
- **Sin secretos ni datos de personas reales** en ningún registro ni commit.
- **Rutas y archivos:** lo que EXISTE va entre acentos graves (`01. Fundacion/ESTADO.md`) y el verificador comprueba
  que exista; lo que todavía NO existe (un entregable futuro) va entre comillas angulares («veredicto.md»), nunca entre
  acentos graves. Al crearse el archivo, se pasa a acentos graves.
- **Skills:** solo con URL exacta del catálogo (`catalogo-skills-urls.json`). Una sub-skill dentro de un repositorio del
  catálogo se comprueba con `verificar_urls_github.mjs --agregar` antes de citarla.
- **Fichas:** `verificar_fichas.mjs` debe quedar en **FICHAS: LIMPIAS** antes de hacer commit.

## Al ABRIR un chat nuevo (Claude lo hace solo, sin que se lo pidan)

El `CLAUDE.md` del proyecto lo manda; se repite aquí para que la skill quede completa:
1. `ESTADO.md` ya viene cargado por el `@ESTADO.md` del CLAUDE.md. Léalo antes de responder.
2. Corra `cambios_sesion.mjs --inicio`. Si avisa cambios posteriores al último guardado o cambios sin subir a GitHub,
   una sesión cerró sin guardar: dígalo y ofrezca /guardar antes de seguir.
3. Lea el `ESTADO.md` de la etapa activa y el `LEEME.md` de la subetapa activa (o de la que la persona nombre).
4. Nombre el chat: `{{PROYECTO}} · NN Etapa · NN-subetapa`.
5. En la PRIMERA respuesta, aunque la persona pida otra cosa, el **guion de arranque** (escrito para quien no sabe nada
   de IA ni de apps): dónde vamos (máx. 3 líneas) · por qué importa esta etapa (el `por_que` de `hoja-de-ruta.json`) ·
   esta subetapa (objetivo, qué se entrega, terminada cuando) · **las skills de la subetapa con su enlace exacto**
   (`nombre — https://…`) y una línea de qué resuelve cada una aquí · pasos a seguir en orden (preguntas numeradas con
   respuesta recomendada; lo que Claude hace solo; qué valida la persona) · cómo se va a trabajar.
6. «Sigamos», «continúe», «¿con qué seguimos?» = el «Siguiente paso exacto» de ESTADO.md. «¿Cómo vamos en X?» = el
   ESTADO.md de esa etapa.

## Plantilla: ESTADO.md del proyecto

```markdown
# ESTADO — {{PROYECTO}}

**Último guardado:** <DD-mmm-AAAA> — <una frase>.

> Claude: esto se carga solo al abrir el chat (vía `@ESTADO.md` del CLAUDE.md). Úselo para arrancar sin pedir contexto.
> Se actualiza con /guardar. El detalle de cada etapa está en su propio `ESTADO.md`.

## Dónde estamos
<máx. 3 líneas>

## ▶️ Siguiente paso exacto
<una acción concreta> — etapa/subetapa: <ruta>; Claude lee: <archivos>; nombre del chat: <{{PROYECTO}} · NN Etapa · NN-subetapa>

## Etapas activas ahora
- <etapa → subetapa (quién)>

## A medias
- <qué> — quedó en <punto exacto>; falta <qué>. (`<ruta>`)

## Pendientes
{{PENDIENTES_PERSONAS}}
**De Claude (cuando se lo pidan):**
- [ ] <tarea>

## Preguntas abiertas
- <pregunta> — desde <fecha>.

## Bloqueos y avisos
- <límite, corrida a reanudar, proceso vivo, push pendiente>

## Tablero de etapas
| Etapa | Estado | Dónde va | Detalle |
|---|---|---|---|

## Decisiones recientes (máx. 10; todas en DECISIONES.md)
- <fecha> — <decisión>

## Bitácora (máx. 10; las viejas en `99. Archivo/BITACORA.md`)
### <DD-mmm-AAAA> — <título>
- Hecho: …
- Archivos: …
- Commit: <hash corto> en develop
```

## Plantilla: ESTADO de etapa

```markdown
# ESTADO — <Etapa>

**Estado:** <⚪/🟡/🟢/🔴/⏸️> <palabra> · **Último guardado:** <fecha> — <frase>
**Entra cuando:** <qué tiene que existir para empezar> · **Terminada cuando:** <qué la da por terminada>

## Subetapas
| Subetapa | Estado | Qué hay | Siguiente |
|---|---|---|---|

## A medias
## ▶️ Siguiente paso
## Pendientes (con dueño)
## Bitácora (máx. 10)
```

## Plantilla: LEEME de subetapa (ficha)

```markdown
# <NN. Etapa> / <NN-subetapa> — <Título>

**Objetivo:** <una frase>
**Qué se entrega:** <lista corta>
**Terminada cuando:** <criterio verificable>
**Entra cuando:** <qué tiene que existir antes>

## Qué lee Claude para arrancar
- <archivos de 00. Planeacion o de etapas anteriores>

## Skills (con enlace)
- <nombre> — <https://…>

## Cómo se trabaja
<los pasos del ciclo que aplican>

## Qué necesita del responsable
- <validación, firma, pago o credencial que solo esa persona puede dar>

## Archivos de esta carpeta
- `<archivo>` — qué es, para qué sirve.
```
