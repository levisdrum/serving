import { parseDate } from '@internationalized/date';
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  DateInput,
  DatePicker,
  DateSegment,
  Dialog,
  Group,
  Heading,
  Label,
  Popover
} from 'react-aria-components';
import type { DatePickerFieldProps } from './type';
import './styles.css';

export function DatePickerField({ label, value, onChange }: DatePickerFieldProps) {
  return (
    <DatePicker
      className="ds-date-picker"
      value={value ? parseDate(value) : undefined}
      onChange={(next) => {
        if (!next) return;
        onChange(next.toString());
      }}
    >
      <Label className="ds-field__label">{label}</Label>
      <Group className="ds-date-picker__group">
        <DateInput className="ds-date-picker__input">
          {(segment) => <DateSegment className="ds-date-picker__segment" segment={segment} />}
        </DateInput>
        <Button className="ds-date-picker__button" aria-label="Abrir calendário">
          <span className="material-symbols-rounded" aria-hidden="true">calendar_month</span>
        </Button>
      </Group>
      <Popover className="ds-date-picker__popover">
        <Dialog>
          <Calendar>
            <header className="ds-date-picker__header">
              <Button slot="previous" className="ds-date-picker__nav">◀</Button>
              <Heading className="ds-date-picker__heading" />
              <Button slot="next" className="ds-date-picker__nav">▶</Button>
            </header>
            <CalendarGrid>
              {(date) => <CalendarCell date={date} className="ds-date-picker__cell" />}
            </CalendarGrid>
          </Calendar>
        </Dialog>
      </Popover>
    </DatePicker>
  );
}
