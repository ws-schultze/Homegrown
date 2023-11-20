import { useState } from "react";
import { useAppSelector } from "../../../../../redux/hooks";
import { useDispatch } from "react-redux";
import { ListingKindValue } from "../../../../../types";
import ExpandingDropdown from "../../../../shared/dropdownWrappers/expandingDropdown/ExpandingDropdown";
import { setListing } from "../../editListingPageSlice";
import { allListingKinds } from "../../../../../initialValues";
import styles from "../../../../shared/dropdownWrappers/expandingDropdown/expandingDropdown.module.scss";

// interface Props extends ExpandingDropdownProps {}

export default function ListingKindDropdown({
  handleListingKind,
}: {
  handleListingKind: ([]: ListingKindValue[]) => void;
}) {
  const pageState = useAppSelector((state) => state.createListingPage);
  const listing = pageState.listing;
  const [showMenu, setShowMenu] = useState(false);

  const dispatch = useDispatch();

  function handleShowMenu() {
    setShowMenu(!showMenu);
  }

  const menuContent = (
    <>
      {allListingKinds.map((kind: ListingKindValue) => (
        <button
          type="button"
          className={`${
            listing.basicInfo.listingKind.value?.id === kind?.id
              ? styles.active
              : ""
          }`}
          onClick={() => handleListingKind([kind])}
        >
          {kind!.label}
        </button>
      ))}
    </>
  );

  //   const label =
  //     listing.basicInfo.listingKind.value === null
  //       ? "Listing type"
  //       : listing.basicInfo.listingKind.value.label;

  //   return (
  //     <ExpandingDropdown
  //       menuContent={menuContent}
  //       showMenu={showMenu}
  //       label={"Listing type"}
  //       handleShowMenu={handleShowMenu}
  //     />

  //   return (
  //     <div
  //       className={`${styles["container"]} ${
  //         props.containerClassName ? props.containerClassName : ""
  //       }`}
  //       ref={containerRef}
  //     >
  //       <button
  //         type="button"
  //         className={styles.menu_btn}
  //         onClick={props.handleShowMenu}
  //       >
  //         {props.label}
  //         <div className={styles.icon_wrap}>
  //           <Icon
  //             className={`${styles["icon"]} ${
  //               props.showMenu ? styles.open : styles.closed
  //             }`}
  //           />
  //         </div>
  //       </button>

  //       <div
  //         className={`${styles["menu"]} ${
  //           props.showMenu ? styles.open : styles.closed
  //         }`}
  //         ref={menuRef}
  //         onClick={(e) => e.stopPropagation()}
  //       >
  //         {props.menuContent}
  //       </div>
  //       <ErrorMsg errorMsg={errorMsg} />

  //     </div>
  //   );
}
