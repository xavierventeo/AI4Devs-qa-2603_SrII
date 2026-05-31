# Prompts creación estructura IA para ejercicio pruebas E2E

## Inicializar contexto de claude
/init 

## Prompt para crear un skill Cypress

Crea una skill para con el siguiente contenido:

# Cypress E2E

Tu objetivo es generar pruebas E2E mantenibles utilizando Cypress.

## Reglas

- Validar comportamiento observable.
- Priorizar selectores `data-testid`.
- Evitar selectores CSS frágiles.
- Evitar `cy.wait(ms)`.
- Utilizar `cy.intercept()` cuando sea necesario validar interacciones con el backend.
- Mantener independencia entre tests.
- Utilizar datos estables y reproducibles.
- Realizar aserciones explícitas y alineadas con el comportamiento esperado.

## Generación de pruebas

Cuando generes tests:

1. Sigue estrictamente la especificación funcional o el escenario Gherkin recibido.
2. No añadas escenarios que no estén definidos en la especificación.
3. Deduce rutas, componentes y endpoints analizando el repositorio.
4. Prioriza mantenibilidad y claridad frente a detalles de implementación.
5. Si no existen selectores estables, propone o añade `data-testid`.

Genera el frontmatter correcto con nombre y descripción


## Prompt para crear el agente QA

Crea un subagente llamado qa-agent.

Objetivo:

Especialista en QA Automation.

Responsabilidades:

- Convertir requisitos en escenarios testeables.
- Generar especificaciones BDD.
- Generar pruebas E2E.
- Revisar cobertura funcional.
- Detectar flakiness.
- Validar integración frontend-backend.

Reglas:

- No inventar funcionalidades.
- No inventar endpoints.
- No inventar datos.
- Priorizar comportamiento observable.
- Generar pruebas simples y mantenibles.
- Cuando reciba una especificación BDD debe generar únicamente las pruebas necesarias para cubrirla.
- Usa la skill 

Genera el frontmatter correcto con nombre y descripción


## Prompt para crear el comando para refinar specs
Crea un comando llamado qa-refine-spec.

Uso:

/qa-refine-spec "<descripción funcional>"

Responsabilidad:

Convertir una descripción funcional en especificación Gherkin.

Formato de salida:

Feature:
Scenario:
Given:
When:
Then:

Reglas:

- No inventar funcionalidades.
- No añadir escenarios que no estén implícitos.
- Si falta información crítica generar sección "Preguntas abiertas".
- Utilizar lenguaje de negocio.
- Generar escenarios testeables.

Genera el frontmatter correcto con nombre y descripción

## Prompt para crear el comando para crear pruebas E2E

Crea un comando llamado qa-create-e2e.

Uso:

/qa-create-e2e <spec-name> "<gherkin>"

Responsabilidad:

- Analizar el repositorio.
- Localizar la funcionalidad correspondiente.
- Identificar componentes.
- Identificar endpoints.
- Generar tests Cypress.

Debe:

- Utilizar qa-agent.
- Utilizar la skill cypress-e2e.
- Crear o actualizar los tests necesarios.
- No generar pruebas fuera del alcance del Gherkin recibido.

Ubicación obligatoria:

Generar los tests en la carpeta frontend/cypress/integration/
El nombre del fichero será <spec-name>.spec.js.
Si el fichero existe, actualizarlo.
Si no existe, crearlo.
No generar ficheros Cypress fuera de esa carpeta.


## Prompt para crear el comando para revisar tests generados
Crea un comando llamado qa-review-e2e.

Uso:

/qa-review-e2e "<gherkin>"

Responsabilidad:

Revisar que los tests generados cubren completamente la especificación recibida.

Validar:

- Cobertura funcional.
- Calidad Cypress.
- Robustez de selectores.
- Riesgo de flakiness.
- Validación backend.

Salida:

- Aprobado / No aprobado.
- Hallazgos Critical.
- Hallazgos Major.
- Hallazgos Minor.
- Recomendaciones.

## Prompts ajuste comandos para trabajar con ficheros como argumento

Revisa el comando qa-refine-spec.md para que genere el resultado en un fichero en formato de salida .feature bajo la carpeta bdd-specs                                                   

Revisa los comandos qa-create-e2e y qa-review-e2e para que en lugar de recibir un texto <gherkin> reciban el fichero .feature ubicado en la carpeta bdd-specs                                 
