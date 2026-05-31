# Prompts creación estructura IA para ejercicio pruebas E2E

## Etapa 0: Instalar Cypress
npm install cypress --save-dev

## Etapa 1: Creación artefactos IA

### Inicializar contexto de claude
/init 

### Prompt 1: Crear un skill Cypress

Crea una skill para con el siguiente contenido:

**Cypress E2E**

Tu objetivo es generar pruebas E2E mantenibles utilizando Cypress.

**Reglas**

- Validar comportamiento observable.
- Priorizar selectores `data-testid`.
- Evitar selectores CSS frágiles.
- Evitar `cy.wait(ms)`.
- Utilizar `cy.intercept()` cuando sea necesario validar interacciones con el backend.
- Mantener independencia entre tests.
- Utilizar datos estables y reproducibles.
- Realizar aserciones explícitas y alineadas con el comportamiento esperado.

**Generación de pruebas**

Cuando generes tests:

1. Sigue estrictamente la especificación funcional o el escenario Gherkin recibido.
2. No añadas escenarios que no estén definidos en la especificación.
3. Deduce rutas, componentes y endpoints analizando el repositorio.
4. Prioriza mantenibilidad y claridad frente a detalles de implementación.
5. Si no existen selectores estables, propone o añade `data-testid`.

Genera el frontmatter correcto con nombre y descripción


### Prompt 2: Crear el agente QA

Crea un subagente llamado qa-agent.

**Objetivo:**

Especialista en QA Automation.

**Responsabilidades:**

- Convertir requisitos en escenarios testeables.
- Generar especificaciones BDD.
- Generar pruebas E2E.
- Revisar cobertura funcional.
- Detectar flakiness.
- Validar integración frontend-backend.

**Reglas:**

- No inventar funcionalidades.
- No inventar endpoints.
- No inventar datos.
- Priorizar comportamiento observable.
- Generar pruebas simples y mantenibles.
- Cuando reciba una especificación BDD debe generar únicamente las pruebas necesarias para cubrirla.
- Usa la skill 

Genera el frontmatter correcto con nombre y descripción


### Prompt 3: Crear comando para refinar specs
Crea un comando llamado qa-refine-spec.

**Uso:**

/qa-refine-spec "<descripción funcional>"

**Responsabilidad:**

Convertir una descripción funcional en especificación Gherkin.

**Formato de salida:**

Feature:
Scenario:
Given:
When:
Then:

**Reglas:**

- No inventar funcionalidades.
- No añadir escenarios que no estén implícitos.
- Si falta información crítica generar sección "Preguntas abiertas".
- Utilizar lenguaje de negocio.
- Generar escenarios testeables.

Genera el frontmatter correcto con nombre y descripción

### Prompt 4: Crear comando para crear pruebas E2E

Crea un comando llamado qa-create-e2e.

**Uso:**

/qa-create-e2e <spec-name> "<gherkin>"

**Responsabilidad:**

- Analizar el repositorio.
- Localizar la funcionalidad correspondiente.
- Identificar componentes.
- Identificar endpoints.
- Generar tests Cypress.

**Debe:**

- Utilizar qa-agent.
- Utilizar la skill cypress-e2e.
- Crear o actualizar los tests necesarios.
- No generar pruebas fuera del alcance del Gherkin recibido.

**Ubicación obligatoria:**

Generar los tests en la carpeta frontend/cypress/integration/
El nombre del fichero será <spec-name>.spec.js.
Si el fichero existe, actualizarlo.
Si no existe, crearlo.
No generar ficheros Cypress fuera de esa carpeta.


### Prompt 5: Crear comando para revisar tests generados
Crea un comando llamado qa-review-e2e.

**Uso:**

/qa-review-e2e "<gherkin>"

**Responsabilidad:**

Revisar que los tests generados cubren completamente la especificación recibida.

**Validar:**

- Cobertura funcional.
- Calidad Cypress.
- Robustez de selectores.
- Riesgo de flakiness.
- Validación backend.

**Salida:**

- Aprobado / No aprobado.
- Hallazgos Critical.
- Hallazgos Major.
- Hallazgos Minor.
- Recomendaciones.

### Prompts 6: Ajustes comandos para trabajar con ficheros como argumento

Revisa el comando qa-refine-spec.md para que genere el resultado en un fichero en formato de salida .feature bajo la carpeta bdd-specs                                                   

Revisa los comandos qa-create-e2e y qa-review-e2e para que en lugar de recibir un texto <gherkin> reciban el fichero .feature ubicado en la carpeta bdd-specs                                 

## Etapa 2: Creación de tests 

### Prompts 1: Crear la especificación del test Carga de la Página de Position
/qa-refine-spec "Carga de la Página de Position:
- Verifica que el título de la posición se muestra correctamente.
- Verifica que se muestran las columnas correspondientes a cada fase del proceso de contratación.
- Verifica que las tarjetas de los candidatos se muestran en la columna correcta según su fase actual."

### Prompts 2: Crear los tests Carga de la Página de Position
/qa-create-e2e position @bdd-specs/visualizacion-de-la-pagina-de-posicion.feature  

### Prompts 3: Revisa los tests Carga de la Página de Position
/qa-review-e2e @bdd-specs/visualizacion-de-la-pagina-de-posicion.feature  

### Prompts 4: Crear la especificación del test Cambio de Fase de un Candidato
/qa-refine-spec "Cambio de Fase de un Candidato:
- Simula el arrastre de una tarjeta de candidato de una columna a otra.
- Verifica que la tarjeta del candidato se mueve a la nueva columna.
- Verifica que la fase del candidato se actualiza correctamente en el backend mediante el endpoint PUT /candidate/:id."

### Prompts 5: Crear los test Cambio de Fase de un Candidato
/qa-create-e2e position @bdd-specs/cambio-de-fase-de-un-candidato.feature

### Prompts 6: Revisa los tests Cambio de Fase de un Candidato
/qa-review-e2e @bdd-specs/visualizacion-de-la-pagina-de-posicion.feature  

## Etapa 3: Ejecución de tests

### 1. Ejecución "Manual de los tests"

Desde el directorio raiz del repo:

cd frontend
npx cypress open

Si es la primera vez, sigue el asistente:
- Selecciona E2E Testing.
- Aceptar la creación de la configuración de Cypress "cypress.config.js"
- Eligir un navegador: Chrome.
En la ventana de Cypress, selecciona el test position.cy.ts.
El test se ejecuta manualmente en el navegador.

### 2. Tests fail

Los 5 tests han fallado. Ejecutar con Claude el siguiente prompt para solucionarlo

**Prompt 2.1: Fix the tests**
Ejecuta npx cypress run y mira de entender por qué fallan los tests y corrigelos. 

**Prompt 2.2: Informe resolución**
Crea una carpeta docs y genera un informe conciso en formato markdown con los problemas identificados en los 5 tests y cual ha sido el fix                                                      

