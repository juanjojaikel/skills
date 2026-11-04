# {{PROYECTO}} — Contexto del proyecto

> Claude carga este archivo automáticamente al iniciar cualquier chat en esta carpeta, y con él el estado vivo:

@ESTADO.md

> Este archivo lleva SOLO lo estable (qué es, roles, reglas, decisiones, mapa). Lo que cambia por sesión (dónde vamos,
> siguiente paso, pendientes, bitácora) vive en `ESTADO.md` y en el `ESTADO.md` de cada etapa. Los actualiza **/guardar**.

## Qué es este proyecto

**{{PROYECTO}}**: {{DESCRIPCION}}

- **Fuente de verdad del producto:** `00. Planeacion/07-vision-producto/vision-producto.html` (qué y por qué) y
  `00. Planeacion/07-vision-producto/hoja-de-ruta.json` / `hoja-de-ruta.html` (etapas, subetapas, skills, cuándo se
  termina cada una). La investigación (`00. Planeacion/02-investigacion/`) y el Consejo (`00. Planeacion/04-consejo/`)
  avisan de límites; no deciden el producto.
- **La visión en una línea:** <<el producto en una frase: para quién, qué hace, qué pasa solo, cómo se cobra; y el corte
  MVP / V2 / V3 por etapas>>
- **Idioma de trabajo:** {{IDIOMA}}. **Se graba o se enseña:** {{GRABA}}

## Personas y roles

| Persona | Rol | Qué hace | Qué valida |
|---|---|---|---|
{{PERSONAS_TABLA}}

Regla de fondo: **{{USUARIO}} valida; Claude hace el trabajo.** Nunca se le pide a una persona algo que Claude pueda
averiguar o hacer solo; se le pide solo lo que exige su criterio, su firma, su contraseña o su tarjeta.

## Protocolo de cada chat (OBLIGATORIO)

**Un chat por subetapa.** La persona abre un chat y pregunta («¿con qué seguimos?», «¿cómo vamos en X?», «sigamos con Y»).
Nunca copia mensajes de arranque ni dice qué archivo leer: eso lo resuelve Claude.

1. **Correr** `node ".claude/skills/guardar/scripts/cambios_sesion.mjs" --inicio` desde la raíz del proyecto. Si avisa
   cambios después del último guardado o cambios sin subir a GitHub, una sesión cerró sin guardar: decirlo y ofrecer
   /guardar antes de seguir.
2. **Leer** `ESTADO.md` (ya cargado) → etapa y subetapa activas → el `ESTADO.md` de esa etapa y el `LEEME.md` de la
   subetapa (su ficha: objetivo, qué se entrega, cuándo está terminada, skills con enlace, qué lee Claude para arrancar).
3. **Nombrar el chat** (si la herramienta lo permite): `{{PROYECTO}} · NN Etapa · NN-subetapa`.
4. **Primera respuesta = el guion de arranque**, siempre, aunque la persona pida otra cosa. Se escribe para alguien que
   **no sabe nada de IA, de apps, de programar ni de marca**, sin jerga, en este orden:
{{GUION}}
   Las skills van siempre con su enlace exacto (`nombre — https://…`, del LEEME de la subetapa o del catálogo
   `00. Planeacion/06-herramientas-claude-code/catalogo-skills-urls.md`) y una línea de qué problema resuelve cada una aquí.
   Las preguntas a la persona van numeradas y con respuesta recomendada, para que las conteste todas de una vez.
5. **Skills:** se usan las de la ficha; si existe una de una marca reconocida para esa tarea (Anthropic, Cloudflare,
   Stripe, Trail of Bits, Microsoft, Vercel…), esa. Antes de instalar una skill o repositorio nuevo: revisar su código
   (secretos, descargas, telemetría), instalarla y anotarla en el catálogo con su URL.
6. **Al cerrar** la subetapa, o cuando la persona diga «guardar», «cerremos», «terminamos por hoy»: **/guardar**
   (`.claude/skills/guardar/SKILL.md`). Termina con commit y push a GitHub.
7. «Sigamos» / «continúe» / «¿con qué seguimos?» sin más = el «Siguiente paso exacto» de `ESTADO.md`.
8. **Sin fechas ni atrasos.** El proyecto no tiene calendario: ninguna etapa «tenía que» estar lista en una fecha y
   nunca se dice «vamos atrasados». Cada etapa termina cuando su resultado existe y se verificó. Las únicas fechas que
   se escriben son las de lo que ya pasó.
9. **Al cerrar un módulo que usan personas** (clientes, empleados, usuarios finales): antes de /guardar se escribe el
   **SOP de uso** del módulo (una pregunta por SOP, pasos literales, pantallazos de la app con datos inventados) en la
   carpeta de SOPs de la etapa de Operación. Sin SOP el módulo no está terminado.
10. **Presupuesto:** una ventana pesada de Claude a la vez, agentes en serie, ≤10 agentes por investigación salvo pedido
    expreso; cada sesión se termina en una sola corrida. <<modelo y plan de Claude que se usa>>

## Ciclo de trabajo

- **Módulos con código** (ciclo de 8 pasos):
{{CICLO_MODULO}}
- **Sin código:**
{{CICLO_NO_CODIGO}}
- Lo que no se verificó es pendiente, no hecho. Una ventana pesada de Claude a la vez.
{{LINEA_CODIGO}}

## Decisiones fijas (no se reabren sin decisión expresa de {{USUARIO}})

<<las reglas fijas de la visión §11, numeradas: p. ej. 1. Web app primero, apps nativas después. 2. Un solo proveedor
de nube. 3. La plataforma nunca toca la plata de los clientes de sus clientes. 4. Datos sensibles cifrados y con
consentimiento. 5. Todo lo que se pueda automatizar, se automatiza. …>>

## Seguridad

- **Secretos**: solo en el gestor de secretos (<<cuál>>) o en el almacén de secretos del proveedor de nube. En los
  registros se escribe «gestor de secretos → {{PROYECTO}}/<cuenta>», nunca el valor; nunca en el repositorio.
  `.claude/skills/guardar/scripts/revisar_secretos.mjs` corre antes de cada commit.
- **Datos de personas reales: NUNCA** en esta carpeta, en Claude ni en pruebas; solo datos inventados (sintéticos).
  <<la ley de datos personales del país y qué exige, de la lente legal>>
- **Dependencias**: versiones fijadas, archivo de bloqueo, revisar quién publica, auditoría antes de cada merge,
  parches críticos en ≤48 h.
- **Dos momentos por módulo**: análisis de ataques antes de escribir código; auditoría de seguridad + limpieza de
  código al terminar. Con herramientas de marcas reconocidas.

## GitHub (todo el proyecto, siempre)

- Repositorio **privado** `{{REPO}}`; la raíz del repositorio es esta carpeta. Todo lo que se produce (etapas, notas,
  decisiones, investigación, código) vive ahí, para que cualquiera que entre después vea cómo se hizo todo.
- Ramas: **`develop`** = trabajo diario; **`main`** = producción. Nunca se trabaja directo en `main`.
- **Pasar a producción** = merge `develop` → `main` + etiqueta `vX.Y.Z` + entrada en `CHANGELOG.md` (qué entró, cuándo,
  por qué).
- **/guardar termina con** `git add -A` → `revisar_secretos.mjs` → commit → push a `develop`. Mensaje del commit:
  `NN etapa/subetapa: qué cambió`, impersonal. **Sin `Co-Authored-By` ni menciones a Claude.**
- Nada se borra: lo superado va a `99. Archivo/` con un LEEME que dice por qué.

## Convenciones de escritura

- **Registros** (ESTADO, LEEME, DECISIONES, CHANGELOG, commits, actas, bitácoras): impersonales y en tercera persona:
  «Se decidió…», «Se actualizó…», «Quedó pendiente…». **Nunca «Claude hizo», nunca «<nombre> dijo».** Escritos para
  alguien que no estuvo. Fechas absolutas (`{{FECHA}}`). Ningún número sin fuente y fecha; lo no verificado se marca
  «no verificado». Si algo escrito antes estaba mal, se dice («⚠️ hasta el … decía X: era un error»), no se borra.
- **Conversación con la persona:** <<trato (usted/tú/vos), variante del idioma, vocabulario del nicho que se usa en
  pantallas y registros>>, sin jerga técnica innecesaria.
- **Entregables para personas = HTML navegable con rutas copiables**; los `.md` son materia prima. SOPs literales.
- Cierre obligatorio de cada sesión: cerrar procesos que la sesión dejó corriendo (servidores, navegadores de prueba).

## Mapa de carpetas

- `ESTADO.md` — estado vivo. `DECISIONES.md` — registro completo de decisiones (se agrega, nunca se borra).
  `CHANGELOG.md` — versiones en producción. `README.md` — presentación del repositorio. `proyecto.json` — nombre,
  personas y carpeta de código (lo leen los scripts).
- `.claude/skills/guardar/` — la skill propia del proyecto: `SKILL.md` y seis scripts en `scripts/` (`cambios_sesion`,
  `revisar_secretos`, `verificar_fichas`, `verificar_urls_github`, `anotar_skills`, `generar_hoja_de_ruta`).
{{MAPA}}
