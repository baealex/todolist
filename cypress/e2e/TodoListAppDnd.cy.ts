describe('드래그 앤 드랍 기능', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('할 일 항목을 드래그 앤 드랍 하면 순서가 변경된다.', () => {
    cy.get('input').type('Item 1.{enter}').type('Item 2.{enter}').type('Item 3.{enter}');

    cy.get(':nth-child(1) > .drag-handler').trigger('mousedown');
    cy.get(':nth-child(3) > .drag-handler').trigger('mousemove');
    cy.get(':nth-child(3) > .drag-handler').trigger('mouseup');

    cy.get(':nth-child(1) > label').should('contain', 'Item 2');
    cy.get(':nth-child(2) > label').should('contain', 'Item 1');
    cy.get(':nth-child(3) > label').should('contain', 'Item 3');
  });

  it('완료한 일은 항상 미완료 항목 아래로 정렬된다.', () => {
    cy.get('input').type('Item 1.{enter}').type('Item 2.{enter}').type('Item 3.{enter}');

    cy.get(':nth-child(1) > label').click();
    cy.get(':nth-child(3) > .drag-handler').trigger('mousedown');
    cy.get(':nth-child(1) > .drag-handler').trigger('mousemove');
    cy.get(':nth-child(1) > .drag-handler').trigger('mouseup');

    cy.get(':nth-child(3) > label').should('contain', 'Item 3');
  });

  it('미완료 일은 항상 완료 항목 위로 정렬된다.', () => {
    cy.get('input').type('Item 1.{enter}').type('Item 2.{enter}').type('Item 3.{enter}');

    cy.get(':nth-child(1) > label').click();
    cy.get(':nth-child(1) > .drag-handler').trigger('mousedown');
    cy.get(':nth-child(3) > .drag-handler').trigger('mousemove');
    cy.get(':nth-child(3) > .drag-handler').trigger('mouseup');

    cy.get(':nth-child(2) > label').should('contain', 'Item 2');
  });
});
