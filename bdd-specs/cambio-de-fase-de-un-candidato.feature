Feature: Cambio de fase de un candidato
  Como reclutador quiero mover un candidato de una fase a otra en el tablero kanban
  para reflejar su avance en el proceso de contratación.

  Background:
    Given existe una posición con al menos dos fases en el proceso de contratación
    And hay un candidato asignado a la primera fase del proceso

  Scenario: La tarjeta del candidato aparece en la nueva fase tras el movimiento
    Given el reclutador está en la página de la posición
    When el reclutador arrastra la tarjeta del candidato a la siguiente fase
    Then la tarjeta del candidato aparece en la columna de la nueva fase
    And la tarjeta del candidato ya no aparece en la columna de la fase anterior

  Scenario: El cambio de fase queda registrado en el backend
    Given el reclutador está en la página de la posición
    When el reclutador arrastra la tarjeta del candidato a la siguiente fase
    Then se envía una petición de actualización al backend con el identificador del candidato y la nueva fase

# Preguntas abiertas
# - [ ] Si la petición al backend falla, ¿la tarjeta revierte a su posición original o permanece en la nueva columna?
# - [ ] ¿Se muestra algún mensaje de error o confirmación visible al reclutador tras el movimiento?
