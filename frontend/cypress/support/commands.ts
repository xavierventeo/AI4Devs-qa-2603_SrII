/// <reference types="cypress" />

// Simulates drag-and-drop for react-beautiful-dnd (v13).
// Fires mousedown + mousemove on the subject to exceed the drag threshold,
// then moves to the target and releases.
Cypress.Commands.add('dragTo', { prevSubject: 'element' }, (subject: JQuery<HTMLElement>, targetSelector: string) => {
  const DRAG_THRESHOLD = 5;

  cy.wrap(subject)
    .trigger('mousedown', { button: 0, force: true })
    .trigger('mousemove', { button: 0, clientX: 0, clientY: DRAG_THRESHOLD + 1, force: true });

  cy.get(targetSelector)
    .trigger('mousemove', { button: 0, force: true })
    .trigger('mousemove', { button: 0, force: true })
    .trigger('mouseup', { force: true });
});

declare global {
  namespace Cypress {
    interface Chainable {
      dragTo(targetSelector: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}
