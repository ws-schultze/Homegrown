import React from "react";
import { TypeFetchedListing } from "../../..";

export default function ListingPopup({ listing }: { listing: TypeFetchedListing }) {
  const { basicInfo, address, singleFamilyHome, multiFamilyHome, multiFamilyHomeUnit, apartment, apartmentBuilding } =
    listing.data;

  let bathNum = 0;

  if (singleFamilyHome) {
    bathNum = singleFamilyHome.fullBathrooms.number + singleFamilyHome.halfBathrooms.number;
  }

  return (
    <>
      <img src={listing.data.uploads.images.value[0].url} alt="listing" />

      <div className="body">
        <div className="price"> {basicInfo.price.shortFormatted} </div>

        <div>
          {basicInfo.listingKind.value?.label} {basicInfo.forSaleOrRent.value?.label}
        </div>

        <div className="features">
          {/* Beds */}
          <div>
            {singleFamilyHome ? (
              <>
                <span>{singleFamilyHome.bedrooms.number}bd</span>
              </>
            ) : null}
          </div>
          {/* Baths */}
          <div>
            <span>{bathNum}ba</span>
          </div>
          {/* Sqft */}
          <div>
            <span>
              {singleFamilyHome ? (
                <>
                  {singleFamilyHome.squareFeet.value}ft<sup>2</sup>
                </>
              ) : null}
            </span>
          </div>
        </div>

        <div className="address">{address.formattedAddress.value}</div>
      </div>
    </>
  );
}
