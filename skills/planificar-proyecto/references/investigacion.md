# Investigación con agentes

La investigación reemplaza lo que una persona sin red de contactos no puede hacer: hablar con 20 clientes, pedir
precios a la competencia, leer la ley de su país. La hacen agentes con búsqueda web, uno por **lente**, y después un
agente adversarial intenta tumbar las afirmaciones de más peso. El resultado no decide el producto (la visión del
usuario manda): avisa de límites de mercado, legales y técnicos antes de que cuesten plata.

## Reglas para todos los agentes

- **Cada cifra con URL y la fecha en que se leyó** («leída el 4-nov-2026»; si la página muestra «actualizado el…»,
  también). Sin fuente, la cifra no se escribe.
- **Fuente primaria antes que secundaria**: la página de precios del competidor, el texto de la ley, la documentación
  oficial. Un blog de terceros se cita como tal y vale menos.
- **Lo que no se encontró se dice**: la sección «Vacíos» es obligatoria. Un reporte que dice «no encontré conversación
  real sobre esto» vale más que uno que la inventa.
- **Sin suavizar**: si la evidencia es mala para la idea, se escribe así. El Consejo necesita la verdad.
- **Presupuesto**: en serie por defecto; en paralelo solo si el usuario lo pidió y su plan lo aguanta; nunca más de 10
  agentes en total (lentes + verificación). Con plan Pro: 4-6 lentes en serie, 20 búsquedas por agente como tope. Si
  caben menos agentes que lentes, **se fusionan** (abajo, «Cuando el presupuesto no alcanza»): nunca se omite una
  lente que aplica sin decir en qué reporte quedó cubierta.
- **Escribir por partes**: cada agente crea el archivo con el encabezado y el «Resumen para decidir» en cuanto tiene
  algo, y va agregando secciones. Si la corrida se corta (límite de uso, red), lo escrito queda y el agente siguiente
  retoma desde la última sección en vez de repetir todo.
- **Nada de datos de personas**: ninguna cita con nombre completo de una persona particular; los foros se citan por
  el hilo, no por la persona.
- Cada agente recibe el perfil del usuario (nivel, país, presupuesto) y la idea tal como se contó; nunca recibe la
  conclusión que Claude espera.

## Las lentes

| # | Lente | Va siempre | Archivo |
|---|---|---|---|
| 1 | Competencia y precios | sí | `02-investigacion\competencia-y-precios.md` |
| 2 | Conversación real | sí | `02-investigacion\conversacion-real.md` |
| 3 | Disposición a pagar | sí | `02-investigacion\disposicion-a-pagar.md` |
| 4 | Tamaño y alcance | sí | `02-investigacion\tamano-y-alcance.md` |
| 5 | Legal y regulatorio del país | si hay datos de personas, pagos, salud, menores, educación o finanzas (casi siempre) | `02-investigacion\legal-<pais>.md` |
| 6 | Pagos y cobros en el país | si el producto cobra o permite cobrar | `02-investigacion\pagos-<pais>.md` |
| 7 | Opciones técnicas | sí | `03-arquitectura\opciones-tecnicas.md` |
| 8 | Herramientas y skills de Claude Code | sí | `06-herramientas-claude-code\catalogo-skills-urls.md` y `.json` |
| 9 | Fracasos y aprendizajes de la categoría | si la categoría tiene historia (apps sociales, marketplaces, SaaS para pymes) | `02-investigacion\fracasos-y-aprendizajes.md` |
| 10 | Nombre y dominio | solo si no hay nombre | `05-nombre-y-marca\opciones-de-nombre.md` |

Lentes que no aplican: se anotan en el `LEEME.md` de `02-investigacion\` como «no se corrió: <por qué>».

### Cuando el presupuesto no alcanza (fusión de lentes)

Un agente puede cubrir dos o tres lentes vecinas y escribir un archivo por lente (o uno solo con una sección por
lente, nombrado por la primera). Reparto recomendado:

| Agentes disponibles | Reparto |
|---|---|
| 6 o más | una lente por agente, empezando por 1, 2, 5, 7, 3, 4; luego 6, 9 |
| 4 | A = 1 + 3 (competencia, precios y disposición a pagar) · B = 2 + 4 + 9 (conversación real, tamaño, fracasos) · C = 5 + 6 (legal y pagos del país) · D = 7 (técnica) |
| 3 | A = 1 + 3 + 4 · B = 2 + 5 + 6 · C = 7 |
| 2 | A = 1 + 2 + 3 + 4 + 9 · B = 5 + 6 + 7 |
| 1 | todo en un reporte por secciones, con el tope de búsquedas repartido |

La lente 8 (herramientas) no necesita agente: el catálogo nace de las skills de `assets/hoja-de-ruta-base.json` y de
las que la lente técnica recomiende, y cada URL se comprueba con `verificar_urls_github.mjs` al crear la estructura.
La lente 10 (nombre) tampoco: tres o cuatro candidatos se comprueban a mano con `nslookup <dominio>` (si responde,
está tomado) y con el buscador de marcas del país. **Si no hay nombre, la lente 10 va primero**, antes que las demás,
porque la carpeta del proyecto se crea con ese nombre desde la fase 1 (puede ser un nombre de trabajo; si después
cambia, se renombra la carpeta y se anota en `DECISIONES.md`). El verificador adversarial sí es un agente aparte,
siempre; si solo cabe uno, se recorta a 3 afirmaciones.

### Prompt base (se adapta a cada lente)

```
Usted investiga para un proyecto nuevo. Idea: <la idea tal como la contó el usuario>. Cliente que paga: <…>.
Usuario final: <…>. País: <…>. Idioma: <…>. Moneda: <…>. Perfil de quien construye: <nivel técnico, horas/semana,
presupuesto/mes>.

Su lente: <nombre y pregunta de la lente>.

Reglas: cada cifra con URL y fecha de lectura; fuente primaria antes que secundaria; si no encuentra algo, dígalo en
«Vacíos»; sin suavizar; máximo <N> búsquedas; no copie textos largos de las fuentes (una cita de ≤15 palabras por fuente,
entre comillas y con atribución); ninguna cita con nombre de una persona particular.

Escriba el reporte en <ruta del archivo>, en <idioma>, con esta estructura exacta. Cree el archivo con el encabezado y el
«Resumen para decidir» en cuanto tenga los primeros hallazgos y agregue las secciones conforme avance (si la corrida
se corta, lo escrito tiene que servir para retomar):

# <Lente> — <nombre del proyecto>
Fecha: <hoy> · Búsquedas: <n> · Fuentes primarias: <n>

## Resumen para decidir (máx. 8 líneas)
## Hallazgos
<tablas y listas; cada fila con fuente y fecha>
## Las 2 afirmaciones de más peso de esta lente
- [peso 1-10 · confianza alta/media/baja] <afirmación verificable en una frase>
## Vacíos
## Fuentes
<una por línea: URL · qué es · fecha de lectura>

Termine devolviendo solo: la ruta del archivo, las 2 afirmaciones de más peso y los vacíos.
```

### Qué pregunta cada lente

1. **Competencia y precios.** Quién vende algo parecido (global, regional y en el país): nombre, qué hace, precio público
   por tramo, a quién le vende, señales de tamaño (clientes, reseñas, empleados). Tabla comparativa. Qué NO hace ninguno.
2. **Conversación real.** Dónde habla la gente del problema sin que nadie pregunte: foros, Reddit, grupos, reseñas de
   la competencia (las de 1-2 estrellas son oro), comentarios. Frases cortas del problema, con qué frecuencia aparece, en
   qué palabras lo nombran (esas palabras van a las pantallas).
3. **Disposición a pagar.** Evidencia de que ya se paga por algo parecido: precios activos, membresías, servicios con
   tarifa. Distinguir «hay mucho contenido gratis» (mala señal) de «hay negocios cobrando» (buena señal). Rango de precio
   defendible en la moneda del país.
4. **Tamaño y alcance.** Cuántos clientes potenciales hay en el país (fuentes oficiales, cámaras, directorios), dónde se
   concentran, por qué canal se les llega. Un cálculo honesto de «si el 1 % paga X, eso es Y al mes».
5. **Legal y regulatorio.** La ley de datos personales del país (nombre, número, autoridad, qué exige: consentimiento,
   derechos, datos sensibles), facturación electrónica, protección al consumidor (reembolsos, retracto), lo específico
   del nicho (salud, menores, educación, finanzas, alimentos), términos y privacidad obligatorios. Todo con el texto
   oficial como fuente. Marcar «esto lo revisa un abogado del país antes de lanzar».
6. **Pagos y cobros.** Qué medios usa la gente en el país (tarjeta, transferencia inmediata, billeteras, efectivo), qué
   pasarelas operan ahí y qué cobran, si Stripe abre cuentas en ese país, qué exige el banco, qué pasa con impuestos. Si
   el producto permite que sus clientes cobren a terceros: cómo hacerlo sin que la plataforma toque esa plata.
7. **Opciones técnicas.** Dos o tres caminos para construir ESTE producto con ESTE perfil: (a) el más simple que llega a
   producción (una web app instalable, un proveedor de nube, una base de datos), (b) uno intermedio, (c) uno si el
   producto exige apps de tienda, tiempo real o IA. Para cada uno: costo mensual con fuente, qué hay que saber, límites,
   qué skills de Claude Code lo cubren. Una recomendación clara para este usuario y por qué. Documentación oficial como
   fuente.
8. **Herramientas y skills.** Skills, plugins y repositorios de Claude Code útiles para cada etapa de este proyecto
   (planeación, diseño, backend, seguridad, frontend, pruebas, despliegue, marketing). Preferir marcas reconocidas
   (Anthropic, Cloudflare, Stripe, Trail of Bits, Microsoft, Vercel) y repositorios con actividad reciente y licencia.
   **Cada URL se comprueba con `gh api repos/<owner>/<repo>`** (existencia, estrellas, última actualización, licencia);
   sin `gh`, se marca «sin comprobar». Salida: `catalogo-skills-urls.json` (lista de `{nombre, url, tipo, etapas,
   origen, comprobada}`) y el `.md` con la tabla y el total contado.
9. **Fracasos y aprendizajes.** Productos de la categoría que cerraron o pivotaron, y por qué (fuentes: post-mortems,
   notas de prensa, foros). Qué patrón se repite. Qué hizo distinto el que sobrevivió.
10. **Nombre y dominio.** Si no hay nombre: 10 candidatos cortos, pronunciables en el idioma, sin marca registrada
    evidente (búsqueda en el registro de marcas del país y en USPTO/EUIPO si vende fuera), con dominio `.com` o uno
    razonable libre (comprobado con `whois`/`nslookup` o el registrador) y usuario libre en las redes que importan. Tres
    finalistas con el porqué.

## Verificación adversarial (un agente, después de las lentes)

Tome las 5 afirmaciones de más peso entre todas las lentes (máx. 2 por lente) y mande UN agente con este encargo:

```
Su trabajo es intentar REFUTAR cada una de estas afirmaciones con fuentes primarias. Para cada una: busque evidencia en
contra, revise si la fuente original dice lo que el reporte dice, compruebe fechas y vigencia, y dé veredicto:
CONFIRMADA (se sostiene tal cual) · CORREGIDA (se sostiene con cambios; escriba la versión correcta) · REFUTADA (no se
sostiene; diga qué es cierto). Para cada veredicto: versión correcta, evidencia (fuentes con fecha), e impacto en el
proyecto (qué cambia de la idea, del precio, del alcance o de la técnica). Máximo <N> búsquedas. Escriba en
<02-investigacion\_verificaciones.md>: primero el encabezado con las 5 afirmaciones, y cada veredicto se agrega al
archivo apenas esté (no espere a tener los cinco).
```

Formato del archivo:

```markdown
# Verificaciones — afirmaciones decisivas (<fecha>)
## Las 5 afirmaciones elegidas
- [<lente> · peso <n> · confianza <…>] <afirmación>
## Veredictos
### <CONFIRMADA|CORREGIDA|REFUTADA> — <afirmación corta>
- **Versión correcta:** …
- **Evidencia:** … (fuentes con fecha)
- **Impacto:** …
## Lo que quedó sin verificar
```

## Cómo se presenta al usuario

Nada de pegarle los reportes. Un resumen de 10-15 líneas, sin jerga, con:

1. Las 3 cosas que la investigación confirmó a favor de la idea (con la cifra más fuerte de cada una).
2. Las 3 cosas que juegan en contra o que hay que resolver (legal, pagos, técnica), con la fuente.
3. Lo que se corrigió o se refutó en la verificación, en una línea cada una.
4. El camino técnico recomendado para su perfil y cuánto cuesta por mes.
5. Qué sigue: el Consejo.

Los archivos quedan en `00. Planeacion\02-investigacion\` (y `03-arquitectura\`, `05-nombre-y-marca\`,
`06-herramientas-claude-code\`), cada carpeta con su `LEEME.md` que lista los archivos con una línea cada uno.
