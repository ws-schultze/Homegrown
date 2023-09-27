interface Props {
  discountPrice: number;
  originalPrice: number;
}

/**
 * Check is a discount price is greater that $1 and less than the given original price.
 * To apply a discount, the original price must be at least $2 when using whole dollar amounts.
 * @param discountPrice number
 * @param originalPrice number
 * @returns true/false
 */
export default function validateDiscountPrice({ discountPrice, originalPrice }: Props): boolean {
  if (originalPrice >= 2) {
    if (discountPrice >= 1 && discountPrice < originalPrice) {
      return true;
    } else if (discountPrice < 1 || discountPrice >= originalPrice) {
      return false;
    } else {
      throw new Error(`Something went wrong during discount validation`);
    }
  } else {
    return false;
  }
}
