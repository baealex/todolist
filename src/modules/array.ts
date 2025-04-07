export const arrayMove = <T>(array: T[], startIndex: number, endIndex: number) => {
  if (startIndex < 0 || endIndex < 0 || startIndex >= array.length || endIndex >= array.length) {
    throw new Error('Index overflow or underflow.');
  }

  const elementToMove = array[startIndex];
  array.splice(startIndex, 1);
  array.splice(endIndex, 0, elementToMove);

  return array;
};
