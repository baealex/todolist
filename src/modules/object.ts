export const diff = <T>(obj1: T, obj2: T) => {
  return Object.keys(obj1 as Record<string, unknown>).reduce<(keyof T)[]>((acc, key) => {
    const _key = key as keyof T;
    if (!obj1[_key] && !obj2[_key]) {
      return acc;
    }
    if (obj1[_key] !== obj2[_key]) {
      return [...acc, _key];
    }
    return acc;
  }, []);
};
