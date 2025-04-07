interface Position {
  x: number;
  y: number;
}

interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export const isInRect = (position: Position, rect: Rect) => {
  return rect.left <= position.x && rect.right >= position.x && rect.top <= position.y && rect.bottom >= position.y;
};
