import css from './OrderDateFilter.module.css';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';

interface OrderDateFilterProps {
  dateValue: Date | null;
  onChange: (value: string) => void;
  defaultRangeDays?: number;
  isAllTime?: boolean;
}

function OrderDateFilter({
  dateValue,
  onChange,
  defaultRangeDays = 1,
  isAllTime = false,
}: OrderDateFilterProps) {
  const defaultRangeLabel =
    defaultRangeDays <= 1 ? 'Today' : `Last ${defaultRangeDays} days`;

  const placeholderText = isAllTime
    ? 'All time'
    : defaultRangeDays <= 1
      ? new Date().toLocaleDateString('pt-PT', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
        })
      : `Last ${defaultRangeDays} days`;

  const handleChange = (date: Date | null) => {
    if (!date) {
      onChange('');
      return;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    onChange(`${year}-${month}-${day}`);
  };

  const handleAllTimeToggle = () => {
    onChange(isAllTime ? '' : 'all');
  };

  return (
    <DatePicker
      selected={isAllTime ? null : dateValue}
      onChange={handleChange}
      placeholderText={placeholderText}
      className={css.dateInput}
      portalId="datepicker-portal"
    >
      <button
        type="button"
        className={isAllTime ? css.allTimeActive : css.allTimeBtn}
        onClick={handleAllTimeToggle}
      >
        {isAllTime ? defaultRangeLabel : 'All time'}
      </button>
    </DatePicker>
  );
}

export default OrderDateFilter;
