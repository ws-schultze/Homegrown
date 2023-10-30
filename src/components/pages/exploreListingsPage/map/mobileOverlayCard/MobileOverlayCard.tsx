import { FetchedListing } from "../../../../../types";
import styles from "./mobileOverlayCard.module.scss";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import {
  setHoveredListing,
  setListingToOverlay,
  setShowFullOverlay,
} from "../../exploreListingsPageSlice";

import { Link } from "react-router-dom";
import { ReactComponent as ImageSVG } from "./assets/image-regular.svg";
import { ReactComponent as ChevronDownSVG } from "./assets/chevron-down.svg";

interface Props {
  listing: FetchedListing;
}

export default function MobileOverlayCard({ listing }: Props) {
  const dispatch = useDispatch();

  return (
    <div className={styles.container}>
      <button
        type="button"
        onClick={() => {
          dispatch(setListingToOverlay(undefined));
          dispatch(setHoveredListing(undefined));
        }}
        className={styles.close}
      >
        <ChevronDownSVG />
      </button>
      {listing ? (
        <Link
          to={`/explore-listings/details/${listing.data.address.formattedAddress.value}/${listing.id}`}
          className={styles.card}
          onClick={() => {
            dispatch(setListingToOverlay(listing));
            dispatch(setShowFullOverlay(true));
          }}
        >
          {listing.data.uploads.images.value[0] !== undefined ? (
            <img
              src={listing.data.uploads.images.value[0].url}
              alt={"listing"}
            />
          ) : (
            <ImageSVG />
          )}
          <div className={styles.body}>
            <>
              <div>
                {/* <div>
                  <b>{listing.data.basicInfo.price.shortFormatted}</b>
                  {" - "}
                  {listing.data.basicInfo.listingKind.value?.label}{" "}
                  {listing.data.basicInfo.forSaleOrRent.value?.label}
                </div> */}
              </div>

              {/* Features */}
              {listing.data.singleFamilyHome ||
              listing.data.multiFamilyHomeUnit ||
              listing.data.apartment ? (
                <div className={styles.features}>
                  {/* Bedrooms */}
                  <div>
                    <b>
                      {listing.data.singleFamilyHome?.bedrooms.number ||
                        listing.data.multiFamilyHomeUnit?.bedrooms.number ||
                        listing.data.apartment?.bedrooms.number}
                    </b>
                    bd
                  </div>

                  {/* Bathrooms */}
                  <div>
                    <b>
                      {listing.data.singleFamilyHome?.fullBathrooms.number! +
                        listing.data.singleFamilyHome?.halfBathrooms.number! *
                          0.5 ||
                        listing.data.multiFamilyHomeUnit?.fullBathrooms
                          .number! +
                          listing.data.multiFamilyHomeUnit?.halfBathrooms
                            .number! *
                            0.5 ||
                        listing.data.apartment?.fullBathrooms.number! +
                          listing.data.apartment?.halfBathrooms.number! * 0.5}
                    </b>
                    ba
                  </div>

                  {/* Square feet */}
                  <div>
                    <b>
                      {listing.data.singleFamilyHome?.squareFeet.formatted ||
                        listing.data.multiFamilyHomeUnit?.squareFeet
                          .formatted ||
                        listing.data.apartment?.squareFeet.formatted}
                    </b>
                    ft<sup>2</sup>
                  </div>

                  <div>
                    <b>{listing.data.basicInfo.price.shortFormatted}</b>
                  </div>
                </div>
              ) : null}
            </>

            {/* Address */}
            <div className={styles.address}>
              {listing.data.address.formattedAddress.value}
            </div>
          </div>
        </Link>
      ) : null}
    </div>
  );
}
