/**
 * Check if two objects are equal by stringifying both and comparing their string representations.
 * @param obj1 object
 * @param obj2 object
 * @returns boolean
 */
export default function compareObjects(obj1: object, obj2: object) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
