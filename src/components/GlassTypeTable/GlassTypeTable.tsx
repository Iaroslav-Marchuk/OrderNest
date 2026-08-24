import {
  ArrowDownUp,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
} from 'lucide-react';

import type { SortOrder } from '../../types/common';
import type { GlassType, GlassTypeSortField } from '../../types/glassType';

import GlassTypeRow from '../GlassTypeRow/GlassTypeRow';
import SkeletonGlassTypes from '../SkeletonGlassTypes/SkeletonGlassTypes';

import css from './GlassTypeTable.module.css';

interface GlassTypeTableProps {
  glassTypes: GlassType[];
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
        {isLoading ? (
          <SkeletonGlassTypes />
        ) : (
          glassTypes.map((glassType, index) => (
            <GlassTypeRow
              key={glassType._id}
              glassType={glassType}
              index={(page - 1) * perPage + index + 1}
            />
          ))
        )}
      </tbody>
    </table>
  );
}

export default GlassTypeTable;
