import { Address, Str } from "../../../types";

export interface InputProps {
  /**
   * Example: If this is used for a first name input, the state will be the first name object of type Str
   */
  state: Str;
  /**
   * Inputs placeholder
   */
  placeholder: string;
  /**
   * Style for the div that contains the label and input
   */
  containerClassName?: string;
  /**
   * Style for the inputs label
   */
  labelClassName?: string;
  /**
   * Style for the input
   */
  inputClassName?: string;
  /**
   * returns state object of type T to parent for state management handling
   */
  handleInput: (state: Str) => void;
  /**
   * @param state Some state of type T. If the form is for agent info, then agent will be the state.
   * @param stateSetter If using redux, this is where dispatch(setSomeState(value)) can retrieve the new address object and apply its parts to fill in the rest of the address form.
   * @param inputRef the ref for the input value used to trigger the google places autocomplete widget, such as a street number input.
   * @param autocompleteWidget the autocomplete widget gets stored in the components local state and is set by setAutocompleteWidget
   * @param setAutocompleteWidget sets autocomplete widget to component's local state
   */
  handleAutocompleteWidget?: (
    state: Str,
    stateSetter: (address: Address) => void,
    inputRef: React.MutableRefObject<HTMLInputElement>,
    autocompleteWidget: google.maps.places.Autocomplete,
    setAutocompleteWidget: (
      value: React.SetStateAction<google.maps.places.Autocomplete | null>
    ) => void
  ) => void;
}

interface PriceInputProps extends InputProps {
  /**
   * Price object from that parent/redux
   */
  state: Str;
  /**
   * For money consider [",", "."]
   */
  groupSeparators: string[];
  /**
   * Minimum price that the input can be
   */
  minPrice: number;
  /**
   * For the dollar use "USD" see MDN for more info about Intl.NumberFormat()
   */
  currency: string;
  /**
   * For the dollar use '$'
   */
  prefix: string;
  /**
   * Is this price input being used to filter things?
   * If so, there will be no error messages when the input
   * is empty, and the value is always valid.
   */
  isPriceFilter: boolean;
  /**
   * Prop used to determine whether or not error message handling should happen
   */
  isDiscountPrice: boolean;
}
