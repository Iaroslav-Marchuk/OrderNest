import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { SortOrder } from '../../types/common';
import type { GlassCategorySortField } from '../../types/glassCategory';

import { useGlassCategories } from '../../hooks/useGlassCategories';

import GlassCategoryTable from '../../components/GlassCategoryTable/GlassCategoryTable';
import ModalOverlay from '../../components/ModalOverlay/ModalOverlay';
import GlassCategoryForm from '../../components/GlassCategoryForm/GlassCategoryForm';
import Pagination from '../../components/Pagination/Pagination';
import SearchBox from '../../components/SearchBox/SearchBox';

import css from './GlassCategoriesPage.module.css';

function GlassCategoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const queryParams = {
    page: Number(searchParams.get('page') || 1),
    perPage: Number(searchParams.get('perPage') || 20),
    sortBy: (searchParams.get('sortBy') ||
      'createdAt') as GlassCategorySortField,
    sortOrder: (searchParams.get('sortOrder') || 'asc') as SortOrder,
    label: searchParams.get('label') || '',
  };

  const { page, perPage, sortBy, sortOrder, label } = queryParams;

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

  const handleSortChange = (field: GlassCategorySortField) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
      params.set('sortBy', field);
      params.set('sortOrder', newOrder);
      return params;
    });
  };

  const {
    glassCategories,
    totalItems,
    totalPages,
    isGlassCategoriesLoading,
    isGlassCategoriesError,
  } = useGlassCategories(queryParams);

  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, totalItems);

  return (
    <div className={css.wrapper}>
      <div className={css.top}>
        <div>
          <span className={css.title}>Glass Categories List</span>
          <p className={css.subtitle}>{totalItems} categories</p>
        </div>

        <div className={css.topWrapper}>
          <SearchBox
            placeholder="Glass category's name..."
            value={label}
            onChange={handleInputChange}
            onClear={handleClearSearch}
          />
          <button type="button" className={css.btn} onClick={openModal}>
            <Plus />
            <span>Create New Category</span>
          </button>
        </div>
      </div>
      <GlassCategoryTable
        glassCategories={glassCategories}
        isLoading={isGlassCategoriesLoading}
        isError={isGlassCategoriesError}
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
          <GlassCategoryForm onClose={closeModal} />
        </ModalOverlay>
      )}
    </div>
  );
}

export default GlassCategoriesPage;
