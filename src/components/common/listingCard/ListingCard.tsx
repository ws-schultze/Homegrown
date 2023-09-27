import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { ReactComponent as DeleteIcon } from "../../../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon } from "../../../assets/svg/editIcon.svg";
import { TypeFetchedListing } from "../../..";
import { ReactComponent as ImageSVG } from "../../../assets/svg/image-regular.svg";
import css from "./styles.module.css";

interface Props {
  listing: TypeFetchedListing;
  // emitListingToOverlay: (listing: TypeFetchedListing) => void;
  handleEdit?: (listingId: string) => void;
  handleDelete?: (listingId: string) => Promise<void>;
}

export default function ListingCard({
  listing,
  // emitListingToOverlay,
  handleDelete,
  handleEdit,
}: Props): JSX.Element {
  const {
    basicInfo,
    address,
    agent,
    owner,
    company,
    privateOwner,
    singleFamilyHome,
    multiFamilyHome,
    multiFamilyHomeUnit,
    apartment,
    apartmentBuilding,
    land,
    uploads,
    userRef,
  } = listing.data;

  const auth = getAuth();
  const params = useParams();
  const postal_code = getPostalCode();

  /**
   * Get the simple postal_code (e.g. 95490) not the
   * one including the postal_code_suffix (e.g. 95490-1234)
   * @returns postal_code string without the postal_code_suffix
   */
  function getPostalCode(): string {
    let postal_code = "";
    for (const key in listing.data.address.address_components) {
      let component = listing.data.address.address_components[key];
      // console.log(component);
      for (const key in component) {
        //@ts-ignore
        if (key === "types" && component[key].includes("postal_code")) {
          postal_code = component["long_name"];
        }
      }
    }

    return postal_code;
  }

  return (
    <div className={css.container}>
      {listing ? (
        <div className="listing-card">
          <Link
            to={`/explore-listings/details/${listing.data.address.formattedAddress.value}/${listing.id}`}
            className="listing-card__link"
          >
            {listing.data.uploads.images.value[0] !== undefined ? (
              <img
                src={listing.data.uploads.images.value[0].url}
                alt={"listing"}
              />
            ) : (
              <ImageSVG />
            )}
            <div className="body">
              <>
                <div>
                  {/* Header */}
                  <div>
                    <b>{listing.data.basicInfo.price.shortFormatted}</b>
                    {" - "}
                    {basicInfo.listingKind.value?.label}{" "}
                    {listing.data.basicInfo.forSaleOrRent.value?.label}
                  </div>
                </div>

                {/* Features */}
                {singleFamilyHome || multiFamilyHomeUnit || apartment ? (
                  <div className="features">
                    {/* Bedrooms */}
                    <div>
                      <b>
                        {singleFamilyHome?.bedrooms.number ||
                          multiFamilyHomeUnit?.bedrooms.number ||
                          apartment?.bedrooms.number}
                      </b>
                      bd
                    </div>
                    {" - "}

                    {/* Bathrooms */}
                    <div>
                      <b>
                        {singleFamilyHome?.fullBathrooms.number! +
                          singleFamilyHome?.halfBathrooms.number! * 0.5 ||
                          multiFamilyHomeUnit?.fullBathrooms.number! +
                            multiFamilyHomeUnit?.halfBathrooms.number! * 0.5 ||
                          apartment?.fullBathrooms.number! +
                            apartment?.halfBathrooms.number! * 0.5}
                      </b>
                      ba
                    </div>
                    {" - "}

                    {/* Square feet */}
                    <div>
                      <b>
                        {singleFamilyHome?.squareFeet.formatted ||
                          multiFamilyHomeUnit?.squareFeet.formatted ||
                          apartment?.squareFeet.formatted}
                      </b>
                      ft<sup>2</sup>
                    </div>
                  </div>
                ) : null}
              </>

              {/* Address */}
              <div className="listing-card__address">
                {listing.data.address.formattedAddress.value}
              </div>

              {/* Lister */}
              <div className="listing-card__lister">
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
            <div className="listing-card__btns">
              {handleDelete ? (
                <button type="button" className="listing-card__btn">
                  {
                    <DeleteIcon
                      className="removeListingSvg"
                      onClick={() => handleDelete(listing.id)}
                    />
                  }
                </button>
              ) : null}
              {handleEdit ? (
                <button type="button" className="listing-card__btn">
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
