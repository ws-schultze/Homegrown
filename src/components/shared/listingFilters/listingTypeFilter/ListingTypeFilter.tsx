import { useRef } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../redux/hooks";
import useCloseDropdown from "../hooks/useCloseDropdown";
import { DropdownStyles, ListingKindValue } from "../../../../types/index";

// import flx from "../scss/flex.module.scss";
// import abs from "../scss/absolute.module.scss";
import scss from "./listingTypeFilter.module.scss";
import { ReactComponent as Icon } from "../assets/chevron-down.svg";

import { setSelectedTypes, setShowMenu } from "./slice";

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

export default function ListingTypeFilter({
  menuKind,
  styles,
  label,
  closeOnOutsideClick = true,
}: Props) {
  const state = useAppSelector((state) => state.listingTypeFilter);
  const dispatch = useDispatch();

  /**
   Set an inUse condition, depending on the menu, such as if a max price is set on a price range menu
   */
  const inUse =
    state.selectedTypes && state.selectedTypes.length > 0 ? true : false;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useCloseDropdown({
    menuIsOpen: state.showMenu,
    closeOnOutsideClick,
    containerRef,
    menuRef,
    setShowMenu,
    // reducers: [setSelectedTypes],
  });

  /**
   * Set selected items to state and pass them to parent (Multi-select Menu)
   */
  function handleItemClick(item: ListingKindValue): void {
    let items: ListingKindValue[] = [];

    if (
      state.selectedTypes.findIndex((i) =>
        i && item ? i.id === item.id : undefined
      ) >= 0
    ) {
      // Remove selected item if it's the item being clicked (clicking an active item will inactivate it)
      items = removeSelectedItem(item);
    } else {
      // Add inactive item to selected items
      items = [...state.selectedTypes, item];
    }

    dispatch(setSelectedTypes(items));
  }

  /**
   * Remove item from selected item
   * @returns remaining selected items
   */
  function removeSelectedItem(item: ListingKindValue): ListingKindValue[] {
    if (state.selectedTypes.length >= 1) {
      const copy = { ...state };
      return copy.selectedTypes.filter((itm) => {
        if (itm !== null && item !== null) {
          return itm.id !== item.id;
        } else {
          return undefined;
        }
      });
    } else {
      throw new Error(
        "No options have been selected yet. Cannot remove an option from an empty list!"
      );
    }
  }

  function isSelected(item: ListingKindValue): boolean {
    if (state.selectedTypes.length >= 1) {
      const copy = { ...state };
      return (
        copy.selectedTypes?.filter((i) =>
          i && item ? i.id === item.id : undefined
        ).length > 0
      );
    } else {
      return false;
    }
  }

  if (menuKind === "absolute") {
    return (
      <div
        className={`${scss["abs-container"]} ${
          state.showMenu ? scss["abs-container"] : scss.closed
        } ${inUse ? scss.used : ""}`}
        ref={containerRef}
        onClick={() => dispatch(setShowMenu())}
        style={{
          width: styles.btnWidth,
          minHeight: styles.btnHeight,
          maxHeight: styles.btnHeight,
        }}
      >
        {label || "Dropdown"}
        <div className={scss["abs-icon-wrap"]}>
          <Icon className={scss["abs-icon"]} />
        </div>

        <div
          className={scss["abs-menu"]}
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
        >
          {state.types.map((type, index) => {
            if (type !== null) {
              return (
                <div
                  className={`${scss["menu-item"]} ${
                    isSelected(type) ? scss.selected : ""
                  } `}
                  key={index}
                  onClick={() => handleItemClick(type)}
                >
                  {type.label}
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
        className={`${scss["flx-container"]} ${
          state.showMenu ? scss.open : scss.closed
        } ${inUse ? scss.used : ""}`}
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
          {label}
          <div className={scss["flx-icon-wrap"]}>
            <Icon className={scss["flx-icon"]} />
          </div>
        </div>

        <div
          className={scss["flx-menu"]}
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
        >
          {state.types.map((type, index) => {
            if (type !== null) {
              return (
                <div
                  className={`${scss["menu-item"]} ${
                    isSelected(type) ? scss.selected : ""
                  } `}
                  key={index}
                  onClick={() => handleItemClick(type)}
                >
                  {type.label}
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
