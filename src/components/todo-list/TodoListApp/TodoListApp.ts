import Component from '~/modules/core/component';
import { TodoListInput } from '../TodoListInput';
import { TodoListItems, TodoListItemsProps } from '../TodoListItems';
import { TodoListFilter, TodoListFilterProps } from '../TodoListFilter';
import { FilterType, todoStore } from '../store/todo.store';

export interface TodoListAppProps {
  el: HTMLElement;
  useDnd?: boolean;
}

export class TodoListApp extends Component<Pick<TodoListAppProps, 'useDnd'>> {
  key?: string;

  inputWrapper = Component.wrapper('div');
  listWrapper = Component.wrapper('div');
  filterWrapper = Component.wrapper('div');

  constructor({ el, ...rest }: TodoListAppProps) {
    super(el, rest);
  }

  getTodoListItemsProps = (): TodoListItemsProps => {
    const baseProps: TodoListItemsProps = {
      items: todoStore.getFilteredItems(),
      onComplete: todoStore.complete,
    };
    if (this.props.useDnd) {
      return {
        ...baseProps,
        dndFeature: {
          onDrop: todoStore.changeItemsOrder,
        },
      };
    }
    return baseProps;
  };

  getTodoListFilterProps = (): TodoListFilterProps => ({
    activeFilterType: todoStore.state.filterType,
    completedItemCount: todoStore.completedItems.length,
    incompleteItemCount: todoStore.incompleteItems.length,
    onFilter: (filterType: FilterType) => todoStore.set({ filterType }),
    onClear: todoStore.clearCompletedItems,
  });

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
