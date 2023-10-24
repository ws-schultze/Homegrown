import { useRef } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../redux/hooks";
import useCloseDropdown from "../hooks/useCloseDropdown";
import { DropdownStyles, ForSaleOrRentValue } from "../../../../types/index";
import { setForSaleOrRent, setShowMenu } from "./slice";
import flx from "../scss/flex.module.scss";
import abs from "../scss/absolute.module.scss";
import scss from "./forSaleOrRentFilter.module.scss";
import { ReactComponent as Icon } from "../assets/chevron-down.svg";

import { RADIO } from "./styledComponents/common";

import {
  A_CONTAINER,
  A_CONTAINER_ICON_WRAP,
  A_CONTAINER_ICON,
  A_MENU,
} from "../styledComponents/absolute";

import {
  F_BTN,
  F_BTN_ICON,
  F_BTN_ICON_WRAP,
  F_CONTAINER,
  F_MENU,
} from "../styledComponents/flex";

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
        className={abs.container}
        ref={containerRef}
        onClick={() => dispatch(setShowMenu())}
        style={{
          width: styles.btnWidth,
          height: styles.btnHeight,
          border: inUse
            ? "1px solid var(--color-primary)"
            : "1px solid var(--color-border)",
        }}
      >
        {state.selectedItem?.label || label}
        <div className={abs["icon-wrap"]}>
          <Icon
            className={abs.icon}
            style={{
              transform: state.showMenu ? "rotateX(180deg)" : "rotateX(0deg)",
            }}
          />
        </div>
        {state.showMenu ? (
          <div className={abs.menu} ref={menuRef}>
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
                          state.selectedItem &&
                          state.selectedItem?.id === item.id
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
        ) : null}
      </div>
    );
  }

  if (menuKind === "flex") {
    return (
      <F_CONTAINER ref={containerRef} inUse={inUse}>
        <F_BTN onClick={() => dispatch(setShowMenu())} styles={styles}>
          {label || "Dropdown"}
          <F_BTN_ICON_WRAP>
            <F_BTN_ICON flipped={state.showMenu ? true : false} />
          </F_BTN_ICON_WRAP>
        </F_BTN>

        <F_MENU
          className={state.showMenu ? "open" : "closed"}
          styles={styles}
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
        >
          {state.menuItems.map((item, i) => {
            if (item !== null) {
              return (
                <RADIO
                  key={i}
                  onClick={(e) => handleSelectedItem(e, item)}
                  className="listings-filter-btn"
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
                </RADIO>
              );
            } else {
              return null;
            }
          })}
        </F_MENU>
      </F_CONTAINER>
    );
  }

  // if (menuKind === "absolute") {
  //   return (
  //     <A_CONTAINER
  //       ref={containerRef}
  //       onClick={() => dispatch(setShowMenu())}
  //       inUse={inUse}
  //       styles={styles}
  //     >
  //       {state.selectedItem?.label || label}
  //       <A_CONTAINER_ICON_WRAP>
  //         <A_CONTAINER_ICON flipped={state.showMenu} />
  //       </A_CONTAINER_ICON_WRAP>
  //       {state.showMenu ? (
  //         <A_MENU ref={menuRef}>
  //           {" "}
  //           {state.menuItems.map((item, i) => {
  //             if (item !== null) {
  //               return (
  //                 <RADIO
  //                   key={i}
  //                   onClick={(e) => handleSelectedItem(e, item)}
  //                   className="listings-filter-btn"
  //                 >
  //                   <label>
  //                     <input
  //                       type="radio"
  //                       checked={
  //                         state.selectedItem &&
  //                         state.selectedItem?.id === item.id
  //                           ? true
  //                           : false
  //                       }
  //                       readOnly
  //                     />

  //                     {item.label}
  //                   </label>
  //                 </RADIO>
  //               );
  //             } else {
  //               return null;
  //             }
  //           })}
  //         </A_MENU>
  //       ) : null}
  //     </A_CONTAINER>
  //   );
  // }

  // if (menuKind === "flex") {
  //   return (
  //     <F_CONTAINER ref={containerRef} inUse={inUse}>
  //       <F_BTN onClick={() => dispatch(setShowMenu())} styles={styles}>
  //         {label || "Dropdown"}
  //         <F_BTN_ICON_WRAP>
  //           <F_BTN_ICON flipped={state.showMenu ? true : false} />
  //         </F_BTN_ICON_WRAP>
  //       </F_BTN>

  //       <F_MENU
  //         className={state.showMenu ? "open" : "closed"}
  //         styles={styles}
  //         ref={menuRef}
  //         onClick={(e) => e.stopPropagation()}
  //       >
  //         {state.menuItems.map((item, i) => {
  //           if (item !== null) {
  //             return (
  //               <RADIO
  //                 key={i}
  //                 onClick={(e) => handleSelectedItem(e, item)}
  //                 className="listings-filter-btn"
  //               >
  //                 <label>
  //                   <input
  //                     type="radio"
  //                     checked={
  //                       state.selectedItem && state.selectedItem?.id === item.id
  //                         ? true
  //                         : false
  //                     }
  //                     readOnly
  //                   />

  //                   {item.label}
  //                 </label>
  //               </RADIO>
  //             );
  //           } else {
  //             return null;
  //           }
  //         })}
  //       </F_MENU>
  //     </F_CONTAINER>
  //   );
  // }

  return <p>Please enter a value for menuKind</p>;
}
