import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { ReactComponent as DeleteIcon } from "../../../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon } from "../../../assets/svg/editIcon.svg";
import * as T from "../../../types/index";
import { ReactComponent as ImageSVG } from "../../../assets/svg/image-regular.svg";
import styles from "./listingCard.module.scss";
import Spinner from "../loaders/Spinner";

interface Props {
  listing: T.FetchedListing;
  handleEdit?: (listingId: string) => void;
  handleDelete?: (listingId: string) => Promise<void>;
}

export default function ListingCard({
  listing,
  handleDelete,
  handleEdit,
}: Props): JSX.Element {
  console.log("ListingCard listing: ", listing);
  // const [listing, setListing] = useState(listing)
  // const {
  //   basicInfo,
  //   address,
  //   agent,
  //   owner,
  //   company,
  //   privateOwner,
  //   singleFamilyHome,
  //   multiFamilyHome,
  //   multiFamilyHomeUnit,
  //   apartment,
  //   apartmentBuilding,
  //   land,
  //   uploads,
  //   userRef,
  // } = listing.data;

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
    console.log(
      "Address components: ",
      listing.data.address.address_components
    );
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

  if (!listing) {
    return <Spinner size="small" />;
  }

  console.log("Listing to put on card: ", listing);

  return (
    <div className={styles.container}>
      {listing ? (
        <div className={styles.card}>
          <Link
            to={`/explore-listings/details/${listing.data.address.formattedAddress.value}/${listing.id}`}
            className={styles.link}
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
