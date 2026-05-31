const interviewFlowMock = {
  interviewFlow: {
    positionName: 'Senior Frontend Developer',
    interviewFlow: {
      id: 1,
      description: 'Proceso estándar de contratación',
      interviewSteps: [
        { id: 1, name: 'CV Review',             orderIndex: 1, interviewFlowId: 1, interviewTypeId: 1 },
        { id: 2, name: 'Technical Interview',   orderIndex: 2, interviewFlowId: 1, interviewTypeId: 2 },
        { id: 3, name: 'HR Interview',          orderIndex: 3, interviewFlowId: 1, interviewTypeId: 3 }
      ]
    }
  }
};

const candidatesMock = [
  { candidateId: 1, applicationId: 10, fullName: 'Ana García',     currentInterviewStep: 'CV Review',           averageScore: 3 },
  { candidateId: 2, applicationId: 11, fullName: 'Luis Martínez',  currentInterviewStep: 'Technical Interview', averageScore: 4 },
  { candidateId: 3, applicationId: 12, fullName: 'Marta Sánchez',  currentInterviewStep: 'HR Interview',        averageScore: 2 }
];

const singleCandidateMock = [
  { candidateId: 1, applicationId: 10, fullName: 'Ana García', currentInterviewStep: 'CV Review', averageScore: 3 }
];

describe('Visualización de la página de posición', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3010/positions/1/interviewFlow', interviewFlowMock).as('getInterviewFlow');
    cy.intercept('GET', 'http://localhost:3010/positions/1/candidates', candidatesMock).as('getCandidates');
    cy.visit('/positions/1');
    cy.wait(['@getInterviewFlow', '@getCandidates']);
  });

  it('muestra el título de la posición', () => {
    cy.get('[data-testid="position-title"]')
      .should('be.visible')
      .and('contain.text', 'Senior Frontend Developer');
  });

  it('muestra una columna por cada fase del proceso de contratación', () => {
    cy.get('[data-testid="stage-column"]').should('have.length', 3);
    cy.get('[data-testid="stage-column-header"]').eq(0).should('contain.text', 'CV Review');
    cy.get('[data-testid="stage-column-header"]').eq(1).should('contain.text', 'Technical Interview');
    cy.get('[data-testid="stage-column-header"]').eq(2).should('contain.text', 'HR Interview');
  });

  it('cada candidato aparece únicamente en la columna correspondiente a su fase actual', () => {
    cy.get('[data-testid="stage-column"]').eq(0).within(() => {
      cy.get('[data-testid="candidate-card"]').should('have.length', 1).and('contain.text', 'Ana García');
    });
    cy.get('[data-testid="stage-column"]').eq(1).within(() => {
      cy.get('[data-testid="candidate-card"]').should('have.length', 1).and('contain.text', 'Luis Martínez');
    });
    cy.get('[data-testid="stage-column"]').eq(2).within(() => {
      cy.get('[data-testid="candidate-card"]').should('have.length', 1).and('contain.text', 'Marta Sánchez');
    });
  });
});

describe('Cambio de fase de un candidato', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/positions/1/interviewFlow', interviewFlowMock).as('getInterviewFlow');
    cy.intercept('GET', '**/positions/1/candidates', singleCandidateMock).as('getCandidates');
    cy.visit('/positions/1');
    cy.wait(['@getInterviewFlow', '@getCandidates']);
  });

  it('la tarjeta del candidato aparece en la nueva fase tras el movimiento', () => {
    cy.intercept('PUT', '**/candidates/1', { statusCode: 200, body: {} }).as('updateCandidate');

    cy.window().invoke('__onDragEnd', {
      draggableId: '1',
      type: 'DEFAULT',
      source: { droppableId: '0', index: 0 },
      destination: { droppableId: '1', index: 0 },
      reason: 'DROP',
      mode: 'FLUID',
      combine: null,
    });

    cy.get('[data-testid="stage-column"]').eq(0).within(() => {
      cy.get('[data-testid="candidate-card"]').should('not.exist');
    });
    cy.get('[data-testid="stage-column"]').eq(1).within(() => {
      cy.get('[data-testid="candidate-card"]').should('contain.text', 'Ana García');
    });
  });

  it('el cambio de fase queda registrado en el backend', () => {
    cy.intercept('PUT', '**/candidates/1', { statusCode: 200, body: {} }).as('updateCandidate');

    cy.window().invoke('__onDragEnd', {
      draggableId: '1',
      type: 'DEFAULT',
      source: { droppableId: '0', index: 0 },
      destination: { droppableId: '1', index: 0 },
      reason: 'DROP',
      mode: 'FLUID',
      combine: null,
    });

    cy.wait('@updateCandidate').its('request.body').should('deep.equal', {
      applicationId: 10,
      currentInterviewStep: 2
    });
  });
});
