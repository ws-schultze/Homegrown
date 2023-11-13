interface Props {
  streetAddress: string;
  unitNumber?: string;
  city: string;
  state: string;
  zipCode: string;
}

/**
 * Takes the street address, unit number, city, state and zip code that a user has entered,
 * and posts a request to google's address validation api.
 */
export default async function fetchAddressValidation({
  city,
  state,
  zipCode,
  streetAddress,
  unitNumber,
}: Props): Promise<any> {
  const body = {
    address: {
      regionCode: "US",
      locality: city,
      administrativeArea: state,
      postalCode: zipCode,
      addressLines: [streetAddress, unitNumber],
    },
    enableUspsCass: true,
  };

  const response = await fetch(
    `https://addressvalidation.googleapis.com/v1:validateAddress?key=${process.env.REACT_APP_GOOGLE_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  const data = await response.json();
  return data;
}
