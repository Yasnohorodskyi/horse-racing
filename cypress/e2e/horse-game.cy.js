describe('Horse Racing Game', () => {
  beforeEach(() => {
    cy.viewport(1440, 900);
    cy.visit('/', {
      onBeforeLoad(win) {
        win.Math.random = () => 0.99;
      },
    });
  });

  it('generates program and starts the race', () => {
    cy.contains('Generate Program').click();

    cy.contains('Program').should('be.visible');
    cy.contains('Results').should('be.visible');

    cy.contains('Start').click();
    cy.contains('Pause').should('be.visible');
    cy.contains('Racing').should('be.visible');
  });

  it('pauses the race', () => {
    cy.contains('Generate Program').click();
    cy.contains('Start').click();
    cy.contains('Pause').click();

    cy.contains('Start').should('be.visible');
    cy.contains('Paused').should('be.visible');
  });

  it('moves horses and shows first round results', () => {
    cy.contains('Generate Program').click();
    cy.contains('Start').click();

    cy.get('.track__horse').should('have.length', 10);

    cy.get('.track__horse')
      .first()
      .should(($el) => {
        const style = $el.attr('style') || '';
        const match = style.match(/--offset:\s*([\d.]+)px/);
        expect(match, 'offset style').to.not.be.null;
        expect(Number(match[1])).to.be.greaterThan(0);
      });

    cy.contains('.panel__header--green', 'Results')
      .parents('.panel')
      .find('.round')
      .first()
      .find('tbody tr', { timeout: 15000 })
      .should('have.length', 10);
  });
});
