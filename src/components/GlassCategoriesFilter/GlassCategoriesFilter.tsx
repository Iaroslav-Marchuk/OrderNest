import type { GlassCategory } from '../../types/glassCategory';

import css from './GlassCategoriesFilter.module.css';

interface GlassCategoriesFilterProps {
  glassCategoriesList: GlassCategory[];
  value: string;
  onChange: (value: string) => void;
}

function GlassCategoriesFilter({
  glassCategoriesList,
  value,
  onChange,
}: GlassCategoriesFilterProps) {
  return (
    <select
      className={css.select}
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      <option value="">All categories</option>
      {glassCategoriesList.map(r => (
        <option key={r._id} value={r._id}>
          {r.label}
        </option>
      ))}
    </select>
  );
}

export default GlassCategoriesFilter;
