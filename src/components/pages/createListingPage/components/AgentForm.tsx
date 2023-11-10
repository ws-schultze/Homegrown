import React, { useState, useRef } from "react";
import {
  Str,
  AddressValidationApi_Response,
  VerifyActionName,
} from "../../../../types/index";
import { initAgent } from "../../../../initialValues";
import { Wrapper } from "@googlemaps/react-wrapper";
import setAutocompletePlaceValuesToState from "./utils/address/setAutocompletePlaceValuesToState";
import makeAutocompleteWidget from "./utils/address/makeAutocompleteWidget";
import EditFormSection from "./EditFormSection";
import VerifySection from "./VerifySection";
import SaveSection from "./SaveSection";
import setUnitNumberToState from "./utils/setUnitNumberToState";
import { renderMap } from "../../exploreListingsPage/map/mapHelpers";
import styles from "../styles.module.scss";
import { useAppSelector } from "../../../../redux/hooks";
import { useDispatch } from "react-redux";
import {
  setCurrentPageNumber,
  setListing,
  setSavedPages,
} from "../createListingPageSlice";
import NameInput from "../../../shared/inputs/nameInput/NameInput";
import AgentLicenseIdInput from "../../../shared/inputs/agentLicenseIdinput/AgentLicenseIdInput";
import PhoneNumberInput from "../../../shared/inputs/phoneNumberInput/PhoneNumberInput";
import EmailStrInput from "../../../shared/inputs/emailInput/EmailStrInput";
import ErrorMsg from "../../../shared/errorMsg/ErrorMsg";

export default function AgentForm() {
  const pageState = useAppSelector((s) => s.createListingPage);
  const { agent } = pageState.listing;
  const dispatch = useDispatch();
  const [autocompleteWidget, setAutocompleteWidget] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [addressValidationApiResponse, setAddressValidationApiResponse] =
    useState<AddressValidationApi_Response | null>(null);
  const streetRef = useRef<HTMLInputElement | null>(null);

  if (!agent) throw new Error("agent is undefined");

  /**
   * Keeps inputs showing values in parent state on page change
   * Also catches error messages
   */
  // useEffect(() => {
  //   if (parent.agent) {
  //     setState(parent.agent);
  //   } else {
  //     throw new Error("Agent object not found in parent");
  //   }
  // }, [parent]);

  // console.log("Agent.tsx rendered");

  /**
   * Generate the places autocompleteWidget, set it to state and add an event listener to it
   * https://developers.google.com/maps/documentation/javascript/reference/places-widget
   */
  function handleAutocompleteWidget() {
    if (streetRef.current && streetRef.current !== null) {
      const widget = makeAutocompleteWidget(streetRef);
      setAutocompleteWidget(widget);
    }

    // Listen for click on widget item
    if (autocompleteWidget) {
      autocompleteWidget.addListener("place_changed", () => {
        if (agent) {
          const s: typeof agent = setAutocompletePlaceValuesToState<
            typeof agent
          >({
            state: agent,
            autocomplete: autocompleteWidget,
          });
          dispatch(
            setListing({
              ...pageState.listing,
              agent: s,
            })
          );
        }
      });
    }
  }

  function handleInputStr(object: Str, fieldName: keyof typeof agent) {
    if (fieldName === "streetAddress") {
      handleAutocompleteWidget();
    } else if (fieldName === "unitNumber") {
      if (agent) {
        const s: typeof agent = setUnitNumberToState(agent, object);
        dispatch(
          setListing({
            ...pageState.listing,
            agent: s,
          })
        );
      } else {
        console.error("Agent is undefined");
      }
    } else {
      dispatch(
        setListing({
          ...pageState.listing,
          [fieldName]: object,
        })
      );
    }
  }

  function handleVerify(
    actionName: VerifyActionName,
    obj: typeof agent,
    addressValidationApiResponse?: AddressValidationApi_Response
  ) {
    if (addressValidationApiResponse) {
      setAddressValidationApiResponse(addressValidationApiResponse);
    }

    if (
      actionName === "save" ||
      actionName === "edit" ||
      actionName === "blur"
    ) {
      dispatch(
        setListing({
          ...pageState.listing,
          agent: obj,
        })
      );
    } else if (actionName === "verify" && obj!.saved === true) {
      dispatch(
        setListing({
          ...pageState.listing,
          agent: obj,
        })
      );
      dispatch(setSavedPages([1, 2, 3, 4, 5]));
      dispatch(setCurrentPageNumber(5));
    } else if (actionName === "verify" && obj!.saved === false) {
      dispatch(
        setListing({
          ...pageState.listing,
          agent: obj,
        })
      );
      dispatch(setSavedPages([1, 2, 3, 4]));
    } else {
      throw new Error("Whoops");
    }
  }

  return (
    <form>
      {agent.saved === true ? (
        <section>
          <EditFormSection parent={agent} emit={handleVerify} />
        </section>
      ) : null}

      <section>
        <header>Agent Information</header>

        <NameInput
          state={agent.firstName}
          placeholder="First name"
          handleInput={(name) =>
            dispatch(
              setListing({
                ...pageState.listing,
                agent: {
                  ...pageState.listing.agent!,
                  firstName: name,
                },
              })
            )
          }
        />

        <NameInput
          state={agent.middleName}
          placeholder="Middle name*"
          handleInput={(name) =>
            dispatch(
              setListing({
                ...pageState.listing,
                agent: {
                  ...pageState.listing.agent!,
                  middleName: name,
                },
              })
            )
          }
        />

        <NameInput
          state={agent.lastName}
          placeholder="Last name"
          handleInput={(name) =>
            dispatch(
              setListing({
                ...pageState.listing,
                agent: {
                  ...pageState.listing.agent!,
                  lastName: name,
                },
              })
            )
          }
        />

        <NameInput
          state={agent.companyName}
          placeholder="Company name"
          handleInput={(name) =>
            dispatch(
              setListing({
                ...pageState.listing,
                agent: {
                  ...pageState.listing.agent!,
                  companyName: name,
                },
              })
            )
          }
        />

        <div className={styles.flex_row}>
          <AgentLicenseIdInput
            state={agent.licenseId}
            placeholder="License ID"
            handleInput={(state) =>
              dispatch(
                setListing({
                  ...pageState.listing,
                  agent: {
                    ...pageState.listing.agent!,
                    licenseId: state,
                  },
                })
              )
            }
          />

          <PhoneNumberInput
            state={agent.phoneNumber}
            placeholder="Phone number"
            groupSeparators={[")", "-"]}
            handleInput={(state) =>
              dispatch(
                setListing({
                  ...pageState.listing,
                  agent: {
                    ...pageState.listing.agent!,
                    phoneNumber: state,
                  },
                })
              )
            }
          />
        </div>

        <EmailStrInput<Str>
          state={agent.email}
          placeholder="Email"
          handleInput={(state) =>
            dispatch(
              setListing({
                ...pageState.listing,
                agent: {
                  ...pageState.listing.agent!,
                  email: state,
                },
              })
            )
          }
        />

        {/* Address */}
        {/* <Wrapper 
          apiKey={`${process.env.REACT_APP_GOOGLE_API_KEY}`}
          render={renderMap}
          version="beta"
          libraries={["places", "marker"]}
        >
          <InputStr<typeof state>
            size="lg"
            fieldName="streetAddress"
            ref={streetAddressRef}
            placeholder="Street Number"
            formatType="name"
            parent={state.streetAddress}
            emit={handleInputStr}
          />
          <InputStr<typeof state>
            size="md"
            fieldName="unitNumber"
            placeholder="Unit Number*"
            formatType="name"
            parent={state.unitNumber}
            emit={handleInputStr}
          />
          <InputStr<typeof state>
            size="lg"
            fieldName="city"
            placeholder="City"
            formatType="name"
            parent={state.city}
            emit={handleInputStr}
          />
          <div className={styles.flex_row}>
            <InputStr<typeof state>
              size="md"
              fieldName="adminAreaLevel1"
              placeholder="State/Province"
              formatType="name"
              parent={state.adminAreaLevel1}
              emit={handleInputStr}
            />
            <InputStr<typeof state>
              size="md"
              fieldName="zipCode"
              placeholder="Postal Code"
              formatType="name"
              parent={state.zipCode}
              emit={handleInputStr}
            />
          </div>
          <InputStr<typeof state>
            size="lg"
            fieldName="country"
            placeholder="Country"
            formatType="name"
            parent={state.country}
            emit={handleInputStr}
          />
        </Wrapper> */}

        <div className={styles.container}>
          {agent.saved === true ? (
            <section>
              <EditFormSection parent={agent} emit={handleVerify} />
            </section>
          ) : null}

          <section>
            <header>Agent Address</header>

            <Wrapper
              apiKey={`${process.env.REACT_APP_GOOGLE_API_KEY}`}
              render={renderMap}
              version="beta"
              libraries={["places", "marker"]}
            >
              <NameInput
                state={agent.streetAddress}
                placeholder="Street number"
                handleInput={(obj) =>
                  dispatch(
                    setListing({
                      ...pageState.listing,
                      agent: {
                        ...pageState.listing.agent!,
                        streetAddress: obj,
                      },
                    })
                  )
                }
              />

              <NameInput
                state={agent.unitNumber}
                placeholder="Unit number"
                handleInput={(obj) =>
                  dispatch(
                    setListing({
                      ...pageState.listing,
                      agent: {
                        ...pageState.listing.agent!,
                        unitNumber: obj,
                      },
                    })
                  )
                }
              />

              <NameInput
                state={agent.city}
                placeholder="City"
                handleInput={(obj) =>
                  dispatch(
                    setListing({
                      ...pageState.listing,
                      agent: {
                        ...pageState.listing.agent!,
                        city: obj,
                      },
                    })
                  )
                }
              />

              <NameInput
                state={agent.adminAreaLevel1}
                placeholder="State"
                handleInput={(obj) =>
                  dispatch(
                    setListing({
                      ...pageState.listing,
                      agent: {
                        ...pageState.listing.agent!,
                        adminAreaLevel1: obj,
                      },
                    })
                  )
                }
              />

              <NameInput
                state={agent.zipCode}
                placeholder="Postal Code"
                handleInput={(obj) =>
                  dispatch(
                    setListing({
                      ...pageState.listing,
                      agent: {
                        ...pageState.listing.agent!,
                        zipCode: obj,
                      },
                    })
                  )
                }
              />

              <NameInput
                state={agent.country}
                placeholder="Country"
                handleInput={(obj) =>
                  dispatch(
                    setListing({
                      ...pageState.listing,
                      agent: {
                        ...pageState.listing.agent!,
                        country: obj,
                      },
                    })
                  )
                }
              />
            </Wrapper>
          </section>
        </div>
      </section>

      {/* Clear/Save */}
      {agent.saved === false && agent.beingVerified === false ? (
        <SaveSection<typeof agent>
          needsAddressValidation={true}
          parent={agent}
          parentInitialState={initAgent}
          emit={handleVerify}
        />
      ) : null}

      {/* Verify*/}
      {agent.beingVerified === true &&
      addressValidationApiResponse?.result?.address.formattedAddress ? (
        <VerifySection
          parentName="Private Owner"
          parent={agent}
          addressValidationApiResponse={addressValidationApiResponse}
          emit={handleVerify}
          children={
            <div>
              {agent.firstName.formatted}{" "}
              {agent.middleName && agent.middleName.formatted.length > 0
                ? `${agent.middleName.formatted} ${agent.lastName.formatted}`
                : `${agent.lastName.formatted}`}
              <br />
              License# {agent.licenseId.formatted}
              <br />
              {agent.phoneNumber.formatted}
              <br />
              {agent.email.formatted}
              <br />
              {agent.companyName.formatted}
              <br />
              {addressValidationApiResponse.result.address.formattedAddress}
            </div>
          }
        />
      ) : null}
    </form>
  );
}
