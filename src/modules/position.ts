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
  const withinX = rect.left <= position.x && position.x <= rect.right;
  const withinY = rect.top <= position.y && position.y <= rect.bottom;

  return withinX && withinY;
};
