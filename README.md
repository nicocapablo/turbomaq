# Práctica TFI

App para preparar el final de **Turbomáquinas de flujo incompresible** (ETSEIB, MUEI, 10/04/2026).

Se abre en el navegador. No hace falta instalar nada.

## Qué puedes hacer

- **Práctica.** Una pregunta cada vez. Si aciertas, sale «Muy bien» y la explicación solo si la pides. Si fallas, explica el concepto y después la respuesta.
- **Examen.** 20 preguntas con la nota del final: acierto +1, fallo −1/3, en blanco 0. Puedes sacar el modelo de 2026, un examen de los bancos anteriores, o una mezcla con cálculos nuevos (otros números cada vez).
- **Ejercicio.** Escribes el resultado. Puedes elegir el modelo del 10/04/2026 (permiso 1, 2 o 3), uno parecido con otros números, la central reversible del 09/01/2024, o un apartado suelto (triángulo, par, semejanza, cruce, NPSH). El dibujo del rodete se responde tocando. Si fallas, explica el concepto y el número.
- **Formulario.** El botón de arriba a la derecha abre el formulario en cualquier momento.

Las preguntas están en catalán, como en el examen. La explicación está en castellano.

## Abrirla en el ordenador

Haz doble clic en `index.html`.

## Subirla a GitHub

En esta carpeta, con Git instalado:

```bash
git init
git add .
git commit -m "Práctica del final de turbomáquinas"
```

Crea un repositorio vacío en GitHub (puede ser privado: los PDF son material de la asignatura) y enlázalo. Cambia `TU_USUARIO` y `TU_REPO`:

```bash
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

Para verla como página web: en el repositorio, **Settings → Pages → Branch: main → / (root) → Save**. En un par de minutos estará en `https://TU_USUARIO.github.io/TU_REPO/`.

El botón Formulario y las figuras van dentro de `assets/`. No hace falta publicar los PDF si no quieres; la app ya lleva las imágenes que necesita.
