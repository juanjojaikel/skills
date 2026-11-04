# La visión del producto

Es la fuente de verdad de QUÉ se construye y POR QUÉ. Todo lo demás (hoja de ruta, fichas, código) se deriva de ella.
Se escribe como un documento HTML navegable (`assets/plantillas/vision-producto.html` trae el esqueleto, los estilos y
la numeración de secciones) porque el usuario lo abre en el navegador, lo lee de corrido y lo comparte con sus socios;
los `.md` de la investigación son materia prima, no entregables.

## Antes de escribir

1. Ronda 2 de la entrevista (`entrevista.md`, D1-D7): alcance del MVP, camino técnico, cobro, nombre, lo del Consejo,
   reglas fijas, gestor de secretos. Sin esas respuestas la visión sale con supuestos, y un supuesto en la visión se
   vuelve un módulo construido de más.
2. Tenga a mano: `entrevista.md`, los reportes de `02-investigacion\`, `_verificaciones.md`,
   `03-arquitectura\opciones-tecnicas.md` y el acta del Consejo.

## Las secciones (en este orden; se omite una sección solo si no aplica y se dice por qué)

1. **El problema que resolvemos** — en las palabras del cliente (las de la lente «conversación real»), no en las de
   programador. Qué le cuesta hoy, en tiempo o plata, con la cifra más fuerte de la investigación.
2. **Para quién** — el cliente que paga y el usuario final; qué tienen en la mano hoy (hojas de cálculo, WhatsApp, otra
   app); a quién NO se le vende.
3. **Cuentas y roles** — los tipos de cuenta (por ejemplo: dueño, empleado, cliente final) y qué puede hacer cada uno.
   Una tabla.
4. **Las pantallas** — qué ve cada rol al abrir la app, en orden; la primera pantalla de cada rol es la más importante.
5. **Marca y personalización** — si cada cliente ve su propia marca (logo, colores, dominio) o la de la plataforma.
6. **Módulos** — cada función en un párrafo: qué hace, para quién, qué lo dispara, qué pasa solo (automático) y qué hace
   una persona. Marcar cada uno **MVP** o **V2** según la ronda 2.
7. **Lo que pasa solo** — todo lo que la app hace sin intervención humana (onboarding, recordatorios, cobros,
   asignaciones). Regla: si algo se puede automatizar, se automatiza.
8. **Cómo se cobra** — quién paga, cuánto (rango de la investigación, en la moneda del país), por qué medio, quién recibe
   la plata, qué nunca hace la plataforma con la plata de terceros.
9. **Planes y precios** — los planes, qué incluye cada uno, el precio propuesto con la fuente de comparación, y lo que
   queda «por decidir» con nombre de quién decide.
10. **Versiones** — MVP (lo mínimo que un cliente pagaría), V2, V3: qué entra en cada una y el gate por resultado para
    pasar de una a otra (p. ej. «10 clientes pagando»), nunca una fecha.
11. **Reglas fijas que no se reabren** — las de la ronda 2 (D6), numeradas. Son las que van al `CLAUDE.md`.
12. **Seguridad, datos y legal** — qué datos se guardan de quién, cuáles son sensibles, la ley del país que aplica (de la
    lente legal), consentimientos, cifrado, qué nunca entra a un registro ni a un tercero. Revisión de un abogado del
    país antes de lanzar.
13. **Camino técnico** — la opción elegida en una explicación para quien no programa (qué es cada pieza y por qué), el
    costo mensual con fuente y qué skills la cubren.
14. **Lo que hay que verificar antes de construir** — cada riesgo técnico, legal o de mercado que la investigación dejó
    «no verificado»; cada uno se vuelve una prueba de concepto en la etapa 02 de la hoja de ruta.
15. **Por decidir** — lo que el usuario (o sus socios) todavía no decidió, con quién decide y qué bloquea.

Al final del documento, un índice de fuentes: los archivos de `00. Planeacion\` de donde salió cada sección.

## Cómo se itera

- El archivo lleva número de borrador en el título («borrador 1»). Cada borrador nuevo reemplaza el archivo, pero el
  anterior se guarda como `vision-producto-borrador-<n>.html` en la misma carpeta (nada se borra).
- Se le pide al usuario que lo abra y conteste, por número de sección, qué cambia. Las preguntas que Claude tenga se
  listan numeradas con respuesta recomendada (mismo formato de la entrevista).
- Cuando el usuario diga «aprobado», se quita «borrador» del título, se escribe la fecha de aprobación, y a partir de
  ahí la visión solo cambia con una decisión escrita en `DECISIONES.md` (y la versión anterior va a `99. Archivo\`).
- Lo normal son dos o tres borradores. Más de cuatro es señal de que la ronda 2 dejó decisiones abiertas: vuelva a ella.

## Reglas de redacción

- Vocabulario del nicho, no del oficio. Si hace falta un término técnico, va explicado en la misma línea.
- Cada afirmación de mercado o legal enlaza al reporte de donde salió.
- Nada de «el sistema permitirá…»: «el dueño abre la app y ve quién debe».
- Cada módulo dice qué pasa solo y qué hace una persona. Si no dice ninguna de las dos, está incompleto.
- Rutas copiables (`00. Planeacion\02-investigacion\…`) en los enlaces internos, para que cualquier chat las encuentre.
