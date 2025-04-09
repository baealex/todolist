import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/dom';

import { TodoListInput, TodoListInputProps } from './TodoListInput';

const renderTodoListInput = (overrideProps?: Partial<TodoListInputProps>) => {
  const props: TodoListInputProps = {
    onSubmit: () => {},
    ...overrideProps,
  };
  const component = new TodoListInput(document.body, props);
  component.render();
  return component;
};

describe('TodoListInput', () => {
  it('can be add item by press enter.', async () => {
    const mockSubmit = jest.fn();
    renderTodoListInput({
      onSubmit: mockSubmit,
    });

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'My new to-do item.{enter}');

    expect(mockSubmit).toHaveBeenCalled();
  });

  it('can be add item by click button.', async () => {
    const mockSubmit = jest.fn();
    renderTodoListInput({
      onSubmit: mockSubmit,
    });

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');
    await userEvent.type(input, 'My new to-do item.');
    await userEvent.click(button);

    expect(mockSubmit).toHaveBeenCalled();
  });

  it('cannot be add item when the content is empty.', async () => {
    const mockSubmit = jest.fn();
    renderTodoListInput({
      onSubmit: mockSubmit,
    });

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('cannot be add item when the content is blank.', async () => {
    const mockSubmit = jest.fn();
    renderTodoListInput({
      onSubmit: mockSubmit,
    });

    const input = screen.getByRole('textbox');
    await userEvent.type(input, '{space}{space}{space}');
    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(mockSubmit).not.toHaveBeenCalled();
  });
});
