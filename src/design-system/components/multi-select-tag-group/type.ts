export interface DSMultiSelectOption {
  id: string;
  label: string;
}

export interface MultiSelectTagGroupProps {
  label: string;
  options: DSMultiSelectOption[];
  selectedKeys: string[];
  placeholder?: string;
  onChange: (keys: string[]) => void;
}
