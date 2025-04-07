import Component from '~/modules/core/component';
import { TodoListInput } from '../TodoListInput';
import { TodoListItems, TodoListItemsProps } from '../TodoListItems';
import { TodoListFilter, TodoListFilterProps } from '../TodoListFilter';
import { FilterType, todoStore } from '../store/todo.store';

export interface TodoListAppProps {
  el: HTMLElement;
  useDnd?: boolean;
}

const style = `
  html, body {
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
  }

  * {
    font-size: inherit;
    font-family: 'Noto Sans KR', sans-serif;
  }

  *,
  *:after,
  *:before {
    box-sizing: border-box;
  }

  body {
    background: #f5f5f5;
  }

  .container {
    margin: 0 auto;
    width: 720px;
    max-width: 100%;
    padding: 16px 0;
  }

  .p-16 {
    padding: 16px;
  }

  .card {
    overflow: hidden;
    background: #fff;
    border-radius: 16px;
    box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.1);
  }

  .drag-target {
    opacity: 0.4;
  }
`;

export class TodoListApp extends Component<Pick<TodoListAppProps, 'useDnd'>> {
  key?: string;

  inputWrapper = Component.wrapper('div');
  listWrapper = Component.wrapper('div');
  filterWrapper = Component.wrapper('div');

  constructor({ el, ...rest }: TodoListAppProps) {
    super(el, rest);
  }

  getTodoListItemsProps = (): TodoListItemsProps => {
    if (this.props.useDnd) {
      return {
        items: todoStore.getFilteredItems(),
        onComplete: todoStore.complete,
        dndFeature: {
          onDrop: todoStore.changeItemsOrder,
        },
      };
    }
    return {
      items: todoStore.getFilteredItems(),
      onComplete: todoStore.complete,
    };
  };

  getTodoListFilterProps = (): TodoListFilterProps => {
    return {
      activeFilterType: todoStore.state.filterType,
      completedItemCount: todoStore.completedItems.length,
      incompleteItemCount: todoStore.incompleteItems.length,
      onFilter: (filterType: FilterType) =>
        todoStore.set({
          filterType,
        }),
      onClear: todoStore.clearCompetedItems,
    };
  };

  mount() {
    const todoListItems = new TodoListItems(this.useSelector(this.listWrapper.selector)!, this.getTodoListItemsProps());
    todoListItems.render();

    const todoListInput = new TodoListInput(this.useSelector(this.inputWrapper.selector)!, {
      onSubmit: todoStore.addItem,
    });
    todoListInput.render();

    const todoListFilter = new TodoListFilter(
      this.useSelector(this.filterWrapper.selector)!,
      this.getTodoListFilterProps()
    );
    todoListFilter.render();

    this.key = todoStore.subscribe(() => {
      todoListItems.update(this.getTodoListItemsProps());
      todoListFilter.update(this.getTodoListFilterProps());
    });
  }

  unmount() {
    todoStore.unsubscribe(this.key!);
  }

  template() {
    return `
      <style>${style}</style>
      <div class="container">
        <div class="card">
          <div class="p-16">
            ${this.inputWrapper.container}
            ${this.listWrapper.container}
          </div>
          ${this.filterWrapper.container}
        </div>
      </div>
    `;
  }
}
