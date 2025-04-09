describe('Todo list app', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it("할 일 목록이 존재하지 않는다면, 'There are no items here!' 메세지가 출력된다.", () => {
    cy.contains('There are no items here!');
  });

  describe('할 일을 입력한 후 엔터를 누르면', () => {
    it('입력한 항목이 할 일 목록에 노출된다.', () => {
      cy.get('input').type('A thing I need to do today.{enter}');

      cy.get('ul').contains('A thing I need to do today.');
    });

    it('할 일 항목에 완료되지 않은 갯수가 {n} items left로 노출된다.', () => {
      cy.get('input')
        .type('The first thing I need to do today.{enter}')
        .type('The second thing I need to do today.{enter}')
        .type('The third thing I need to do today.{enter}');

      cy.contains('3 items left');
    });
  });

  describe('할 일 항목을 체크하면', () => {
    it('완료된 항목은 목록의 맨 하단으로 이동된다.', () => {
      cy.get('input')
        .type('The first thing I need to do today.{enter}')
        .type('The second thing I need to do today.{enter}')
        .type('The third thing I need to do today.{enter}');

      cy.get(':nth-child(1) > label').click();

      cy.get(':nth-child(3) > label').contains('The third thing I need to do today.');
    });

    it('완료된 항목을 체크 해제하여 완료 되지 않은 항목으로 바꾸면 목록의 맨 상단으로 이동한다.', () => {
      cy.get('input')
        .type('The first thing I need to do today.{enter}')
        .type('The second thing I need to do today.{enter}')
        .type('The third thing I need to do today.{enter}');

      cy.get(':nth-child(1) > label').click();
      cy.get(':nth-child(3) > label').click();

      cy.get(':nth-child(1) > label').contains('The third thing I need to do today.');
    });

    it('완료되지 않은 항목 갯수가 갱신된다.', () => {
      cy.get('input')
        .type('The first thing I need to do today.{enter}')
        .type('The second thing I need to do today.{enter}')
        .type('The third thing I need to do today.{enter}');
      cy.get(':nth-child(1) > label').click();

      cy.contains('2 items left');
    });

    it('완료된 항목 갯수가 갱신된다.', () => {
      cy.get('input')
        .type('The first thing I need to do today.{enter}')
        .type('The second thing I need to do today.{enter}')
        .type('The third thing I need to do today.{enter}');

      cy.get(':nth-child(1) > label').click();

      cy.contains('Clear completed (1)');
    });
  });

  describe("'Clear Completed' 버튼을 클릭하면", () => {
    it('완료된 항목은 목록에서 제거된다.', () => {
      cy.get('input')
        .type('The first thing I need to do today.{enter}')
        .type('The second thing I need to do today.{enter}')
        .type('The third thing I need to do today.{enter}');

      cy.get(':nth-child(1) > label').click();
      cy.get(':nth-child(3) > button').click();

      cy.get('ul').should('not.contain', 'The third thing I need to do today.');
    });

    it('완료된 항목 갯수가 0으로 초기화 된다.', () => {
      cy.get('input')
        .type('The first thing I need to do today.{enter}')
        .type('The second thing I need to do today.{enter}')
        .type('The third thing I need to do today.{enter}');

      cy.get(':nth-child(1) > label').click();
      cy.get(':nth-child(3) > button').click();

      cy.contains('Clear completed (0)');
    });
  });

  describe('보기 타입 버튼 메뉴에서', () => {
    it("'Active' 버튼을 누르면 완료되지 않은 목록을 노출한다.", () => {
      cy.get('input').type('Incomplete item.{enter}').type('Completed item.{enter}');
      cy.get(':nth-child(1) > label').click();

      cy.get('[data-value="active"]').click();

      cy.contains('Incomplete item.').and('not.contain', 'Complete item.');
    });

    it("'Competed' 버튼을 누르면 완료된 않은 목록을 노출한다.", () => {
      cy.get('input').type('Incomplete item.{enter}').type('Completed item.{enter}');
      cy.get(':nth-child(1) > label').click();

      cy.get('[data-value="completed"]').click();

      cy.contains('Completed item.').and('not.contain', 'Incomplete item.');
    });
  });
});
