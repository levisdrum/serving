export interface DSSelectOption {
  id: string;
  label: string;
}

export interface DSSelectProps {
  label: string;
  options: DSSelectOption[];
  selectedKey?: string;
  placeholder?: string;
  isDisabled?: boolean;
  hideLabel?: boolean;
  name?: string;
  onSelectionChange: (key: string) => void;
}
