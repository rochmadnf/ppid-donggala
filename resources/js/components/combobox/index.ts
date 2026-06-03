// ============================================================
// index.ts — Public API / barrel export
// ============================================================

export { ComboBox } from "./combobox";
export { useComboBoxContext } from "./combobox";
export { useComboBox } from "./hooks/use-combobox";
export { useDebounce, useDebouncedCallback } from "./hooks/use-debounce";
export { useKeyboardNavigation } from "./hooks/use-keyboard-navigation";

export type {
  Option,
  ComboBoxProps,
  ComboBoxContextValue,
  CreateMode,
  CreateFormProps,
} from "./types";
