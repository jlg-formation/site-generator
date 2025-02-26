export const manageCache = async (
  key: string,
  fn: () => Promise<string>,
): Promise<string> => {
  const cacheKey = "cache-" + key;
  const cache = window.localStorage.getItem(cacheKey);
  if (cache) {
    return cache;
  }
  const response = await fn();
  window.localStorage.setItem(cacheKey, response);
  return response;
};
