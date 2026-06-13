import {
  ArrowDownUp,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
} from 'lucide-react';
import type { SortOrder } from '../../types/common';
import type { GlassType } from '../../types/glassType';
import css from './GlassTypeTable.module.css';
import GlassTypeRow from '../GlassTypeRow/GlassTypeRow';
import type { GlassCategory } from '../../types/glassCategory';

export type GlassTypeSortField = 'label' | 'category' | 'createdAt';

interface GlassTypeTableProps {
  glassTypes: GlassType[];
  categoriesList: GlassCategory[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  perPage: number;
  sortBy: GlassTypeSortField;
  sortOrder: SortOrder;
  onSortChange: (field: GlassTypeSortField) => void;
}

function GlassTypeTable({
  glassTypes,
  categoriesList,
  isLoading,
  isError,
  page,
  perPage,
  sortBy,
  sortOrder,
  onSortChange,
}: GlassTypeTableProps) {
  const getSortIcon = (field: GlassTypeSortField) => {
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

  if (!isLoading && glassTypes.length === 0)
    return <p className={css.state}> No glass types found!</p>;
  return (
    <table className={css.table}>
      <thead className={css.header}>
        <tr>
          <th className={css.th}>#</th>
          <th className={css.th}>
            <button className={css.thBtn} onClick={() => onSortChange('label')}>
              Glass Type {getSortIcon('label')}
            </button>
          </th>

          <th className={css.th}>
            <button
              className={css.thBtn}
              onClick={() => onSortChange('category')}
            >
              Glass Category {getSortIcon('category')}
            </button>
          </th>

          <th className={css.th}>Thickness</th>
          <th className={css.th}>Heat Treatment</th>

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
                  <div className={css.skeleton} style={{ width: '120px' }} />
                </td>
                <td className={css.td}>
                  <div className={css.skeleton} style={{ width: '100px' }} />
                </td>
                <td className={css.td}>
                  <div className={css.skeleton} style={{ width: '80px' }} />
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
            glassTypes.map((glassType, index) => (
              <GlassTypeRow
                key={glassType._id}
                glassType={glassType}
                categoriesList={categoriesList}
                index={(page - 1) * perPage + index + 1}
              />
            ))}
        </>
      </tbody>
    </table>
  );
}

export default GlassTypeTable;
