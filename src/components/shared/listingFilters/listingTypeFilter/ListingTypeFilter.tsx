import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../redux/hooks";
import scss from "./listingTypeFilter.module.scss";
import { setSelectedTypes, setShowMenu } from "./slice";
import { AbsDropdownMenu, FlxDropdownMenu } from "../../dropdownWrappers/types";
import AbsoluteDropdownWrapper from "../../dropdownWrappers/absoluteDropdownWrapper/AbsoluteDropdownWrapper";
import FlexDropdownWrapper from "../../dropdownWrappers/flexDropdownWrapper/FlexDropdownWrapper";
import { ListingKindValue } from "../../../../types";

export default function ListingTypeFilter<
  T extends AbsDropdownMenu | FlxDropdownMenu
>({ menuKind, menuStyles, btnStyles, label }: T) {
  const state = useAppSelector((state) => state.listingTypeFilter);

  const dispatch = useDispatch();

  const inUse =
    state.selectedTypes && state.selectedTypes.length > 0 ? true : false;

  function handleShowMenu() {
    dispatch(setShowMenu());
  }

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

  const menuContent = state.types.map((type, index) => {
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
  });

  if (menuKind === "absolute") {
    return (
      <AbsoluteDropdownWrapper
        menuContent={menuContent}
        showMenu={state.showMenu}
        inUse={inUse}
        btnStyles={btnStyles}
        menuStyles={menuStyles}
        label={label}
        handleShowMenu={handleShowMenu}
      />
    );
  }

  if (menuKind === "flex") {
    return (
      <FlexDropdownWrapper
        menuContent={menuContent}
        showMenu={state.showMenu}
        inUse={inUse}
        btnStyles={btnStyles}
        menuStyles={menuStyles}
        label={label}
        handleShowMenu={handleShowMenu}
      />
    );
  }

  return <p>Please enter a value for menuKind</p>;
}
