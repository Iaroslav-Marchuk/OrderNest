import { CircleX, Search } from 'lucide-react';

import css from './SearchBox.module.css';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
}

function SearchBox({ value, onChange, onClear, placeholder }: SearchBoxProps) {
  const hasInputValue = value.length > 0;

  return (
    <div className={css.searchbox}>
      <Search className={css.inputIcon} />
      <input
        className={css.input}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />

      {hasInputValue && (
        <button type="button" onClick={onClear} className={css.clear}>
          <CircleX size={24} strokeWidth={1} />
        </button>
      )}
    </div>
  );
}

export default SearchBox;
