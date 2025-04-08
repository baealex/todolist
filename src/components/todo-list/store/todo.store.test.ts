import { todoStore } from './todo.store';

describe('TodoStore', () => {
  beforeEach(() => {
    todoStore.set({
      filterType: 'all',
      items: [],
    });
  });

  it('adds an item', () => {
    // No Arrange

    todoStore.addItem({ content: 'test' });

    expect(todoStore.state.items.length).toBe(1);
  });

  it('append item to the top of the list', () => {
    // No Arrange

    todoStore.addItem({ content: 'test' });
    todoStore.addItem({ content: 'test2' });

    expect(todoStore.state.items[0].content).toBe('test2');
    expect(todoStore.state.items[1].content).toBe('test');
  });

  it('completes an item', () => {
    todoStore.addItem({ content: 'test' });

    todoStore.complete(todoStore.state.items[0].id);

    expect(todoStore.state.items[0].isCompleted).toBe(true);
  });

  it('change order when item completed', () => {
    todoStore.addItem({ content: 'test' });
    todoStore.addItem({ content: 'test2' });
    todoStore.addItem({ content: 'test3' });

    todoStore.complete(todoStore.state.items[0].id);

    expect(todoStore.state.items[2].content).toBe('test3');
  });

  it('change order when item incomplete', () => {
    todoStore.addItem({ content: 'test' });
    todoStore.addItem({ content: 'test2' });
    todoStore.addItem({ content: 'test3' });

    todoStore.complete(todoStore.state.items[0].id);
    todoStore.complete(todoStore.state.items[2].id);

    expect(todoStore.state.items[0].content).toBe('test3');
  });

  it('gets filtered items', () => {
    todoStore.addItem({ content: 'test' });
    todoStore.addItem({ content: 'test2' });

    todoStore.set({
      filterType: 'all',
    });

    expect(todoStore.getFilteredItems().length).toBe(2);
  });

  it('gets filtered items by completed', () => {
    todoStore.addItem({ content: 'test' });
    todoStore.addItem({ content: 'test2' });
    todoStore.complete(todoStore.state.items[0].id);

    todoStore.set({
      filterType: 'completed',
    });

    expect(todoStore.getFilteredItems().length).toBe(1);
    expect(todoStore.getFilteredItems()[0].content).toBe('test2');
  });

  it('gets filtered items by active', () => {
    todoStore.addItem({ content: 'test' });
    todoStore.addItem({ content: 'test2' });
    todoStore.complete(todoStore.state.items[0].id);

    todoStore.set({
      filterType: 'active',
    });

    expect(todoStore.getFilteredItems().length).toBe(1);
    expect(todoStore.getFilteredItems()[0].content).toBe('test');
  });

  it('clears completed items', () => {
    todoStore.addItem({ content: 'test' });
    todoStore.complete(todoStore.state.items[0].id);

    todoStore.clearCompletedItems();

    expect(todoStore.state.items.length).toBe(0);
  });

  it('changes items order', () => {
    todoStore.addItem({ content: 'test' });
    todoStore.addItem({ content: 'test2' });

    todoStore.changeItemsOrder(todoStore.state.items[0].id, todoStore.state.items[1].id);

    expect(todoStore.state.items[0].content).toBe('test');
    expect(todoStore.state.items[1].content).toBe('test2');
  });
});
