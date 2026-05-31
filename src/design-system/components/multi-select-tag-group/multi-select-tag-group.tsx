import { useMemo, useState } from 'react';
import { Button, Label, Tag, TagGroup, TagList } from 'react-aria-components';
import { Select } from '../select/select';
import type { MultiSelectTagGroupProps } from './type';
import './styles.css';

export function MultiSelectTagGroup({
  label,
  options,
  selectedKeys,
  placeholder = 'Selecione',
  onChange
}: MultiSelectTagGroupProps) {
  const [pendingKey, setPendingKey] = useState('');

  const selectedOptions = useMemo(
    () => options.filter((option) => selectedKeys.includes(option.id)),
    [options, selectedKeys]
  );

  return (
    <div className="ds-multi-select">
      <Label className="ds-field__label">{label}</Label>
      <Select
        label="Adicionar"
        selectedKey={pendingKey}
        placeholder={placeholder}
        onSelectionChange={(key) => {
          setPendingKey('');
          if (selectedKeys.includes(key)) return;
          onChange([...selectedKeys, key]);
        }}
        options={options}
      />
      <TagGroup
        aria-label={`${label} selecionadas`}
        onRemove={(keys) => {
          const removeSet = new Set(Array.from(keys).map(String));
          onChange(selectedKeys.filter((key) => !removeSet.has(key)));
        }}
      >
        <TagList className="ds-multi-select__tags" items={selectedOptions}>
          {(item) => (
            <Tag id={item.id} textValue={item.label} className="ds-multi-select__tag">
              <span>{item.label}</span>
              <Button slot="remove" className="ds-multi-select__remove" aria-label={`Remover ${item.label}`}>
                <span className="material-symbols-rounded" aria-hidden="true">close</span>
              </Button>
            </Tag>
          )}
        </TagList>
      </TagGroup>
    </div>
  );
}
