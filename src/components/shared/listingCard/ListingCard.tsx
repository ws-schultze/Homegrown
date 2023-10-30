import React from "react";
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { ReactComponent as DeleteIcon } from "../../../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon } from "../../../assets/svg/editIcon.svg";
import * as T from "../../../types/index";
import { ReactComponent as ImageSVG } from "../../../assets/svg/image-regular.svg";
import styles from "./listingCard.module.scss";
import Spinner from "../loaders/Spinner";
import { useDispatch } from "react-redux";
import {
  setListingToOverlay,
  setShowFullOverlay,
} from "../../pages/exploreListingsPage/exploreListingsPageSlice";

interface Props {
  listing: T.FetchedListing;
  isMobile?: boolean;
  handleEdit?: (listingId: string) => void;
  handleDelete?: (listingId: string) => Promise<void>;
}

export default function ListingCard({
  listing,
  isMobile,
  handleDelete,
  handleEdit,
}: Props): JSX.Element {
  const auth = getAuth();
  const dispatch = useDispatch();

  if (!listing) {
    return <Spinner size="small" />;
  }

  return (
    <div className={styles.container}>
      {listing ? (
        <div className={` ${isMobile ? styles["mobile-card"] : styles.card}`}>
          <Link
            to={`/explore-listings/details/${listing.data.address.formattedAddress.value}/${listing.id}`}
            className={styles.link}
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
                  <div>
                    <b>{listing.data.basicInfo.price.shortFormatted}</b>
                    {" - "}
                    {listing.data.basicInfo.listingKind.value?.label}{" "}
                    {listing.data.basicInfo.forSaleOrRent.value?.label}
                  </div>
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
                    {" - "}

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
                    {" - "}

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
                  </div>
                ) : null}
              </>

              {/* Address */}
              <div className={styles.address}>
                {listing.data.address.formattedAddress.value}
              </div>

              {/* Lister */}
              <div className={styles.lister}>
                {listing.data.agent ? (
                  <div>Listed by: {listing.data.agent.companyName.value}</div>
                ) : listing.data.owner ? (
                  <div>For Sale by Owner</div>
                ) : listing.data.company ? (
                  <div>Listed by: {listing.data.company.name.value}</div>
                ) : listing.data.privateOwner ? (
                  <div>For Rent by Owner</div>
                ) : null}
              </div>
            </div>
          </Link>
          {auth.currentUser !== null &&
          listing.data.userRef.uid === auth.currentUser.uid &&
          (handleDelete !== undefined || handleEdit !== undefined) ? (
            <div className={styles.btns}>
              {handleDelete ? (
                <button type="button" className={styles.btn}>
                  {
                    <DeleteIcon
                      className="removeListingSvg"
                      onClick={() => handleDelete(listing.id)}
                    />
                  }
                </button>
              ) : null}
              {handleEdit ? (
                <button type="button" className={styles.btn}>
                  {<EditIcon onClick={() => handleEdit(listing.id)} />}
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
