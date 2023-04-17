export const exclude = <T, Key extends keyof T>(
  model: T,
  keys: Key[],
): Omit<T, Key> => {
  for (const key of keys) {
    delete model[key];
  }
  return model;
};
