import Component from '~/modules/core/component';

import style from './TodoListItems.module.css';
import { Fallback } from '~/components/shared/Fallback/Fallback';
import { TodoItemInterface } from '../models/todo-item.model';
import { DragAndDrop } from '~/modules/drag-and-drop';

export interface TodoListItemsProps {
  items: TodoItemInterface[];
  onComplete: (id: string) => void;
  dndFeature?: {
    onDrop: (startId: string, endId: string) => void;
  };
}

export class TodoListItems extends Component<TodoListItemsProps> {
  $ul?: HTMLUListElement;
  dnd?: DragAndDrop;

  constructor($el: HTMLElement, props: TodoListItemsProps) {
    super($el, props);
  }

  handleItemComplete = (e: MouseEvent) => {
    const target = e.target as HTMLInputElement;
    if (!target) return;

    const id = target.dataset['id'];
    if (id) {
      e.preventDefault();
      this.props.onComplete(id);
    }
  };

  mount(): void {
    if (this.props.dndFeature) {
      this.dnd = new DragAndDrop({
        onDrop: (startIndex, endIndex) => {
          const startId = this.props.items[startIndex].id;
          const endId = this.props.items[endIndex].id;
          this.props.dndFeature?.onDrop(startId, endId);
        },
      });
      this.dnd.draggable(`.${style.item}`);
      this.dnd.dropzone(`.${style['todo-items']}`);
      this.dnd.enable();
    }
    this.$el.addEventListener('click', this.handleItemComplete);
  }

  unmount(): void {
    this.dnd?.disable();
    this.$el.removeEventListener('click', this.handleItemComplete);
  }

  template() {
    return `
      <ul class="${style['todo-items']}">
        ${Fallback.render({
          fallback: ({ isEmpty, isError }) => {
            if (isEmpty) {
              return `<div class="${style.empty}">There are no items here!</div>`;
            }
            if (isError) {
              return `<div class="${style.error}">Failed to load items :(</div>`;
            }
            return '';
          },
          children: () =>
            this.props.items
              .map(
                (item) => `
                  <li class="${style.item} ${item.isCompleted ? style['is-complete'] : ''}">
                    <label>
                      <input style="display: none;" type="checkbox" data-id="${item.id}" ${item.isCompleted ? 'checked' : ''} />
                      <div class="${style['clickable-area']}">
                        <div class="${style.checkbox}" role="button" aria-label="Complete" tabindex="0">
                          <svg class="${style['checkbox-icon']}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <span>${item.content}</span>
                      </div>
                    </label>
                    ${
                      this.props.dndFeature
                        ? `
                          <div class="drag-handler ${style['drag-handler']}" role="button" aria-label="Drag and Drop">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round">
                              <path d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                          </div>
                        `
                        : ''
                    }
                  </li>
                `
              )
              .join(''),
        })}
      </ul>
    `;
  }
}
