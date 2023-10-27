import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../redux/hooks";
import { ForSaleOrRentValue } from "../../../../types/index";
import { setForSaleOrRent, setShowMenu } from "./slice";
import scss from "./forSaleOrRentFilter.module.scss";
import FlexDropdownWrapper from "../../dropdownWrappers/flexDropdownWrapper/FlexDropdownWrapper";
import AbsoluteDropdownWrapper from "../../dropdownWrappers/absoluteDropdownWrapper/AbsoluteDropdownWrapper";
import { AbsDropdownMenu, FlxDropdownMenu } from "../../dropdownWrappers/types";

export default function ForSaleOrRentFilter<
  T extends AbsDropdownMenu | FlxDropdownMenu
>({ menuKind, menuStyles, btnStyles, label }: T) {
  const state = useAppSelector((state) => state.forSaleOrRentFilter);
  const dispatch = useDispatch();
  const inUse =
    state.selectedItem !== null && state.selectedItem.id !== "for-sale-or-rent"
      ? true
      : false;

  function handleShowMenu() {
    dispatch(setShowMenu());
  }

  function handleSelectedItem(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: ForSaleOrRentValue
  ) {
    // Keep menu from closing when an item is clicked
    e.stopPropagation();
    // Set state
    dispatch(setForSaleOrRent(item));
  }

  const dropdownLabel = state.selectedItem?.label
    ? state.selectedItem?.label
    : label;

  const menuContent = state.menuItems.map((item, i) => {
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
  });

  if (menuKind === "absolute") {
    return (
      <AbsoluteDropdownWrapper
        menuContent={menuContent}
        showMenu={state.showMenu}
        inUse={inUse}
        btnStyles={btnStyles}
        menuStyles={menuStyles}
        label={dropdownLabel}
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
        label={dropdownLabel}
        handleShowMenu={handleShowMenu}
      />
    );
  }

  return <p>Please enter a value for menuKind</p>;
}
