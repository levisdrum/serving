import { Button, Label, ListBox, ListBoxItem, Popover, Select as AriaSelect, SelectValue } from 'react-aria-components';
import type { DSSelectProps } from './type';
import './styles.css';

export function Select({
  label,
  options,
  selectedKey,
  placeholder = 'Selecione',
  isDisabled = false,
  hideLabel = false,
  name,
  onSelectionChange
}: DSSelectProps) {
  return (
    <AriaSelect
      className="ds-select"
      selectedKey={selectedKey}
      isDisabled={isDisabled}
      name={name}
      onSelectionChange={(key) => {
        if (key !== null) onSelectionChange(String(key));
      }}
    >
      <Label className={hideLabel ? 'sr-only' : 'ds-field__label'}>{label}</Label>
      <Button className="ds-select__trigger">
        <SelectValue>{({ isPlaceholder }) => isPlaceholder ? <span className="ds-select__placeholder">{placeholder}</span> : undefined}</SelectValue>
        <span aria-hidden="true">▼</span>
      </Button>
      <Popover className="ds-select__popover">
        <ListBox className="ds-select__list">
          {options.map((option) => (
            <ListBoxItem id={option.id} key={option.id} className="ds-select__item">
              {option.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}
