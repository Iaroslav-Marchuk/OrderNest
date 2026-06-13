import {
  ArrowDownUp,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
} from 'lucide-react';
import GlassCategoryRow from '../GlassCategoryRow/GlassCategoryRow';
import css from './GlassCategoryTable.module.css';
import type { SortOrder } from '../../types/common';
import type { GlassCategory } from '../../types/glassCategory';

export type GlassCategorySortField = 'label' | 'createdAt';

interface GlassCategoryTableProps {
  glassCategories: GlassCategory[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  perPage: number;
  sortBy: GlassCategorySortField;
  sortOrder: SortOrder;
  onSortChange: (field: GlassCategorySortField) => void;
}

function GlassCategoryTable({
  glassCategories,
  isLoading,
  isError,
  page,
  perPage,
  sortBy,
  sortOrder,
  onSortChange,
}: GlassCategoryTableProps) {
  const getSortIcon = (field: GlassCategorySortField) => {
    if (sortBy === field) {
      return sortOrder === 'asc' ? (
        <ArrowUpNarrowWide size={14} strokeWidth={1.5} />
      ) : (
        <ArrowDownWideNarrow size={14} strokeWidth={1.5} />
      );
    }
    return <ArrowDownUp size={14} strokeWidth={1.5} />;
  };

  if (isError) return <p className={css.state}> Something went wrong!</p>;

  if (!isLoading && glassCategories.length === 0)
    return <p className={css.state}> No glass categories found!</p>;

  return (
    <table className={css.table}>
      <thead className={css.header}>
        <tr>
          <th className={css.th}>#</th>
          <th className={css.th}>
            <button className={css.thBtn} onClick={() => onSortChange('label')}>
              Glass Category {getSortIcon('label')}
            </button>
          </th>

          <th className={css.th}>
            <button
              className={css.thBtn}
              onClick={() => onSortChange('createdAt')}
            >
              Created {getSortIcon('createdAt')}
            </button>
          </th>
          <th className={css.th}>Actions</th>
        </tr>
      </thead>
      <tbody>
        <>
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={`skeleton-${i}`}>
                <td className={css.td}>
                  <div className={css.skeleton} style={{ width: '20px' }} />
                </td>
                <td className={css.td}>
                  <div className={css.skeleton} style={{ width: '200px' }} />
                </td>
                <td className={css.td}>
                  <div className={css.skeleton} style={{ width: '100px' }} />
                </td>
                <td className={css.td}>
                  <div className={css.skeleton} style={{ width: '60px' }} />
                </td>
              </tr>
            ))}

          {!isLoading &&
            !isError &&
            glassCategories.map((glassCategory, index) => (
              <GlassCategoryRow
                key={glassCategory._id}
                glassCategory={glassCategory}
                index={(page - 1) * perPage + index + 1}
              />
            ))}
        </>
      </tbody>
    </table>
  );
}

export default GlassCategoryTable;
