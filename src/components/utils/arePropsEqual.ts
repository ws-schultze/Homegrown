/**
 * Check if the old props are the same as the new props. Compare from one render to the next
 * ==========================================================================
 *                        ** NOTICE **
 *         ALL PROPS MUST BE TAKEN INTO ACCOUNT HERE!!
 * ==========================================================================
 * @returns true/false
 */
export function arePropsEqual<T>(oldProps: T, newProps: T): boolean {
  /**
   * Check if two arrays of strings are equal. Order matters.
   * @param a string[] | undefined
   * @param b string[] | undefined
   * @returns boolean
   */
  function strArraysEqual(a: string[] | undefined, b: string[] | undefined) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    /*
     * If you don't care about the order of the elements inside
     * the array, you should sort both arrays here.
     * Please note that calling sort on an array will modify that array.
     * you might want to clone your array first.
     */
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  //TODO: Create a check that determines what type each prop is, then compare old and new prop. If any comparison is false, return false, else return true

  // if (
  //   oldProps.fieldName === newProps.fieldName &&
  //   // compareObjects(oldProps.initialFieldObject, newProps.initialFieldObject) &&
  //   // oldProps.containerLabel === newProps.containerLabel &&
  //   // oldProps.className === newProps.className &&
  //   oldProps.placeholder === newProps.placeholder &&
  //   strArraysEqual(oldProps.groupSeparators, newProps.groupSeparators) &&
  //   oldProps.prefix === newProps.prefix &&
  //   oldProps.isPriceChange === newProps.isPriceChange &&
  //   oldProps.originalPrice === newProps.originalPrice &&
  //   oldProps.formatType === newProps.formatType &&
  //   oldProps.min === newProps.min &&
  //   oldProps.max === newProps.max &&
  //   JSON.stringify(oldProps.parent) === JSON.stringify(newProps.parent) &&
  //   // compareObjects(oldProps.parent, newProps.parent) &&
  //   oldProps.emit === newProps.emit // useCallback in the parent should make this true/false
  // ) {
  //   console.log("All props are the same...");
  //   return true;
  // } else {
  //   console.log("All props are NOT the same...");
  //   return false;
  // }

  return false;
}
