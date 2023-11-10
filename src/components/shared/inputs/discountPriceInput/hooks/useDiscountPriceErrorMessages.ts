import { useEffect } from "react";
import { Str } from "../../../../../types";

export default function useDiscountPriceErrorMessages(
  discountPriceState: Str,
  originalPrice: number,
  handleInput: (obj: Str) => void
) {
  const currentDiscountPrice = discountPriceState.number;
  /**
   * Handle error messages
   */
  useEffect(
    () => {
      // original price is not set and the user tries entering a discount
      if (originalPrice === 0 && currentDiscountPrice >= 1) {
        const obj: Str = {
          ...discountPriceState,
          valid: false,
          errorMsg: "Listing price must be set first",
        };

        handleInput(obj);
      }

      // user enters a discount price after the original price has been set
      if (originalPrice > 0 || discountPriceState.number === 0) {
        const obj: Str = {
          ...discountPriceState,
          errorMsg: "",
        };
        handleInput(obj);
      }
    },
    /**
     * including handleInput or discountPriceState
     * as deps will cause an infinite loop
     */
    // eslint-disable-next-line
    [originalPrice, currentDiscountPrice]
  );
}
