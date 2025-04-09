import Component from '~/modules/core/component';

import style from './TodoListInput.module.css';

export interface TodoListInputProps {
  onSubmit: (data: { content: string }) => void;
}

export class TodoListInput extends Component<TodoListInputProps> {
  $form?: HTMLFormElement;

  handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    const target = e.target as HTMLFormElement;
    const content = target.elements.namedItem('content') as HTMLInputElement;
    const value = content?.value.trim();

    if (!value) return;

    content.value = '';

    this.props.onSubmit({ content: value });
  };

  mount(): void {
    this.$form = this.useSelector('form')!;
    this.$form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  unmount(): void {
    this.$form?.removeEventListener('submit', this.handleSubmit.bind(this));
  }

  template() {
    return `
      <form class="${style['form']}">
        <input name="content" class="${style['content']}" placeholder="What needs to be done?" />
        <button type="submit" class="${style['submit']}">
          Add
        </button>
      </form>
    `;
  }
}
