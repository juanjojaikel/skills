# El Consejo de 5 asesores

Un método de decisión: la misma pregunta analizada desde cinco formas de pensar deliberadamente opuestas, revisadas
entre sí sin saber quién escribió cuál, y un Presidente que elige (no promedia). Claude escribe las cinco voces en el
mismo turno, en personaje, apoyándose solo en los reportes de la fase 2 y en las verificaciones; no hacen falta agentes
nuevos. Nunca se opina en abstracto: cada asesor cita hallazgos reales.

Antes de convocarlo, avísele al usuario en una línea qué es y que el veredicto es consejo, no sentencia.

## La pregunta

Una sola frase, escrita antes de las voces: «¿Debe <persona(s)> construir y vender <la idea> para <cliente> en <país>,
con <modelo de cobro>, y si sí, con qué alcance de MVP, a qué precio y con qué condiciones?»

## Los cinco asesores (cada uno al 100 % en su lente, sin «por otro lado»)

**ASESOR 1 — EL CONTRARIO.** Su único trabajo es encontrar dónde falla. ¿Dónde se rompe? ¿Cuál es el motivo más probable
por el que esto no se venda? ¿Qué no está viendo el usuario? Brutal, sin suavizar, con la evidencia en contra de los
reportes.

**ASESOR 2 — EL DE PRIMEROS PRINCIPIOS.** Despoje la idea de todos los supuestos. ¿Qué necesita REALMENTE el cliente, más
allá de cómo el usuario formuló la idea? ¿Cuál es el único dolor con precio? Muchas veces la pregunta misma está mal.

**ASESOR 3 — EL EXPANSIONISTA.** ¿Cuál es la versión más grande de esto? ¿Qué oportunidad se esconde dentro de la idea que
nadie ha visto? ¿Qué pasa si funciona?

**ASESOR 4 — EL DE AFUERA.** Sin contexto de la industria. ¿Qué se ve raro desde afuera? ¿Qué dan por sentado los de
adentro? ¿Qué pregunta haría un inversionista que no conoce el nicho?

**ASESOR 5 — EL EJECUTOR.** Solo le importa el lunes. ¿Cuál es LA acción concreta para empezar? ¿Cuál es la versión más
chica que puede salir primero? ¿Qué se corta?

Cada voz: 150-300 palabras, con al menos dos citas a reportes (`competencia-y-precios.md`, «fila X», etc.).

## Revisión anónima entre pares

Reetiquete las cinco respuestas como A, B, C, D, E en un orden distinto al de los asesores (anótelo aparte; se revela al
final). Como revisor neutral: ¿cuál es la más fuerte y por qué? ¿Cuál tiene el punto ciego más grande? ¿Qué se les
escapó a las cinco (lo que ninguna vio)?

## El Presidente

Lee las cinco voces, la revisión y los reportes, y entrega el veredicto en uno de tres niveles:

- **Vale la pena seguir:** hay negocios cobrando por algo parecido, conversación real sobre el problema y ninguna falla
  de fondo.
- **Vale la pena con un ajuste:** señal mixta o un punto ciego serio. Nombra el ajuste concreto (otro ángulo, otra
  audiencia, otro alcance o precio), nunca «siga investigando».
- **Señal débil, no siga todavía:** poca evidencia de gente pagando o una falla de fondo. Propone uno o dos ángulos
  alternativos.

El Presidente **elige** una columna (una de las cinco) y toma rescates de las otras; dice LA razón más importante
(una sola), lo decidido en una lista numerada (qué es el producto, qué entra en el MVP, qué queda fuera sin discusión,
precio o rango, cómo cobra, condiciones entre socios si las hay, qué se verifica antes de construir) y UN paso
siguiente.

## Formato del acta

`00. Planeacion\04-consejo\acta-consejo-<AAAA-MM-DD>.md`:

```markdown
# Acta del Consejo — <Nombre del proyecto>
**Fecha:** <DD-mmm-AAAA>. **Formato:** 5 asesores con lentes opuestas sobre <n> reportes y <n> verificaciones,
revisión anónima entre pares y Presidente.

## La pregunta
## Mapa de anonimización (revelado después de la revisión)
A = … · B = … · C = … · D = … · E = …

# VEREDICTO DEL PRESIDENTE
## La recomendación final
## LA razón más importante (una sola)
## Lo decidido
1. …
## Lo que se verifica antes de construir
## El paso siguiente

---
# Las cinco voces
## Respuesta A
## Respuesta B
…
# Revisión entre pares
```

## Cómo se presenta al usuario y qué decide él

Al usuario no se le pega el acta: se le dan el veredicto (una línea), la razón más importante (una línea) y los 3-4
cambios que el Consejo pide a su idea, cada uno como una pregunta con respuesta recomendada (son parte de la ronda 2 de
la entrevista, pregunta D5). Lo que acepte y lo que rechace quedan en `DECISIONES.md` con fecha y porqué («se rechazó
la recomendación del Consejo de cortar X porque el usuario conoce de primera mano que los clientes lo piden»).

Regla de fondo: el Consejo y la investigación avisan de límites; **la visión del usuario manda**. Un veredicto de
«señal débil» se le dice con calma y con los ángulos alternativos; si el usuario decide seguir igual, se sigue, y la
decisión queda escrita.
