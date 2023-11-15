import React, { useRef, useState } from "react";
import { handleAutocompleteWidget, validateName } from "../utils";
import ErrorMsg from "../../errorMsg/ErrorMsg";
import styles from "../scss/inputs.module.scss";
import { Address, AddressOptional, Str } from "../../../../types";
import { InputProps } from "../inputProps";

export interface Props extends InputProps {
  /**
   * Passes a new address object back to parent so the rest of the address
   * form's fields can be auto populated with the data retrieved from
   * Google Places Autocomplete widget
   * @param state Address | AddressOptional
   */
  handleAutocompletedAddress: (state: Address | AddressOptional) => void;
}

/**
 * Notice that this component only formats objects of Str
 */
export default function AddressAutocompleteInput(props: Props) {
  const [autocompleteWidget, setAutocompleteWidget] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const {
      target: { value },
    } = e;

    const { valid, errorMsg } = validateName(value, props.state.required);

    const s: Str = {
      ...props.state,
      value: value,
      valid: valid,
      errorMsg: errorMsg,
      required: props.state.required,
      beingVerified: false,
      saved: false,
      readOnly: false,
    };
    props.handleInput(s);

    handleAutocompleteWidget(
      inputRef,
      autocompleteWidget,
      setAutocompleteWidget,
      props.handleAutocompletedAddress
    );
  }

  return (
    <div className={styles.container}>
      <label
        className={` ${
          props.state.value.length > 0 ? styles.show : styles.hide
        }`}
      >
        {props.placeholder}
      </label>
      <input
        placeholder={props.placeholder}
        ref={inputRef}
        type="text"
        value={props.state.value}
        onChange={handleChange}
        disabled={props.state.readOnly}
      />
      <ErrorMsg errorMsg={props.state.errorMsg} />
    </div>
  );
}
