# Entrevista — las dos rondas

La entrevista sigue el método de la skill `grilling`: se pregunta en **rondas**, cada pregunta numerada y con una
respuesta recomendada, redactada para que un «sí» la acepte. Se pregunta toda la ronda de una vez y se espera la
respuesta. Lo que Claude pueda averiguar solo (si existe un dominio, qué cobra la competencia, qué exige la ley) no se
pregunta: se investiga en la fase 2.

Formato de cada pregunta:

```
❓ **P1 - <título corto>**: <la pregunta, en una o dos líneas, con opciones si las hay>
➡️ Recomendado: <la respuesta que Claude propone y por qué, en una línea>
```

Antes de la ronda, una línea: «Son N preguntas; puede contestarlas todas juntas o una por una. Si no sabe alguna, diga
"no sé" y seguimos con lo recomendado.»

Si el usuario ya contó parte de esto en su primer mensaje, no lo repita: escriba «Entendí esto: …» y pregunte solo lo
que falta.

## Ronda 1 — arranque (8 a 10 preguntas)

**P1 - Quién es usted.** ¿A qué se dedica y qué tanto ha hecho de esto antes: nunca ha construido nada, ya usó
herramientas sin código, o programa? *Para qué:* ajusta el tono, el camino técnico que se recomienda y cuánto se explica.
➡️ Recomendado: no hay respuesta correcta; con «nunca he construido nada» se asume el camino más simple y se explica todo.

**P2 - La idea en un párrafo.** ¿Qué hace el producto y qué problema resuelve? Como se lo contaría a un amigo.
*Para qué:* es lo único indispensable para investigar. No pida nombre, precio ni pantallas: salen después.
➡️ Recomendado: (ninguna; si la idea no está clara, UNA sola pregunta de desbloqueo: «¿qué le han pedido ayuda
últimamente, o qué le cuesta a la gente que usted sabe hacer?»).

**P3 - Para quién.** ¿Quién lo usaría y quién lo pagaría (a veces no es la misma persona)? ¿Son negocios o personas?
➡️ Recomendado: si la idea tiene un cliente que paga y un usuario final distinto (un gimnasio y sus socios, una escuela y
sus alumnos), se planifica para los dos desde el inicio.

**P4 - País, idioma y moneda.** ¿Dónde se va a vender primero y en qué idioma trabaja la gente?
*Para qué:* decide la lente legal, la de pagos y la moneda de todos los precios.
➡️ Recomendado: un solo país para arrancar; el resto se nombra como «después».

**P5 - Cómo gana plata.** ¿Suscripción mensual, pago único, comisión por transacción, gratis con plan pago, publicidad,
todavía no sé?
➡️ Recomendado: suscripción mensual al cliente que paga, sin cobrar al usuario final; el precio se decide con la
investigación, no hoy.

**P6 - Quién más está.** ¿Está solo o con socios? ¿Quién hace qué (construir, vender, operar) y cómo se reparten? ¿Cómo
quiere que se les nombre en los registros (nombre, apodo o rol)?
*Para qué:* define los roles del `CLAUDE.md`, si existe la etapa de Ventas y si hace falta una página de sociedad. El
nombre va tal cual a `proyecto.json` (`personas[].nombre`) y de ahí a frases como «<nombre> valida» y «De <nombre>:»;
si es un rol, con artículo («la Ingeniera», «el Profe», «la dueña»), nunca «Ingeniera» a secas.
➡️ Recomendado: si hay socios, una página de sociedad firmada antes de que exista código (va en la etapa 01).

**P7 - Qué existe ya.** ¿Nombre, dominio, redes, cuentas (GitHub, hosting, pasarela de pagos), diseño, código,
clientes esperando? ¿Con qué figura va a cobrar: como persona con actividad registrada, con una empresa, o todavía
ninguna (según el país: RFC en México, NIT en Colombia, cédula jurídica en Costa Rica)? Liste lo que haya, aunque sea
poco.
*Para qué:* la figura fiscal decide qué pasarela de pago le abre cuenta, cómo se verifica el negocio en Meta o WhatsApp
y si puede emitir facturas. Descubrirlo tarde detiene el lanzamiento.
➡️ Recomendado: lo que exista se registra; nada se rehace. Si no existe nombre, la lente 10 propone opciones con dominio
libre. Si no sabe su figura fiscal, se investiga en las lentes 5 y 6 y queda como pendiente suyo, para confirmar con un
contador.

**P8 - Tiempo y dinero.** ¿Cuántas horas por semana puede dedicarle y cuánto puede gastar por mes en herramientas
(Claude, hosting, dominio)? ¿Qué plan de Claude tiene?
*Para qué:* decide cuántos agentes se corren en paralelo, el stack (gratis o de pago) y el ritmo de las etapas.
➡️ Recomendado: con menos de 10 horas por semana se planifica un MVP más chico; con plan Pro de Claude los agentes van en
serie y de a pocos.

**P9 - Grabar o enseñar.** ¿Va a grabar el proceso, enseñárselo a alguien, o ninguna de las dos? *Para qué:* si sí, cada
chat arranca con un «guion de arranque» que explica por qué importa la etapa, pensado para leerse en cámara (graba) o
para que otra persona lo siga (enseña). En `proyecto.json` va `graba: "graba"`, `"ensena"` o `"no"`.
➡️ Recomendado: sí; el guion no estorba y deja el proyecto entendible para cualquiera que entre después.

**P10 - Cómo quiere que le hable.** ¿Usted o vos/tú? ¿Español neutro o el de su país? ¿Hay palabras del oficio que
quiere que se usen (las de su nicho, no las de programador)?
➡️ Recomendado: usted, neutro, y las palabras de su nicho en todas las pantallas y registros.

Guarde las respuestas en `00. Planeacion\01-entrevista\entrevista.md` con este formato:

```markdown
# Entrevista de arranque — <Nombre del proyecto o «sin nombre»>
Fecha: <DD-mmm-AAAA>

## Perfil
- Quién: … · Nivel: <nunca ha construido / sin código / programa>
- Tiempo: … h/semana · Presupuesto: … /mes · Plan de Claude: …
- Trato: … · Idioma: … · Graba o enseña: sí/no

## La idea
<tal como la contó, sin adornar>

## Para quién
…

## País, idioma y moneda
…

## Cómo gana plata
…

## Personas y roles
| Persona | Rol | Qué hace | Qué valida |
|---|---|---|---|

## Qué existe ya
…
- Figura fiscal para cobrar: <persona con actividad / empresa / ninguna todavía / no sabe>

## Lo que la entrevista dejó abierto (se resuelve con la investigación)
- …
```

Del perfil se derivan tres cosas que gobiernan el resto de la skill y se repiten en la memoria de trabajo:
**nivel técnico** (qué camino técnico se recomienda y cuánto se explica), **capacidad** (horas y plan: cuántos
agentes, qué tan chico el MVP) y **personas** (los roles del `CLAUDE.md`, quién valida qué, si hay Ventas).

## Ronda 2 — decisiones (después de la investigación y el Consejo, antes de la visión)

Aquí se cierran los supuestos que la investigación y el Consejo abrieron. Las preguntas salen de los reportes, no de
una lista fija, pero casi siempre son estas:

**D1 - Alcance del MVP.** De todo lo que la idea trae, ¿qué es lo mínimo que un cliente pagaría? Liste los módulos con
una línea cada uno y proponga cuáles entran en el MVP y cuáles van a la versión 2.
➡️ Recomendado: los 3-5 módulos que resuelven el dolor por el que paga el cliente; lo social, lo «lindo» y lo que depende
de integraciones no verificadas, a la versión 2.

**D2 - Camino técnico.** De las opciones de `03-arquitectura\opciones-tecnicas.md`, ¿cuál? Explique cada una en una
línea (qué cuesta, qué exige saber, qué tan lejos llega).
➡️ Recomendado: la opción que la lente técnica marcó para este perfil (normalmente: una web app instalable primero, un
solo proveedor de nube, apps de tienda después).

**D3 - Cómo se cobra.** Según la lente de pagos: ¿qué medios acepta en ese país y quién cobra (la plataforma o cada
cliente a su cuenta)?
➡️ Recomendado: la plataforma nunca toca la plata de los clientes de sus clientes; cada quien cobra a su cuenta; la
plataforma cobra solo su suscripción.

**D4 - Nombre y dominio.** Si no había nombre: las 3 opciones con dominio libre de la lente 10.
➡️ Recomendado: la primera (y por qué).

**D5 - Lo que el Consejo pidió cambiar.** Punto por punto: ¿acepta o rechaza? Cada respuesta queda en `DECISIONES.md`
con su porqué.
➡️ Recomendado: aceptar lo que achica el MVP y lo que señala un riesgo legal; rechazar lo que cambia la visión que el
usuario tiene clara (la visión del usuario manda).

**D6 - Reglas fijas.** Las reglas que no se reabren sin decisión expresa (por ejemplo: «nunca datos de salud en el feed»,
«nunca se toca la plata de los clientes», «web primero, apps nativas después»). Proponga 5-8 a partir de todo lo
anterior.
➡️ Recomendado: las propuestas, numeradas; el usuario tacha o agrega.

**D7 - Gestor de secretos.** ¿Dónde va a guardar contraseñas y llaves (1Password, Bitwarden, el del navegador)?
➡️ Recomendado: uno con bóveda compartida si hay socios; se anota en el `CLAUDE.md` y nunca se escribe un valor en el
proyecto.

Las respuestas de la ronda 2 se agregan al final de `entrevista.md` («## Ronda 2 — decisiones») y alimentan la visión
(fase 4), la hoja de ruta (fase 5) y `DECISIONES.md` (fase 6).
