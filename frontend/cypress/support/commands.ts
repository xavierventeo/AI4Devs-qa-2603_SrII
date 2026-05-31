/// <reference types="cypress" />

// Simulates drag-and-drop for react-beautiful-dnd (v13).
// RBD attaches mousemove/mouseup on the window via addEventListener (native),
// so events must be dispatched there. Each event is dispatched in a separate
// cy.window().then() call so Cypress flushes the queue between events and
// gives RBD time to update its internal drag position before mouseup fires.
// buttons:1 on mousemove signals the left button is held during the drag.
Cypress.Commands.add('dragTo', { prevSubject: 'element' }, (subject: JQuery<HTMLElement>, targetSelector: string) => {
  const DRAG_THRESHOLD = 5;

  cy.wrap(subject).then($source => {
    const src = $source[0].getBoundingClientRect();
    const srcX = Math.round(src.left + src.width / 2);
    const srcY = Math.round(src.top + src.height / 2);
    cy.log(`dragTo — source center: (${srcX}, ${srcY})`);

    cy.wrap($source)
      .trigger('mousedown', { button: 0, clientX: srcX, clientY: srcY, force: true })
      .trigger('mousemove', { button: 0, buttons: 1, clientX: srcX, clientY: srcY + DRAG_THRESHOLD + 1, force: true });
  });

  cy.get(targetSelector).then($target => {
    const tgt = $target[0].getBoundingClientRect();
    const tgtX = Math.round(tgt.left + tgt.width / 2);
    const tgtY = Math.round(tgt.top + tgt.height / 2);
    cy.log(`dragTo — target "${targetSelector}" center: (${tgtX}, ${tgtY}), size: ${tgt.width}x${tgt.height}`);

    cy.window().then(win =>
      win.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, cancelable: true, button: 0, buttons: 1, clientX: tgtX, clientY: tgtY }))
    );
    cy.window().then(win =>
      win.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, cancelable: true, button: 0, buttons: 1, clientX: tgtX, clientY: tgtY }))
    );
    cy.window().then(win =>
      win.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, button: 0, buttons: 0, clientX: tgtX, clientY: tgtY }))
    );
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      dragTo(targetSelector: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}
