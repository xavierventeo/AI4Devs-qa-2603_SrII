Feature: Visualización de la página de posición
  Como reclutador quiero ver el tablero kanban de una posición
  para conocer el estado actual de los candidatos en el proceso de contratación.

  Background:
    Given existe una posición con un proceso de contratación definido
    And la posición tiene candidatos asignados en diferentes fases del proceso

  Scenario: El título de la posición se muestra en la página
    When el reclutador accede a la página de la posición
    Then se muestra el título de la posición

  Scenario: Se muestra una columna por cada fase del proceso de contratación
    When el reclutador accede a la página de la posición
    Then se muestra una columna por cada fase definida en el proceso de contratación de esa posición

  Scenario: Cada candidato aparece en la columna de su fase actual
    When el reclutador accede a la página de la posición
    Then cada candidato aparece únicamente en la columna correspondiente a su fase actual del proceso
