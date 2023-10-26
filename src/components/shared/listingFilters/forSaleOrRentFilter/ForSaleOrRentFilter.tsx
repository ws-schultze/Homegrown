import { useRef } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../redux/hooks";
import useCloseDropdown from "../hooks/useCloseDropdown";
import { DropdownStyles, ForSaleOrRentValue } from "../../../../types/index";
import { setForSaleOrRent, setShowMenu } from "./slice";
// import flx from "../scss/flex.module.scss";
// import abs from "../scss/absolute.module.scss";
import scss from "./forSaleOrRentFilter.module.scss";
import { ReactComponent as Icon } from "../assets/chevron-down.svg";

interface Props {
  /**
   * absolute menus have absolute position an don't respect padding of the  *   parent and appear above siblings
   *
   * flex menus display a flex column that will respect parent padding and
   will appear next to siblings
   */
  menuKind: "absolute" | "flex";
  styles: DropdownStyles;
  label: string;
  /**
   * Menu closes when user clicks outside of container.
   * Default is true
   */
  closeOnOutsideClick?: boolean;
}

export default function ForSaleOrRentFilter({
  menuKind,
  styles,
  label,
  closeOnOutsideClick = true,
}: Props) {
  const state = useAppSelector((state) => state.forSaleOrRentFilter);
  const dispatch = useDispatch();
  const inUse =
    state.selectedItem !== null && state.selectedItem.id !== "for-sale-or-rent"
      ? true
      : false;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useCloseDropdown({
    menuIsOpen: state.showMenu,
    closeOnOutsideClick,
    containerRef,
    menuRef,
    setShowMenu,
    reducers: [setForSaleOrRent],
  });

  function handleSelectedItem(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: ForSaleOrRentValue
  ) {
    // Keep menu from closing when an item is clicked
    e.stopPropagation();
    // Set state
    dispatch(setForSaleOrRent(item));
  }

  if (menuKind === "absolute") {
    return (
      <div
        className={`${scss["abs-container"]} ${inUse ? scss.used : ""}`}
        ref={containerRef}
        onClick={() => dispatch(setShowMenu())}
        style={{
          width: styles.btnWidth,
          minHeight: styles.btnHeight,
          maxHeight: styles.btnHeight,
        }}
      >
        {state.selectedItem?.label || label}
        <div className={scss["abs-icon-wrap"]}>
          <Icon
            className={`${scss["abs-icon"]} ${
              state.showMenu ? scss["open"] : scss["closed"]
            }`}
          />
        </div>

        <div
          className={`${scss["abs-menu"]} ${
            state.showMenu ? scss["open"] : scss["closed"]
          }`}
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
        >
          {state.menuItems.map((item, i) => {
            if (item !== null) {
              return (
                <div
                  className={scss.radio}
                  key={i}
                  onClick={(e) => handleSelectedItem(e, item)}
                >
                  <label>
                    <input
                      type="radio"
                      checked={
                        state.selectedItem && state.selectedItem?.id === item.id
                          ? true
                          : false
                      }
                      readOnly
                    />

                    {item.label}
                  </label>
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
      </div>
    );
  }

  if (menuKind === "flex") {
    return (
      <div
        className={`${scss["flx-container"]} ${inUse ? scss.used : ""}`}
        ref={containerRef}
      >
        <div
          className={scss["flx-btn"]}
          onClick={() => dispatch(setShowMenu())}
          style={{
            width: styles.btnWidth,
            minHeight: styles.btnHeight,
            maxHeight: styles.btnHeight,
          }}
        >
          {state.selectedItem?.label || label}
          <div className={scss["flx-icon-wrap"]}>
            <Icon
              className={`${scss["flx-icon"]} ${
                state.showMenu ? scss.open : scss.closed
              }`}
            />
          </div>
        </div>

        <div
          className={`${scss["flx-menu"]} ${
            state.showMenu ? scss.open : scss.closed
          }`}
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
        >
          {state.menuItems.map((item, i) => {
            if (item !== null) {
              return (
                <div
                  key={i}
                  onClick={(e) => handleSelectedItem(e, item)}
                  className={scss.radio}
                >
                  <label>
                    <input
                      type="radio"
                      checked={
                        state.selectedItem && state.selectedItem?.id === item.id
                          ? true
                          : false
                      }
                      readOnly
                    />

                    {item.label}
                  </label>
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
      </div>
    );
  }

  return <p>Please enter a value for menuKind</p>;
}
