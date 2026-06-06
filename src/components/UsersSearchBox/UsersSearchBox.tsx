import { CircleX, Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import css from './UsersSearchBox.module.css';

function UsersSearchBox() {
  const [query, setQuery] = useSearchParams();

  const inputValue = query.get('name') || '';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.trim();
    setQuery(prev => {
      const params = new URLSearchParams(prev);
      if (!input) {
        params.delete('name');
      } else {
        params.set('name', input);
      }
      // params.set('page', '1');
      return params;
    });
  };

  const handleInputClear = () => {
    setQuery(prev => {
      const params = new URLSearchParams(prev);
      params.delete('name');
      // params.set('page', '1');
      return params;
    });
  };

  const hasInputValue = query.has('name');

  return (
    <div className={css.searchbox}>
      <Search className={css.inputIcon} />
      <input
        className={css.input}
        type="text"
        placeholder="User's name..."
        value={inputValue}
        onChange={handleInputChange}
      />

      {hasInputValue && (
        <button type="button" onClick={handleInputClear} className={css.clear}>
          <CircleX size={24} strokeWidth={1} />
        </button>
      )}
    </div>
  );
}

export default UsersSearchBox;
