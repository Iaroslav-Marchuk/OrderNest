import { Plus } from 'lucide-react';
import css from './GlassCategoriesPage.module.css';
import GlassCategoryTable, {
  type GlassCategorySortField,
} from '../../components/GlassCategoryTable/GlassCategoryTable';
import ModalOverlay from '../../components/ModalOverlay/ModalOverlay';
import { useState } from 'react';
import GlassCategoryForm from '../../components/GlassCategoryForm/GlassCategoryForm';
import SearchBox from '../../components/SearchBox/SearchBox';
import { useSearchParams } from 'react-router-dom';
import type { SortOrder } from '../../types/common';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import Pagination from '../../components/Pagination/Pagination';
import { getAllGlassCategoriesApi } from '../../services/glassCategoriesApi';

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

  const { data, isLoading, isError } = useQuery({
    queryKey: ['allGlassCategories', queryParams],
    queryFn: () => getAllGlassCategoriesApi(queryParams),
    placeholderData: keepPreviousData,
  });

  const allGlassCategories = data?.glassCategories ?? [];
  const totalGlassCategories = data?.totalItems ?? 0;
  const totalPages = data?.totalPages ?? 0;

  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, totalGlassCategories);

  return (
    <div className={css.wrapper}>
      <div className={css.top}>
        <div>
          <span className={css.title}>Glass Categories List</span>
          <p className={css.subtitle}>{totalGlassCategories} categories</p>
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
        glassCategories={allGlassCategories}
        isLoading={isLoading}
        isError={isError}
        sortBy={sortBy}
        sortOrder={sortOrder}
        page={page}
        perPage={perPage}
        onSortChange={handleSortChange}
      />

      <div className={css.bottom}>
        {totalGlassCategories > 0 && (
          <span className={css.counter}>
            {from}–{to} of {totalGlassCategories}
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
