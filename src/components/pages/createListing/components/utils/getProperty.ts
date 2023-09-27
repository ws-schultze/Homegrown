/**
 * Get the value of a given home feature, from state
 * @param obj Some object of type T
 * @param key Some key of Type K that is from obj
 * @returns The value that corresponds to a given key within an object
 */
export default function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}
