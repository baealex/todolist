export const createUUID = () => {
  return crypto.randomUUID() as string;
};
