import Component from '~/modules/core/component';

import { FilterType } from '../store/todo.store';

import style from './TodoListFilter.module.css';

export interface TodoListFilterProps {
  activeFilterType: FilterType;
  incompleteItemCount: number;
  completedItemCount: number;
  onFilter: (filterType: FilterType) => void;
  onClear: () => void;
}

const filterTypes: {
  label: string;
  value: FilterType;
}[] = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Completed',
    value: 'completed',
  },
];

export class TodoListFilter extends Component<TodoListFilterProps> {
  handleFilterItems = (e: MouseEvent) => {
    const target = e.target as HTMLInputElement;

    if (target && target.dataset['type'] === 'filter') {
      const value = target.dataset['value'] as FilterType;
      if (value) {
        this.props.onFilter(value);
      }
    }
  };

  handleClearItems = (e: MouseEvent) => {
    const target = e.target as HTMLInputElement;

    if (target && target.dataset['type'] === 'clear') {
      this.props.onClear();
    }
  };

  mount(): void {
    this.$el.addEventListener('click', this.handleClearItems);
    this.$el.addEventListener('click', this.handleFilterItems);
  }

  unmount(): void {
    this.$el.removeEventListener('click', this.handleClearItems);
    this.$el.removeEventListener('click', this.handleFilterItems);
  }

  template() {
    return `
      <div class="${style['filter-area']}">
        <div>${this.props.incompleteItemCount} items left</div>

        <div class="${style['filter-buttons']}">
          ${filterTypes
            .map(
              (filterType) => `
                <button class="${filterType.value === this.props.activeFilterType ? style['active'] : ''}" data-type="filter" data-value="${filterType.value}">
                  ${filterType.label}
                </button>
              `
            )
            .join('')}
        </div>

        <div>
          <button data-type="clear">Clear completed (${this.props.completedItemCount})</button>
        </div>
      </div>
    `;
  }
}
