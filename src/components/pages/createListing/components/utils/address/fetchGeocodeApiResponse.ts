import { GeocoderApi_Response } from "../../../../../../types/index";
// Use a formatted address string to get geolocation and set it to formData
// https://developers.google.com/maps/documentation/geocoding/start#geocoding-request-and-response-latitudelongitude-lookup

/**
 * Given a formatted address, fetch the geocode api response.
 * https://developers.google.com/maps/documentation/geocoding/start#geocoding-request-and-response-latitudelongitude-lookup
 */
export default async function fetchGeocodeApiResponse(
  formattedAddress: string
): // Promise<google.maps.LatLngLiteral>
Promise<GeocoderApi_Response> {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAddress}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
  );

  // const data = await response.json();

  // const geolocation: google.maps.LatLngLiteral = {
  //   lat: data.results[0]?.geometry.location.lat ?? 0,
  //   lng: data.results[0]?.geometry.location.lng ?? 0,
  // };

  // return geolocation;

  return response.json();
}
