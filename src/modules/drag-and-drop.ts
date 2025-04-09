import { applyStyle } from './element';
import { isInRect } from './position';

interface DndEvent {
  onDrop: (startIndex: number, endIndex: number) => void;
}

class DropzoneElement {
  $dropzone: HTMLElement | null = null;

  className = {
    isDragging: 'is-dragging',
  };

  setDropzone(selector: string) {
    this.$dropzone = document.querySelector(selector);
  }

  dragStart(mirrorElement: MirrorElement) {
    this.$dropzone?.classList.add(this.className.isDragging);
    this.$dropzone?.appendChild(mirrorElement.$mirror!);
  }

  dragEnd(mirrorElement: MirrorElement) {
    this.$dropzone?.classList.remove(this.className.isDragging);
    this.$dropzone?.removeChild(mirrorElement.$mirror!);
  }
}

class DraggableElement {
  $draggable: HTMLElement[] = [];
  $dragTarget: HTMLElement | null = null;
  $dropTarget: HTMLElement | null = null;

  className = {
    dragTarget: 'drag-target',
    dropTarget: 'drop-target',
  };

  setDraggable(selector: string) {
    this.$draggable = Array.from(document.querySelectorAll(selector));
  }

  dragStart(dragTarget: HTMLElement) {
    this.$dragTarget = dragTarget;
    this.$dragTarget.classList.add(this.className.dragTarget);
  }

  dragEnd() {
    const indexMap = {
      startIndex: this.$draggable.findIndex((element) => element === this.$dragTarget),
      endIndex: this.$draggable.findIndex((element) => element === this.$dropTarget),
    };

    this.$dragTarget?.classList.remove(this.className.dragTarget);
    this.$dragTarget = null;
    this.deselectDropTarget();

    return indexMap;
  }

  findDropTarget({ x, y }: { x: number; y: number }) {
    return this.$draggable.find((element) => {
      if (element === this.$dragTarget) return false;
      return isInRect({ x, y }, element.getBoundingClientRect());
    });
  }

  selectDropTarget(target: HTMLElement) {
    this.$dropTarget = target;
    target.classList.add(this.className.dropTarget);
  }

  deselectDropTarget() {
    this.$dropTarget = null;
    this.$draggable.forEach((element) => element.classList.remove(this.className.dropTarget));
  }
}

class MirrorElement {
  $mirror: HTMLElement | null = null;
  startX = 0;
  startY = 0;

  create(target: HTMLElement, { startX, startY }: { startX: number; startY: number }) {
    this.startX = startX;
    this.startY = startY;
    this.$mirror = target.cloneNode(true) as HTMLElement;
    applyStyle(this.$mirror, {
      pointerEvents: 'none',
      position: 'fixed',
      opacity: '0.8',
      width: `${target.getBoundingClientRect().width}px`,
      top: `${target.getBoundingClientRect().top}px`,
      left: `${target.getBoundingClientRect().left}px`,
    });
  }

  move({ x, y }: { x: number; y: number }) {
    if (!this.$mirror) return;
    applyStyle(this.$mirror, {
      transform: `translate(${x - this.startX}px, ${y - this.startY}px)`,
    });
  }

  remove() {
    if (!this.$mirror) return;
    this.$mirror = null;
  }
}

export class DragAndDrop {
  event: DndEvent;

  isDragging = false;
  dropzoneSelector = '';
  draggableSelector = '';

  element = {
    draggable: new DraggableElement(),
    dropzone: new DropzoneElement(),
    mirror: new MirrorElement(),
  };

  className = {
    dragHandler: 'drag-handler',
  };

  constructor(event: DndEvent) {
    this.event = event;
  }

  dropzone(selector: string) {
    this.dropzoneSelector = selector;
    this.element.dropzone.setDropzone(selector);
  }

  draggable(selector: string) {
    this.draggableSelector = selector;
    this.element.draggable.setDraggable(selector);
  }

  enable() {
    window.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  disable() {
    window.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  getClosest(e: MouseEvent, selector: string) {
    return ((e?.target as HTMLElement).closest?.(selector) as HTMLElement) || null;
  }

  handleMouseDown = (e: MouseEvent) => {
    const dragHandler = this.getClosest(e, `.${this.className.dragHandler}`);
    if (dragHandler && !this.isDragging) {
      const target = this.getClosest(e, this.draggableSelector);
      if (!target) return;

      this.isDragging = true;
      this.element.mirror.create(target, { startX: e.clientX, startY: e.clientY });
      this.element.dropzone.dragStart(this.element.mirror);
      this.element.draggable.dragStart(target);
    }
  };

  handleMouseMove = (e: MouseEvent) => {
    if (this.isDragging) {
      this.element.draggable.deselectDropTarget();
      this.element.mirror.move({ x: e.clientX, y: e.clientY });
      if (!this.getClosest(e, this.dropzoneSelector)) {
        return;
      }
      const $dropTarget = this.element.draggable.findDropTarget({ x: e.clientX, y: e.clientY });
      if (!$dropTarget) {
        return;
      }
      this.element.draggable.selectDropTarget($dropTarget);
    }
  };

  handleMouseUp = () => {
    if (this.isDragging) {
      const { startIndex, endIndex } = this.element.draggable.dragEnd();
      if (startIndex !== endIndex && startIndex !== -1 && endIndex !== -1) {
        this.event.onDrop(startIndex, endIndex);
      }
      this.element.dropzone.dragEnd(this.element.mirror);
      this.element.mirror.remove();
      this.isDragging = false;
    }
  };
}
