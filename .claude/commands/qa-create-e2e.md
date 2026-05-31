---
name: qa-create-e2e
description: Analiza el repositorio, localiza componentes y endpoints relevantes, y genera o actualiza tests Cypress E2E a partir de un fichero .feature en bdd-specs/. Los tests se escriben en frontend/cypress/e2e/<spec-name>.cy.js.
---

Se te proporcionan dos argumentos separados por un espacio: el primero es el nombre del fichero de spec (sin extensión) y el segundo es el nombre del fichero `.feature` ubicado en `bdd-specs/`.

**Argumentos recibidos:**
$ARGUMENTS

Extrae de los argumentos:
- **spec-name**: el primer token.
- **feature-file**: el segundo token. Puede incluir o no la extensión `.feature`.

---

## Pasos a ejecutar

### 1. Leer la especificación Gherkin

Construye la ruta del fichero:
- Si **feature-file** termina en `.feature`, la ruta es `bdd-specs/<feature-file>`.
- Si no, la ruta es `bdd-specs/<feature-file>.feature`.

Lee el fichero. Si no existe, detente y muestra:
```
Error: no se encontró el fichero bdd-specs/<feature-file>.feature
Asegúrate de haber ejecutado /qa-refine-spec antes de este comando.
```

El contenido leído es la especificación Gherkin que se usará en los pasos siguientes.

### 2. Analizar el repositorio

Inspecciona el repositorio para entender el contexto antes de generar ningún test:

- Lee `backend/api-spec.yaml` para conocer los endpoints disponibles.
- Lee `backend/prisma/schema.prisma` para entender los modelos de datos.
- Examina `frontend/src/` para identificar las rutas React (`App.js` o equivalente), los componentes relevantes y los servicios de API (`services/`).
- Busca atributos `data-testid` existentes en los componentes relacionados con los escenarios del Gherkin.

### 3. Mapear el Gherkin al código

A partir de los escenarios del Gherkin recibido:

- Identifica qué **ruta de la SPA** (`/`, `/positions`, `/positions/:id`, `/add-candidate`) cubre cada escenario.
- Identifica qué **componentes React** intervienen.
- Identifica qué **endpoints del backend** se invocan durante el flujo.
- Si hay pasos Given que requieren estado previo en base de datos, plantéalos como llamadas `cy.request()` o `cy.fixture()`.

### 4. Generar los tests Cypress

Aplica la skill `cypress-e2e` para generar los tests. Reglas estrictas:

- **Alcance**: genera únicamente los tests que cubren los escenarios del Gherkin recibido. No añadas casos extra.
- **Selectores**: prioriza `data-testid`; si no existen en el componente, propón añadirlos e inclúyelos en el test.
- **Interacciones con el backend**: usa `cy.intercept()` para validar llamadas a la API cuando el escenario lo requiera.
- **Independencia**: cada `it()` debe poder ejecutarse de forma aislada.
- **Sin `cy.wait(ms)`**: usa aliases de `cy.intercept()` o aserciones de DOM para esperar estado.
- **Estructura**:

```js
describe('<Feature name del Gherkin>', () => {
  beforeEach(() => {
    // navegación base y setup común
  });

  it('<nombre del escenario>', () => {
    // Arrange → Act → Assert
  });
});
```

### 5. Escribir el fichero

- **Ruta obligatoria:** `frontend/cypress/e2e/<spec-name>.cy.js`
- Si el fichero **no existe**: créalo con los tests generados.
- Si el fichero **ya existe**: léelo primero y actualízalo — conserva los tests existentes que no estén cubiertos por el Gherkin recibido y añade o reemplaza únicamente los tests correspondientes a los escenarios del Gherkin.
- **No escribas ningún fichero Cypress fuera de `frontend/cypress/e2e/`.**

### 6. Informe final

Al terminar, muestra un resumen con:

- Fichero escrito: ruta completa.
- Escenarios cubiertos: lista los `it()` generados.
- Selectores nuevos propuestos: si has propuesto `data-testid` que no existen aún, lista el componente y el atributo sugerido.
- Dependencias detectadas: endpoints interceptados con `cy.intercept()`.
