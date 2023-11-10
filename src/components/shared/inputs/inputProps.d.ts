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
}
