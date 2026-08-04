import { useSearchParams } from 'react-router-dom';
import type { SortOrder } from '../types/common';
import type { OrdersSortField } from '../types/order';

interface UseOrderQueryParamsProps {
  defaultSortBy?: OrdersSortField;
  defaultSortOrder?: SortOrder;
  defaultLocation?: string;
}

export const useOrderQueryParams = ({
  defaultSortBy = 'createdAt',
  defaultSortOrder = 'asc',
  defaultLocation = '',
}: UseOrderQueryParamsProps = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryParams = {
    page: Number(searchParams.get('page') || 1),
    perPage: Number(searchParams.get('perPage') || 20),
    sortBy: (searchParams.get('sortBy') || defaultSortBy) as OrdersSortField,
    sortOrder: (searchParams.get('sortOrder') || defaultSortOrder) as SortOrder,
    ep: Number(searchParams.get('ep')) || '',
    client: searchParams.get('client') || '',
    date: searchParams.get('date') || '',
    location: searchParams.get('location') || defaultLocation || '',
  };

  const handleSetPage = (page: number) => {
    const params = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...params, page: String(page) });
  };

  const handleSortChange = (field: OrdersSortField) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      const newOrder =
        queryParams.sortBy === field && queryParams.sortOrder === 'asc'
          ? 'desc'
          : 'asc';
      params.set('sortBy', field);
      params.set('sortOrder', newOrder);
      return params;
    });
  };

  return { queryParams, handleSetPage, handleSortChange };
};
