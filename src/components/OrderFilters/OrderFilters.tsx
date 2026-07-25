import { useSearchParams } from 'react-router-dom';
import SearchBox from '../SearchBox/SearchBox';
import OrderDateFilter from '../OrderDateFilter/OrderDateFilter';
import OrderLocationFilter from '../OrderLocationFilter/OrderLocationFilter';

interface OrderFiltersProps {
  defaultRangeDays?: number;
  defaultLocation?: string;
}

function OrderFilters({
  defaultRangeDays = 1,
  defaultLocation = '',
}: OrderFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const ep = Number(searchParams.get('ep')) || '';
  const client = searchParams.get('client') || '';
  const date = searchParams.get('date') || '';
  const location = searchParams.get('location') || defaultLocation;

  const inputValue = String(ep || client || '');
  const locationValue = location || 'all';
  const isAllTime = date === 'all';
  const dateValue = date ? new Date(date) : null;

  const handleInputChange = (value: string) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      if (!value) {
        params.delete('ep');
        params.delete('client');
      } else if (/^\d+$/.test(value)) {
        params.set('ep', value);
        params.delete('client');
      } else {
        params.set('client', value);
        params.delete('ep');
      }
      params.set('page', '1');
      return params;
    });
  };

  const handleClearSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('ep');
    params.delete('client');
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleLocationChange = (value: string) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      params.set('location', value);
      params.set('page', '1');
      return params;
    });
  };

  const handleDateChange = (value: string) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      if (value === '') {
        params.delete('date');
      } else {
        params.set('date', value);
      }
      params.set('page', '1');
      return params;
    });
  };

  return (
    <>
      <SearchBox
        placeholder="EP or client's name..."
        value={inputValue}
        onChange={handleInputChange}
        onClear={handleClearSearch}
      />

      <OrderDateFilter
        dateValue={dateValue}
        onChange={handleDateChange}
        defaultRangeDays={defaultRangeDays}
        isAllTime={isAllTime}
      />
      <OrderLocationFilter
        value={locationValue}
        onChange={handleLocationChange}
      />
    </>
  );
}

export default OrderFilters;
