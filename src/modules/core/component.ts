import { diff } from '../object';
import { createUUID } from '../uuid';

export default abstract class Component<T> {
  $el: HTMLElement;
  props: T;
  _prevProps: T;
  _isMounted = false;

  constructor($parent: HTMLElement, props?: T) {
    this.$el = $parent as HTMLElement;
    this.props = props as T;
    this._prevProps = props as T;
  }

  update(props: Partial<T> = {}) {
    this.props = { ...this.props, ...props };

    const diffProps = diff(this._prevProps, this.props);
    this._prevProps = this.props;

    if (this._isMounted) {
      this.render(diffProps.length > 0);
    }
  }

  useSelector<K = HTMLElement>(selector: string): K {
    return this.$el.querySelector(selector) as K;
  }

  abstract mount(): void;
  abstract unmount(): void;
  abstract template(): string;

  render(shouldUpdateDOM = true) {
    window.requestAnimationFrame(() => {
      if (this._isMounted) {
        this.unmount();
      } else {
        this._isMounted = true;
      }
      if (shouldUpdateDOM) {
        const newTemplate = this.template();
        if (this.$el.innerHTML !== newTemplate) {
          this.$el.innerHTML = newTemplate;
        }
      }
      this.mount();
    });
  }

  static wrapper(tag: keyof HTMLElementTagNameMap) {
    const componentId = createUUID();
    return {
      container: `<${tag} data-component-id="${componentId}"></${tag}>`,
      selector: `[data-component-id="${componentId}"]`,
    };
  }
}
