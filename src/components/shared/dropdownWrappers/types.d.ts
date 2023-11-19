export interface FlxDropdownBtnStyles {
  height?: string;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
}

export interface FlxDropdownMenuStyles {
  height?: string;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
}

export interface FlxDropdownMenuWrapper {
  menuContent: JSX.Element | (JSX.Element | null)[];
  showMenu: boolean;
  inUse?: boolean;
  label: React.ReactNode;
  btnStyles?: FlexDropdownBtnStyles;
  menuStyles?: FlexDropdownMenuStyles;
  handleShowMenu: () => void;
}

export interface FlxDropdownMenu {
  menuKind: "flex";
  label: string | React.ReactNode;
  btnStyles?: FlxDropdownBtnStyles;
  menuStyles?: FlxDropdownMenuStyles;
}

export interface AbsDropdownBtnStyles {
  height?: string;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
}

export interface AbsDropdownMenuStyles {
  height?: string;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
}

export interface AbsDropdownMenuWrapper {
  menuContent: JSX.Element | (JSX.Element | null)[];
  showMenu: boolean;
  inUse: boolean;
  label: React.ReactNode;
  btnStyles?: AbsDropdownBtnStyles;
  menuStyles?: AbsDropdownMenuStyles;
  handleShowMenu: () => void;
  handleStateOnMenuClose?: () => void;
}

export interface AbsDropdownMenu {
  menuKind: "absolute";
  label: string | React.ReactNode;
  btnStyles?: AbsDropdownBtnStyles;
  menuStyles?: AbsDropdownMenuStyles;
}

export interface FilterProps<T> {
  menuKind: "absolute" | "flex";
  btnStyles: T;
  menuStyles: T;
  label: string;
}
