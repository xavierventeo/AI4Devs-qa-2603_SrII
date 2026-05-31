---
name: cypress-e2e
description: Aplica esta skill cuando necesites generar, revisar o mejorar pruebas E2E con Cypress. Úsala ante cualquier tarea que implique: escribir tests a partir de escenarios Gherkin o requisitos funcionales, elegir selectores, estructurar suites de Cypress, validar integración frontend-backend con cy.intercept(), o evaluar la calidad y mantenibilidad de pruebas existentes.
---

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
