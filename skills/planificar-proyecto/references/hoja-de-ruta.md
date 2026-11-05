# La hoja de ruta

La hoja de ruta ordena el proyecto **por construcción**, no por fases de venta ni por calendario: primero lo que todo
lo demás necesita (cuentas, entornos, base técnica, seguridad), después los módulos uno por uno, después la landing y
el lanzamiento, y al final las versiones siguientes. Cada etapa tiene un «entra cuando» (qué tiene que existir antes)
y un «terminada cuando» (un resultado verificable, nunca una fecha). Cada subetapa es **una carpeta y un chat**.

`assets/hoja-de-ruta-base.json` es la plantilla. **Se adapta a cada proyecto; nunca se copia tal cual.** La primera
subetapa de la etapa 01 trae llenos todos los campos de ficha, como ejemplo de lo que se espera en las demás.

## Esquema del JSON

```json
{
  "version": "AAAA-MM-DD",
  "proyecto": "Nombre",
  "fuente": "vision-producto.html (aprobada el DD-mmm-AAAA)",
  "personas": [{"nombre": "…", "rol": "…"}],
  "carpeta_codigo": "14. Codigo",
  "ciclo_modulo": ["paso 1", "…"],
  "ciclo_no_codigo": ["paso 1", "…"],
  "guion_de_arranque": ["bloque 1", "…"],
  "etapas": [
    {
      "n": "01",
      "carpeta": "01. Fundacion",
      "titulo": "Fundación",
      "objetivo": "una frase",
      "por_que": "para alguien que no sabe nada: qué se construye, qué pasa si se salta, qué se tiene al terminar",
      "entra": "qué tiene que existir antes",
      "terminada": "resultado verificable",
      "como": ["cómo se trabaja en esta etapa", "…"],
      "vision": "§3 roles y §6 módulos (las secciones de la visión que esta etapa usa)",
      "subetapas": [
        {
          "carpeta": "01-cuentas-y-accesos", "titulo": "Cuentas y accesos",
          "descripcion": "qué se entrega, con detalle",
          "entra": "qué tiene que existir antes",
          "objetivo": "una frase: qué queda resuelto al terminar",
          "terminada": "criterio verificable: qué archivo, pantalla o prueba existe",
          "vision": "§… (secciones de la visión que esta subetapa usa)",
          "lee": ["`00. Planeacion/02-investigacion/legal-<pais>.md`", "«flujos.md» de la subetapa 03/02 (cuando exista)"],
          "skills": [{"nombre": "…", "url": "https://…"}],
          "como": ["paso 1 del ciclo aplicado a esta subetapa", "…"],
          "necesita": ["la contraseña de X la escribe la persona", "…"]
        }
      ],
      "skills": [{"nombre": "…", "url": "https://…"}]
    }
  ]
}
```

- `n` es el prefijo de la carpeta (dos dígitos) y define el orden. `carpeta` lleva `NN. Nombre` (con punto y espacio);
  las subetapas llevan `NN-nombre-en-minusculas` sin espacios ni tildes.
- `personas` alimenta el `CLAUDE.md` (roles) y el verificador de fichas (las atribuciones «<nombre> dijo» se bloquean).
- `carpeta_codigo` dice qué carpeta se mira con git y no por fecha de archivo; si el producto no lleva código, se omite.
- `skills` solo con URL comprobada (fase 2, lente 8) y presente en el catálogo; `verificar_fichas.mjs` rechaza URLs de
  GitHub que no estén ni en el JSON ni en el catálogo. Las `skills` de una subetapa son el subconjunto que usa; si la
  subetapa no trae `skills`, hereda todas las de la etapa (y la ficha queda larga: mejor ponerlas).
- **Los campos por subetapa `objetivo`, `terminada`, `vision`, `lee`, `skills`, `como` y `necesita` alimentan la
  ficha** (`LEEME.md`) que `crear_estructura.mjs` escribe: con ellos completos, el script deja las fichas listas y casi
  sin marcas `<<…>>`. Sin ellos, cada ficha queda con 5-6 marcas y hay que llenar 60 archivos a mano. Por eso la hoja
  de ruta se escribe completa en la fase 5, subetapa por subetapa, antes de crear la estructura. En `lee`, lo que ya
  existe va entre acentos graves y lo que todavía no existe entre «comillas angulares» (regla 8 de escritura).
- La etapa 00 no necesita esos campos: el script la llena como referencia. Si una subetapa de la 00 los trae, se usan.
  Si a una subetapa le falta `entra`, hereda el de su etapa.

## Cuando el presupuesto no alcanza para detallar todo

Escribir el JSON es lo más largo de la fase. Se guarda al terminar cada etapa, para retomar desde ahí si hay un corte.

| Presupuesto | Cómo se escribe |
|---|---|
| Holgado (plan Max o API) | Un agente en serie por etapa; recibe la visión, la etapa base y el JSON hasta ahí |
| Justo (plan Pro) | Lo escribe Claude en el chat principal, o en bloques: 01-03 · 04-06 · 07-09 · 10-14, un agente por bloque |
| Cerca del límite de uso | Primero 01, 02 y 07, que son lo más propio del proyecto. Las demás quedan con sus campos base |

Nunca más de 10 agentes. Lo que quede corto se le dice al usuario y sus marcas se ven al crear la estructura: la
verificación final no pasa hasta completarlas.

## Revisar el orden antes de aprobar

`generar_hoja_de_ruta.mjs` lee cada `entra` y entiende `07/01`, `etapa 07`, `etapas 04 a 06`, `07. Nombre` y
`04-entornos`. Da problema si se cita algo que no existe (una etapa que se quitó) o si hay un círculo (A espera a B y B
espera a A), y avisa cuando una subetapa espera a otra de número mayor, que puede ser a propósito. Solo sigue lo que
lleva número: «cuando los módulos estén» no le dice nada, «cuando la etapa 07 esté» sí. Entre subetapas de la misma
etapa basta «después de las pantallas»; lo que cruza de etapa va con número. Una subetapa hereda el `entra` de su etapa;
si no debe esperarlo, se escribe «sin esperar la etapa 07» en su propio `entra`.

Un script no ve el sentido de las cosas. Lea los `entra` de corrido y pregúntese, para cada uno, qué se rompe si esto va
antes o después:

- **Medir antes de cambiar:** la línea base de un dato (ausencias, ventas, tiempo perdido) se toma antes de encender lo
  que debería mejorarlo. Si no, nunca se podrá probar que mejoró.
- **Probar antes de construir encima:** lo que una prueba de concepto puede tumbar no se diseña antes de su veredicto.
- **Permiso antes de datos:** el consentimiento y lo legal van antes del primer dato real, no antes del lanzamiento.
- **Cuenta antes de lo que la usa:** la subetapa que usa una cuenta, un dominio o un número espera a quien lo abre, y
  algunas aprobaciones de terceros tardan semanas.

## Las etapas base y cómo se adaptan

| N | Etapa | Qué es | Se adapta así |
|---|---|---|---|
| 00 | Planeación | Referencia: entrevista, investigación, arquitectura, consejo, nombre, herramientas, visión | Siempre; se marca terminada al crear la estructura |
| 01 | Fundación | Cuentas, dominio y marca, sociedad, entornos | «Sociedad» solo si hay socios; «dominio» solo si hay web; «entornos» solo si hay código |
| 02 | Pruebas de concepto | Una subetapa por cada «lo que hay que verificar» de la visión (§14) | Se generan desde la visión; si no hay riesgos, la etapa se omite y se dice por qué |
| 03 | Diseño UX/UI | Mapa de pantallas, sistema de diseño, prototipo, textos | Siempre que haya pantallas |
| 04 | Base técnica (backend) | Modelo de datos, API, inicio de sesión, archivos y correos | Solo con código; los nombres de las subetapas siguen el camino técnico elegido |
| 05 | Seguridad base | Análisis de ataques, endurecimiento, pruebas de seguridad | Solo con código; obligatoria si hay datos de personas |
| 06 | Base visual (frontend) | Base de la app, navegación, componentes, instalable/móvil | Solo con código |
| 07 | Módulos del MVP | Una subetapa por módulo marcado MVP en la visión (§6), en orden de dependencia | Se generan desde la visión; cada módulo termina con su SOP de uso |
| 08 | Landing y alta | Landing, alta/onboarding sin intervención humana, textos, legal y consentimiento | «Legal y consentimiento» va siempre que haya datos de personas |
| 09 | Lanzamiento del MVP | Piloto con clientes reales, producción y monitoreo, soporte, métricas, versión 1.0 | Siempre; el gate es por resultado (p. ej. «N clientes pagando») |
| 10 | Versión 2 | Los módulos V2 de la visión | Se generan desde la visión |
| 11 | Versión 3 en adelante | Lo que la visión dejó para después (apps de tienda, integraciones, otros países) | Puede quedar con una sola subetapa «por definir» |
| 12 | Ventas | Pipeline, guiones, material, seguimiento | Solo si hay quien venda (una persona con ese rol); si no, se omite |
| 13 | Operación | Onboarding de clientes, soporte, métricas, finanzas, SOPs y centro de ayuda | Siempre; «SOPs y centro de ayuda» es donde cae el SOP de cada módulo |
| 14 | Código | El código, dentro del mismo repositorio, con su propio `CLAUDE.md` | Solo con código |
| 99 | Archivo | Lo superado, con LEEME de por qué | Siempre |

Si el producto **no lleva código** (un curso, una comunidad, una plantilla), se quitan 04-06 y 14, la 07 se vuelve
«Producción del producto» con una subetapa por pieza, y la 03 se vuelve «Diseño» a secas. Se dice en el `LEEME.md` de
`00. Planeacion\07-vision-producto\` qué se quitó y por qué.

Si se quita una etapa, **no se renumeran las demás**: los números fijan el orden de construcción y las referencias
cruzadas (`07/03`) tienen que seguir valiendo. La etapa ausente se anota en la tabla del `ESTADO.md` raíz como
«no aplica: <por qué>». Tampoco se renumera cuando el orden real difiere un poco del base (p. ej. la landing para
vender a terceros va después del piloto, no antes): el orden lo fija el «entra cuando» de cada etapa, no el número.

## El «por qué importa» de cada etapa

Es obligatorio y se escribe para alguien que no sabe nada de apps. Tres cosas en tres o cuatro líneas: qué se construye
en esta etapa, qué pasa si se salta (un problema legal, una app que se ve hecha con IA, una función que falla, datos
expuestos, plata perdida) y qué se tiene en la mano al terminar. Es lo que Claude lee en el guion de arranque de cada
chat.

## Los ciclos de trabajo

- **Módulos con código** (ciclo de 8 pasos): 1 PRD del módulo con preguntas numeradas y respuesta recomendada (el usuario
  aprueba antes de que se escriba código) → 2 análisis de ataques del módulo → 3 pruebas escritas antes del código →
  4 construcción (ventana A) → 5 revisión (ventana B: un chat o agente que no escribe código, abre la app y devuelve lo
  que falla; máx. 3 rondas) → 6 auditoría de seguridad y limpieza → 7 SOP de uso del módulo → 8 `/guardar` y GitHub.
- **Sin código**: 1 plan corto y OK (con preguntas numeradas si hay decisiones abiertas) → 2 ejecutar → 3 verificar (lo
  que no se verificó es pendiente) → 4 `/guardar`.

Ambos van en el JSON (`ciclo_modulo`, `ciclo_no_codigo`) y de ahí al `CLAUDE.md` y a cada ficha.

## El guion de arranque

Lo que Claude escribe como primera respuesta de cada chat del proyecto (va en `guion_de_arranque` del JSON y en el
`CLAUDE.md`): dónde vamos (máx. 3 líneas) · por qué importa esta etapa (el `por_que`) · esta subetapa (objetivo, qué se
entrega, terminada cuando) · skills con enlace exacto y una línea de qué resuelve cada una · pasos a seguir (lo que
Claude necesita del usuario como preguntas numeradas con respuesta recomendada; lo que Claude hace solo; qué valida el
usuario al final y cómo) · cómo se va a trabajar (los pasos del ciclo que aplican). Si el usuario dijo que graba o
enseña, se escribe para leerse en cámara, para alguien que no sabe nada; si no, igual de claro pero más corto.

## Generar el HTML y aprobar

```
node "<raiz>/.claude/skills/guardar/scripts/generar_hoja_de_ruta.mjs"
```

(si la estructura todavía no existe, el mismo script está en `assets/guardar/scripts/` de esta skill y acepta
`--json <ruta>` y `--html <ruta>`). El HTML trae cada etapa desplegable con su porqué, subetapas, cómo, skills con
botón «copiar enlaces» y terminada cuando. Se le pide al usuario que lo abra y diga qué cambia; se corrige el JSON (nunca
el HTML a mano) y se regenera, hasta «aprobado».
