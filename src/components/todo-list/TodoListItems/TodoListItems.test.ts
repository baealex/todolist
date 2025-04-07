import userEvent from '@testing-library/user-event';
import { fireEvent, screen } from '@testing-library/dom';

import { TodoListItems, TodoListItemsProps } from './TodoListItems';
import { createTodoItem } from '~/mocks/fixtures/todo-item';

const renderTodoListItems = (overrideProps?: Partial<TodoListItemsProps>) => {
  const props: TodoListItemsProps = {
    items: [],
    onComplete: () => {},
    ...overrideProps,
  };
  const component = new TodoListItems(document.body, props);
  component.render();
  return component;
};

describe('TodoListItems', () => {
  it('shows the to-do list.', () => {
    renderTodoListItems({
      items: [
        createTodoItem({
          content: "It's a first todo item.",
        }),
        createTodoItem({
          content: "It's a second todo item.",
        }),
      ],
    });

    expect(screen.getByText("It's a first todo item.")).toBeInTheDocument();
    expect(screen.getByText("It's a second todo item.")).toBeInTheDocument();
  });

  it('changes complete status of item.', async () => {
    const mockComplete = jest.fn();
    renderTodoListItems({
      items: [
        createTodoItem({
          content: "It's a first todo item.",
        }),
      ],
      onComplete: mockComplete,
    });

    await userEvent.click(screen.getByText("It's a first todo item."));

    expect(mockComplete).toHaveBeenCalled();
  });

  describe('Drag and Drop', () => {
    beforeEach(() => {
      const mockGetBoundingClientRect = jest.fn(function () {
        const index = Array.from(this.parentNode.children).indexOf(this);
        const baseLeft = 0;
        const baseTop = 0;
        const width = 100;
        const height = 100;

        return {
          left: baseLeft,
          right: baseLeft + width,
          top: baseTop + index * height + 1,
          bottom: baseTop + (index + 1) * height,
          width,
          height,
        };
      });

      Element.prototype.getBoundingClientRect = mockGetBoundingClientRect as unknown as () => DOMRect;
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('changes order of items.', async () => {
      const mockDrop = jest.fn();
      renderTodoListItems({
        items: [
          createTodoItem({
            content: 'Item 1',
          }),
          createTodoItem({
            content: 'Item 2',
          }),
          createTodoItem({
            content: 'Item 3',
          }),
          createTodoItem({
            content: 'Item 4',
          }),
        ],
        dndFeature: {
          onDrop: mockDrop,
        },
      });

      const item4Handler = screen.getAllByRole('button', { name: 'Drag and Drop' })[3];
      const item2Position = { clientX: 0, clientY: 200 };
      fireEvent.mouseDown(item4Handler);
      fireEvent.mouseMove(item4Handler, item2Position);
      fireEvent.mouseUp(item4Handler);

      expect(mockDrop).toHaveBeenCalledWith(3, 1);
    });
  });
});
