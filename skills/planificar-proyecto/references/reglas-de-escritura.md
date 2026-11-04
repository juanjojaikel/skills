# Reglas de escritura de los registros

Aplican a todo lo que esta skill y `/guardar` escriben en `ESTADO.md`, `LEEME.md`, `DECISIONES.md`, `CHANGELOG.md`,
actas, bitácoras y mensajes de commit. Existen porque esos archivos los va a leer alguien que no estuvo en el chat: un
Claude nuevo, un socio, o quien compre el proyecto.

1. **Impersonal y en tercera persona.** «Se decidió…», «Se actualizó…», «Quedó pendiente…». Nunca «Claude hizo»,
   nunca «<nombre> dijo». Sí se asignan tareas futuras por persona: «Activar la verificación en dos pasos: <nombre>».
   El verificador de fichas bloquea las atribuciones narrativas.
2. **Fechas absolutas** (`4-nov-2026`), nunca «ayer», «el lunes» ni «la semana pasada».
3. **Ningún número sin fuente y fecha.** Lo no verificado se marca «no verificado». Los totales se cuentan en el disco o
   en la fuente en el momento de escribir, nunca se copian de un registro anterior.
4. **Lo que no se verificó es pendiente, no hecho.** «Por confirmar» es un estado válido.
5. **Si algo escrito antes estaba mal, se dice, no se borra:** «⚠️ hasta el 3-nov decía X: era un error». Lo superado se
   marca ⚠️ y se dice qué lo reemplaza.
6. **Nada de «se arregló el error»:** se dice cuál («se corrigió el cruce del archivo del banco que duplicaba pagos del
   mismo día»).
7. **Sin secretos ni datos de personas reales** en ningún registro ni commit: «ver gestor de secretos → <cuenta>»,
   nunca el valor. Datos de clientes: solo inventados.
8. **Rutas y archivos:** lo que EXISTE va entre acentos graves (`01. Fundacion\ESTADO.md`) y el verificador comprueba que
   exista; lo que todavía NO existe (un entregable futuro) va entre comillas angulares («veredicto.md»). Al crearse,
   pasa a acentos graves. Las rutas son relativas a la raíz del proyecto; sirven con `/` o con `\` (el verificador
   entiende las dos).
9. **Skills:** siempre `nombre — https://…` con la URL exacta del catálogo; el verificador rechaza URLs de GitHub que no
   estén en el catálogo ni en la hoja de ruta. `anotar_skills.mjs` agrega «· instalada» o «· por instalar».
10. **Vocabulario del nicho**, no del oficio: las palabras que el cliente usa (las de la lente «conversación real»).
    Un término técnico inevitable va explicado en la misma línea.
11. **Entregables para personas = HTML navegable con rutas copiables**; los `.md` son materia prima y registro.
12. **Encabezados que no crecen:** «Último guardado» es UNA línea; la historia va a la bitácora; la bitácora guarda 10
    entradas y las viejas pasan a `99. Archivo\BITACORA.md`.
13. **Mensajes de commit:** `NN etapa/subetapa: qué cambió`, impersonal, sin `Co-Authored-By`, sin mencionar a Claude ni
    a nadie.

## Estados

⚪ sin empezar · 🟡 en curso · 🟢 terminada · 🔴 bloqueada · ⏸️ congelada. Una etapa «terminada» tiene su «terminada
cuando» cumplido y verificado; si no, está «en curso» aunque todo parezca hecho.
