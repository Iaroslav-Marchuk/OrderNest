import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { Plus } from 'lucide-react';

import type { SortOrder } from '../../types/common';
import type { GlassTypeSortField } from '../../types/glassType';

import { useGlassTypes } from '../../hooks/useGlassTypes';
import { useAllGlassCategories } from '../../hooks/useAllGlassCategories';

import SearchBox from '../../components/SearchBox/SearchBox';
import Pagination from '../../components/Pagination/Pagination';
import ModalOverlay from '../../components/ModalOverlay/ModalOverlay';
import GlassTypeTable from '../../components/GlassTypeTable/GlassTypeTable';
import GlassTypeForm from '../../components/GlassTypeForm/GlassTypeForm';
import GlassCategoriesFilter from '../../components/GlassCategoriesFilter/GlassCategoriesFilter';

import css from './GlassTypesPage.module.css';

function GlassTypesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const queryParams = {
    page: Number(searchParams.get('page') || 1),
    perPage: Number(searchParams.get('perPage') || 20),
    sortBy: (searchParams.get('sortBy') || 'createdAt') as GlassTypeSortField,
    sortOrder: (searchParams.get('sortOrder') || 'asc') as SortOrder,
    label: searchParams.get('label') || '',
    glassCategory: searchParams.get('glassCategory') || '',
  };

  const { page, perPage, sortBy, sortOrder, label, glassCategory } =
    queryParams;

  const handleSetPage = (page: number) => {
    const params = Object.fromEntries(searchParams.entries());

    setSearchParams({
      ...params,
      page: String(page),
    });
  };

  const handleInputChange = (value: string) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);

      if (!value) {
        params.delete('label');
      } else {
        params.set('label', value);
      }

      params.set('page', '1');
      return params;
    });
  };

  const handleClearSearch = () => {
    const params = new URLSearchParams(searchParams);

    params.delete('label');
    params.set('page', '1');

    setSearchParams(params);
  };

  const handleSortChange = (field: GlassTypeSortField) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
      params.set('sortBy', field);
      params.set('sortOrder', newOrder);
      return params;
    });
  };

  const handleGlassCategoryChange = (value: string) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      if (value === 'all') {
        params.delete('glassCategory');
      } else {
        params.set('glassCategory', value);
      }
      params.set('page', '1');
      return params;
    });
  };

  const {
    glassTypes,
    totalItems,
    totalPages,
    isGlassTypesLoading,
    isGlassTypesError,
  } = useGlassTypes(queryParams);

  const { allGlassCategories } = useAllGlassCategories();

  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, totalItems);

  return (
    <div className={css.wrapper}>
      <div className={css.top}>
        <div>
          <span className={css.title}>Glass Types List</span>
          <p className={css.subtitle}>{totalItems} types</p>
        </div>

        <div className={css.topWrapper}>
          <SearchBox
            placeholder="Glass type's name..."
            value={label}
            onChange={handleInputChange}
            onClear={handleClearSearch}
          />
          <GlassCategoriesFilter
            glassCategoriesList={allGlassCategories}
            value={glassCategory}
            onChange={handleGlassCategoryChange}
          />
          <button type="button" className={css.btn} onClick={openModal}>
            <Plus />
            <span>Create New Type</span>
          </button>
        </div>
      </div>
      <GlassTypeTable
        glassTypes={glassTypes}
        isLoading={isGlassTypesLoading}
        isError={isGlassTypesError}
        sortBy={sortBy}
        sortOrder={sortOrder}
        page={page}
        perPage={perPage}
        onSortChange={handleSortChange}
      />

      <div className={css.bottom}>
        {totalItems > 0 && (
          <span className={css.counter}>
            {from}–{to} of {totalItems}
          </span>
        )}

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={handleSetPage}
          />
        )}
      </div>

      {isModalOpen && (
        <ModalOverlay onClose={closeModal}>
          <GlassTypeForm onClose={closeModal} />
        </ModalOverlay>
      )}
    </div>
  );
}

export default GlassTypesPage;
