import React, { useEffect } from "react";
import styles from "./mobileListView.module.scss";
import { useAppSelector } from "../../../../redux/hooks";
import ListingCard from "../../../shared/listingCard/ListingCard";
import { ReactComponent as ChevronDownSVG } from "../assets/chevron-down-solid.svg";
import { useDispatch } from "react-redux";
import { setShowListView } from "../exploreListingsPageSlice";
import Footer from "../../../shared/footer/Footer";

export default function MobileListView() {
  const pageState = useAppSelector((state) => state.exploreListings);
  const listViewMenuRef = React.useRef<HTMLDivElement>(null);
  const openListViewBtnRef = React.useRef<HTMLButtonElement>(null);
  const dispatch = useDispatch();

  /**
   * Close list view menu when clicking outside of it
   */
  useEffect(() => {
    function handler(e: MouseEvent) {
      const t = e.target as Node;

      // if menu is open and click outside it, close menu
      if (pageState.showListView) {
        if (listViewMenuRef.current) {
          if (!listViewMenuRef.current.contains(t)) {
            // ignore clicks on the menu btn
            if (openListViewBtnRef.current) {
              if (!openListViewBtnRef.current.contains(t)) {
                dispatch(setShowListView(false));
              }
            }
          }
        }
      }
    }

    window.addEventListener("click", handler);

    return () => {
      window.removeEventListener("click", handler);
    };
  }, [listViewMenuRef, pageState.showListView, openListViewBtnRef, dispatch]);

  /**
   * Hide and show the list view menu
   */
  function toggleListViewMenu() {
    dispatch(setShowListView(!pageState.showListView));
  }

  return (
    <>
      <button
        ref={openListViewBtnRef}
        type="button"
        id="list-view-btn"
        className={styles.open_btn}
        onClick={toggleListViewMenu}
      >
        List View
      </button>
      <div
        className={`${styles.container} ${
          pageState.showListView ? styles["is-open"] : styles["is-closed"]
        }`}
      >
        <div
          className={`${styles.menu} ${
            pageState.showListView ? styles["is-open"] : styles["is-closed"]
          }`}
          ref={listViewMenuRef}
        >
          <button
            type="button"
            className={styles.close_btn}
            onClick={toggleListViewMenu}
          >
            <ChevronDownSVG />
          </button>
          {/* <div className={styles.cards_wrap}> */}
          <div className={styles.cards}>
            {pageState.currentFilteredListings.map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} isMobile={true} />
            ))}
            <p className={styles.end}>
              End of listings that are visible on the map
            </p>
            <Footer />
          </div>
          {/* </div> */}
        </div>
      </div>
    </>
  );
}
