import { useSearchParams } from 'react-router-dom';
import css from './GlassTypesPage.module.css';
import { useState } from 'react';
import type { SortOrder } from '../../types/common';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getAllGlassTypesApi } from '../../services/glassTypesApi';
import SearchBox from '../../components/SearchBox/SearchBox';
import { Plus } from 'lucide-react';
import Pagination from '../../components/Pagination/Pagination';
import ModalOverlay from '../../components/ModalOverlay/ModalOverlay';

import GlassTypeTable, {
  type GlassTypeSortField,
} from '../../components/GlassTypeTable/GlassTypeTable';
import GlassTypeForm from '../../components/GlassTypeForm/GlassTypeForm';
import { getAllGlassCategoriesApi } from '../../services/glassCategoriesApi';
import GlassCategoriesFilter from '../../components/GlassCategoriesFilter/GlassCategoriesFilter';

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

  const { data, isLoading, isError } = useQuery({
    queryKey: ['allGlassTypes', queryParams],
    queryFn: () => getAllGlassTypesApi(queryParams),
    placeholderData: keepPreviousData,
  });

  const allGlassTypes = data?.glassTypes ?? [];
  const totalGlassTypes = data?.totalItems ?? 0;
  const totalPages = data?.totalPages ?? 0;

  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, totalGlassTypes);

  const { data: allGlassCategories } = useQuery({
    queryKey: ['allGlassCategories'],
    queryFn: () => getAllGlassCategoriesApi({ perPage: 100 }),
  });

  const categoriesList = allGlassCategories?.glassCategories ?? [];

  return (
    <div className={css.wrapper}>
      <div className={css.top}>
        <div>
          <span className={css.title}>Glass Types List</span>
          <p className={css.subtitle}>{totalGlassTypes} types</p>
        </div>

        <div className={css.topWrapper}>
          <SearchBox
            placeholder="Glass type's name..."
            value={label}
            onChange={handleInputChange}
            onClear={handleClearSearch}
          />
          <GlassCategoriesFilter
            glassCategoriesList={categoriesList}
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
        glassTypes={allGlassTypes}
        categoriesList={categoriesList}
        isLoading={isLoading}
        isError={isError}
        sortBy={sortBy}
        sortOrder={sortOrder}
        page={page}
        perPage={perPage}
        onSortChange={handleSortChange}
      />

      <div className={css.bottom}>
        {totalGlassTypes > 0 && (
          <span className={css.counter}>
            {from}–{to} of {totalGlassTypes}
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
          <GlassTypeForm onClose={closeModal} categoriesList={categoriesList} />
        </ModalOverlay>
      )}
    </div>
  );
}

export default GlassTypesPage;
