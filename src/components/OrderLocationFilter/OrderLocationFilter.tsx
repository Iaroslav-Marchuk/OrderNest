import css from './OrderLocationFilter.module.css';

type LocationOption =
  | 'all'
  | 'line_1'
  | 'line_2'
  | 'line_3'
  | 'hardening'
  | 'quality'
  | 'logistics';

const locations: { value: LocationOption; label: string }[] = [
  { value: 'all', label: 'All Locations' },
  { value: 'line_1', label: 'Line 1' },
  { value: 'line_2', label: 'Line 2' },
  { value: 'line_3', label: 'Line 3' },
  { value: 'hardening', label: 'Hardening' },
  { value: 'quality', label: 'Quality' },
  { value: 'logistics', label: 'Logistics' },
];

interface OrderLocationFilterProps {
  value: string;
  onChange: (value: string) => void;
}

function OrderLocationFilter({ value, onChange }: OrderLocationFilterProps) {
  return (
    <select
      className={css.select}
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {locations.map(l => (
        <option key={l.value} value={l.value}>
          {l.label}
        </option>
      ))}
    </select>
  );
}

export default OrderLocationFilter;
