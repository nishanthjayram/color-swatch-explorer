/**
 * Utility functions for working with wrapped maps, where we wrap a map in an object.
 * This allows us to work with React's state update logic without having to do a
 * deep copy of the map.
 */

export type TQueryKey = `${number}-${number}`; // For fetching colors
export type TWrappedMap<T> = {
  inner: Map<TQueryKey, T>;
};

/**
 * Creates a new wrapped map.
 *
 * This function initializes a new wrapped map, which is an object containing an inner Map.
 *
 * @returns {TWrappedMap<T>} A new wrapped map.
 */
export const createWrappedMap = <T>(): TWrappedMap<T> => {
  return { inner: new Map<TQueryKey, T>() };
};

/**
 * Sets a value in the wrapped map.
 *
 * This function sets a value for a specific key in the wrapped map and returns a new wrapped map.
 *
 * @param {TWrappedMap<T>} map - The wrapped map to update.
 * @param {TQueryKey} key - The key for the value to set.
 * @param {T} value - The value to set for the specified key.
 * @returns {TWrappedMap<T>} A new wrapped map with the updated value.
 */
export const setWrappedMap = <T>(
  map: TWrappedMap<T>,
  key: TQueryKey,
  value: T
): TWrappedMap<T> => {
  map.inner.set(key, value);
  return { inner: map.inner };
};

/**
 * Gets a value from the wrapped map.
 *
 * This function retrieves the value for a specific key from the wrapped map.
 *
 * @param {TWrappedMap<T>} map - The wrapped map to retrieve the value from.
 * @param {TQueryKey} key - The key for the value to retrieve.
 * @returns {T | undefined} The value for the specified key, or undefined if the key does not exist.
 */
export const getWrappedMap = <T>(
  map: TWrappedMap<T>,
  key: TQueryKey
): T | undefined => map.inner.get(key);
