import { useEffect } from "react";
import {
  formatCommaSeparatedWithDecimal,
  removeNonNumericChars,
} from "../../utils";
import { Str } from "../../../../../types";

export default function useFormatDiscountPricePercentage(
  discountPriceState: Str,
  originalPrice: number,
  setPriceChangePercent: (num: number) => void,
  setFormattedPercent: (ftm: string) => void
) {
  const currentDiscountPrice = discountPriceState.number;

  /**
   * Format the price input
   */
  useEffect(
    () => {
      if (originalPrice && currentDiscountPrice) {
        const percent = (
          (currentDiscountPrice / originalPrice) * 100 -
          100
        ).toFixed(2);
        setPriceChangePercent(Number(percent));
        const cleanPercent = removeNonNumericChars(percent);
        const formattedPercent = formatCommaSeparatedWithDecimal(cleanPercent);
        setFormattedPercent(formattedPercent);
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
