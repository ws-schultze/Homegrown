import React, { useState, useEffect, useRef } from "react";
import { ReactComponent as Icon } from "../../../assets/svg/dropdownIcon.svg";
import { ReactComponent as CloseIcon } from "../../../assets/svg/closeIcon.svg";
import ErrorMsg from "../errorMsg/ErrorMsg";
import styles from "./dropdown.module.scss";

export type DropdownMenuItem = {
  id: string;
  label: string;
};

export default function Dropdown<T extends DropdownMenuItem | null>({
  parent,
  placeHolder,
  menuItems,
  isMulti,
  isSearchable,
  disabled,
  errorMsg,
  label,
  emit,
}: {
  placeHolder: string;
  menuItems: T[];
  isMulti: boolean;
  isSearchable: boolean;
  disabled: boolean;
  parent: T[];
  errorMsg: string;
  label: string;
  emit: (options: T[]) => void;
}): JSX.Element {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedItems, setSelectedItems] = useState<T[] | []>(parent);
  const [searchValue, setSearchValue] = useState("");
  const searchRef = useRef<HTMLInputElement | null>(null);
  const parentRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSelectedItems(parent);
  }, [parent]);

  /*
   * Focus the search box when menu opens
   */
  useEffect(() => {
    setSearchValue("");
    if (showMenu && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showMenu]);

  /**
   * Handle closing the menu when items are clicked
   */
  useEffect(() => {
    function handler(e: MouseEvent): void {
      const target = e.target as Node;
      // For single select menus, clicking anywhere in the window, except the search box, will close the menu.
      if (!isMulti) {
        if (parentRef.current && !parentRef.current.contains(target)) {
          setShowMenu(false);
        }
      } else if (isMulti) {
        // For multi select menus, clicking the parent/input div,
        // or outside the currently open menu, will close it.

        // ---- Notes about closing multi select menu ----
        // 1) Clicking parentRef, will open the menu, making them both "current" refs
        // 2) If the clicked target is outside both parentRef and menuRef, close the menu
        // 3) Multi-select menus need to stay open while selecting options, so if the clicked target is outside both parentRef and menuRef, close the menu
        // 4) Input/parentRef cannot contain the clicked element to trigger menu close, because it has its own handleInputClick method
        if (
          menuRef.current &&
          parentRef.current &&
          !menuRef.current.contains(target) &&
          !parentRef.current.contains(target)
        ) {
          setShowMenu(false);
        }
      } else {
        throw new Error("The prop <isMulti> must be either true or false!");
      }
    }

    // Don't close menu when search box is clicked
    function ignoreSearchBoxes() {
      const searchBoxes = document.querySelectorAll(
        ".dropdown__menu__search-box"
      );
      searchBoxes.forEach((box) => {
        box.addEventListener(
          "click",
          function (e) {
            e.stopPropagation();
          },
          true
        );
      });
    }
    ignoreSearchBoxes();

    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
    };
  });

  /**
   * Display either the placeholder or selected items(s) label(s)
   * @returns placeholder or selected option(s) tags
   */
  function getDisplay(): string | JSX.Element | undefined {
    // no options selected yet
    if (
      !selectedItems ||
      selectedItems.length === 0 ||
      selectedItems[0] === null
    ) {
      return placeHolder;
    }

    // if multiselect with one or more selected options, show tags
    if (isMulti && selectedItems.length >= 1) {
      return (
        <>
          {selectedItems.map((option) => (
            <>
              {option !== null ? (
                <div key={option.id} className={styles.tag}>
                  {option.label}
                  <span
                    onClick={(e) => onTagRemove(e, option)}
                    className={styles.icon_container}
                  >
                    <CloseIcon />
                  </span>
                </div>
              ) : null}
            </>
          ))}
        </>
      );
    }

    // if Not multiselect with only one option, show option label
    if (!isMulti && selectedItems.length === 1 && selectedItems[0] !== null) {
      return selectedItems[0].label;
    }
  }

  /**
   * Remove menu option from selected option(s)
   * @returns remaining selected menu item(s)
   */
  function removeSelectedItem(item: T): T[] {
    if (selectedItems.length >= 1) {
      return selectedItems.filter(function (i) {
        if (i !== null && item !== null) {
          return i.id !== item.id;
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

  /**
   * Remove item tag when 'X' icon clicked
   */
  function onTagRemove(e: React.MouseEvent, item: T): void {
    e.stopPropagation();
    let items: T[] = [];
    try {
      items = removeSelectedItem(item);
    } catch (error) {
      console.error(error);
    }
    setSelectedItems(items);
    emit(items);
  }

  /**
   *  Toggle hide/show menu
   */
  function handleInputClick() {
    setShowMenu(!showMenu);
  }

  /**
   * Set selected item(s) to state and pass it/them to parent
   */
  function onItemClick(item: T): void {
    let items: T[] = [];
    if (isMulti) {
      // Multi-select menu

      if (
        selectedItems!.findIndex((i) =>
          i && item ? i.id === item.id : undefined
        ) >= 0
      ) {
        // Remove selected item if it's the item being clicked (clicking an active item will inactivate it)

        items = removeSelectedItem(item);
      } else {
        // Add inactive item to selected items

        items = [...selectedItems!, item];
      }
    } else {
      // Single-select menu

      if (parent[0] !== null) {
        // Selecting an item after one has previously been selected

        if (
          item !== null &&
          item?.id !== parent[0].id &&
          window.confirm(
            `Selecting ${item.label} will erase any ${parent[0].label} information you may have entered.`
          ) === true
        ) {
          // User confirms to delete existing listing features info

          items = [item];
        } else {
          // User denys to delete existing listing features info

          items = [...selectedItems!];
        }
      } else {
        // Selecting an item for the first time

        items = [item];
      }
    }

    setSelectedItems(items);
    emit(items); // pass value back to parent
  }

  /**
   * Set active class true/false on menu items (for conditional styling)
   */
  function isSelected(item: T): boolean | string | undefined {
    // there are no selected options
    if (!selectedItems) {
      return false;
    }

    //  return a list with a single option in it
    if (!isMulti && selectedItems[0] && selectedItems.length === 1 && item) {
      // return selectedValue.id === option.id
      return selectedItems[0].id === item.id;
      // }
    }

    // return a list with multiple selected options
    if (isMulti && selectedItems.length >= 1) {
      return (
        selectedItems?.filter((i) => (i && item ? i.id === item.id : undefined))
          .length > 0
      );
    }
  }

  /**
   * Set search input value to state
   */
  function onSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(e.currentTarget.value);
  }

  /*
   * Show only menu items that match the current search input state value
   */
  function getOptions() {
    // show all menu options when no search value is present
    if (searchValue === "") {
      return menuItems;
    }

    // show only the options that match search value
    let found: T[] = menuItems.filter(
      (item) => {
        if (item !== null) {
          return (
            item.label.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
          );
        } else {
          return undefined;
        }
      }
      // If you want to match the text from any position, use this logic:
      // option.label.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
      // But if you want to match the text from the beginning of the text, use this:
      // option.label.toLowerCase().indexOf(searchValue.toLowerCase()) === 0
    );
    return found;
  }

  return (
    <div className={styles.container}>
      <label>{label}</label>
      <button
        type="button"
        ref={parentRef}
        onClick={handleInputClick}
        className={styles.btn}
        disabled={disabled}
      >
        <div className={styles.tags}>{getDisplay()}</div>
        <div className={styles.icon_container}>
          <Icon
            className={`${styles.icon} ${showMenu ? styles.flipped : ""}`}
          />
        </div>
      </button>
      {showMenu && (
        <div ref={menuRef} className={styles.menu}>
          {isSearchable && (
            <div className={styles.search_container}>
              <input onChange={onSearch} value={searchValue} ref={searchRef} />
            </div>
          )}
          {getOptions().map((option) => {
            if (option && option.id !== "" && option.label !== "") {
              return (
                <button
                  type="button"
                  onClick={() => onItemClick(option)}
                  key={option.id}
                  className={`${styles.item} ${
                    isSelected(option) ? styles.selected : ""
                  }`}
                >
                  {option.label}
                </button>
              );
            } else {
              return null;
            }
          })}
        </div>
      )}
      <ErrorMsg errorMsg={errorMsg} />
    </div>
  );
}
