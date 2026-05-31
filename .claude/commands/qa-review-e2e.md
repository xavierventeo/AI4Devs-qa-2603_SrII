---
name: qa-review-e2e
description: Revisa que los tests Cypress existentes cubren completamente un fichero .feature de bdd-specs/. Evalúa cobertura funcional, calidad Cypress, robustez de selectores, riesgo de flakiness y validación del backend. Emite veredicto Aprobado/No aprobado con hallazgos clasificados por severidad.
---

Se te proporciona el nombre de un fichero `.feature` ubicado en `bdd-specs/`.

**Argumento recibido:**
$ARGUMENTS

---

## Pasos a ejecutar

### 1. Leer la especificación Gherkin y extraer los escenarios

Construye la ruta del fichero:
- Si el argumento termina en `.feature`, la ruta es `bdd-specs/<argumento>`.
- Si no, la ruta es `bdd-specs/<argumento>.feature`.

Lee el fichero. Si no existe, detente y muestra:
```
Error: no se encontró el fichero bdd-specs/<argumento>.feature
Asegúrate de haber ejecutado /qa-refine-spec antes de este comando.
```

Parsea el contenido del fichero e identifica:
- **Feature**: nombre de la funcionalidad.
- **Escenarios**: lista cada `Scenario` / `Scenario Outline` con sus pasos `Given / When / Then`.
- **Datos de ejemplo**: tablas `Examples` si existen.

Esta lista de escenarios es el **contrato de cobertura** que deben cumplir los tests.

### 2. Localizar los tests existentes

- Busca en `frontend/cypress/e2e/` los ficheros `.cy.js` cuyo contenido esté relacionado con la Feature del Gherkin.
- Lee cada fichero encontrado íntegramente.
- Si no existe ningún fichero relevante, el veredicto es **No aprobado** y el único hallazgo Critical es "No se encontraron tests para esta especificación".

### 3. Evaluar los tests contra los cinco criterios

Para cada criterio, genera hallazgos clasificados en tres niveles de severidad:

| Nivel | Significado |
|---|---|
| **Critical** | El test no existe, falla en cobertura completa de un escenario, o tiene un defecto que lo invalida. |
| **Major** | El test existe pero cubre el escenario de forma incompleta o frágil de forma predecible. |
| **Minor** | Problema de calidad, estilo o mantenibilidad que no invalida el test pero lo degrada. |

#### Criterio A — Cobertura funcional

Para cada escenario del Gherkin verifica:
- ¿Existe al menos un `it()` que lo cubra?
- ¿El `it()` valida el `Then` (resultado observable), no solo ejecuta el `When`?
- ¿Los `Scenario Outline` tienen casos para cada fila de `Examples`?
- ¿Se cubren los flujos de error implícitos en el Gherkin?

#### Criterio B — Calidad Cypress

Revisa:
- Cada `it()` sigue la estructura Arrange → Act → Assert.
- No hay lógica condicional (`if/else`) dentro de los tests.
- Los `describe` e `it` tienen nombres que describen comportamiento, no implementación.
- No hay código comentado o `it.skip()` sin justificación.
- Los `beforeEach` solo contienen setup compartido, no aserciones.

#### Criterio C — Robustez de selectores

Para cada selector usado en los tests:
- ¿Usa `data-testid` u otros atributos semánticos estables?
- ¿Evita clases CSS, índices posicionales (`eq(0)`) o selectores XPath frágiles?
- ¿Evita textos literales en idiomas que podrían cambiar, salvo que sean parte del contrato de negocio?

#### Criterio D — Riesgo de flakiness

Detecta patrones que causan intermitencia:
- Uso de `cy.wait(ms)` con tiempo fijo.
- Ausencia de `cy.intercept()` + alias cuando el test depende de respuestas de red.
- Dependencia de orden de ejecución entre tests (estado global compartido sin reset).
- Aserciones sobre timestamps, IDs autogenerados o datos no controlados.
- Tests que asumen datos preexistentes en base de datos sin crearlos explícitamente.

#### Criterio E — Validación del backend

Verifica que los tests que implican llamadas a la API:
- Usan `cy.intercept()` para capturar la petición y validan método, ruta y, si aplica, payload.
- Comprueban el efecto en la UI tras la respuesta del servidor, no solo que el botón fue clicado.
- No hardcodean URLs del backend que difieran de las definidas en `backend/api-spec.yaml`.

### 4. Emitir el veredicto y el informe

El veredicto es **Aprobado** únicamente si no hay ningún hallazgo **Critical**.

Genera el informe con exactamente este formato:

---

## Resultado de la revisión

### Veredicto: [APROBADO ✅ | NO APROBADO ❌]

> _Breve justificación del veredicto en una o dos frases._

---

### Cobertura de escenarios

| Escenario | Cubierto | Fichero | `it()` correspondiente |
|---|---|---|---|
| `<nombre del escenario>` | ✅ / ❌ / ⚠️ Parcial | `ruta/fichero.cy.js` | `"nombre del it"` |

---

### Hallazgos Critical
_Ausente si no hay ninguno._
- **[C-01]** `fichero.cy.js:línea` — descripción del problema y por qué invalida el test.

### Hallazgos Major
_Ausente si no hay ninguno._
- **[M-01]** `fichero.cy.js:línea` — descripción del problema.

### Hallazgos Minor
_Ausente si no hay ninguno._
- **[m-01]** `fichero.cy.js:línea` — descripción del problema.

---

### Recomendaciones

Lista ordenada por impacto de las acciones concretas a tomar para resolver los hallazgos o mejorar la suite. Para cada recomendación, indica el hallazgo al que aplica (`[C-01]`, `[M-02]`, etc.).

---
