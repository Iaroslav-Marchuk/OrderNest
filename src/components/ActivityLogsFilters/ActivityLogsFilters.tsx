import { useSearchParams } from 'react-router-dom';

import OrderDateFilter from '../OrderDateFilter/OrderDateFilter';

import { useUsers } from '../../hooks/useUsers';

import css from './ActivityLogsFilters.module.css';

interface ActivityLogsFiltersProps {
  defaultRangeDays?: number;
}

function ActivityLogsFilters({
  defaultRangeDays = 1,
}: ActivityLogsFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const date = searchParams.get('date') || '';
  const isAllTime = date === 'all';
  const dateValue = date && !isAllTime ? new Date(date) : null;

  const updateParam = (key: string, value: string) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      if (value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.set('page', '1');
      return params;
    });
  };

  const { users } = useUsers({ perPage: 100 });

  return (
    <>
      <OrderDateFilter
        dateValue={dateValue}
        onChange={value => updateParam('date', value)}
        defaultRangeDays={defaultRangeDays}
        isAllTime={isAllTime}
      />

      <select
        className={css.select}
        value={searchParams.get('userId') ?? ''}
        onChange={e => updateParam('userId', e.target.value)}
      >
        <option value="">All users</option>
        {users.map(user => (
          <option key={user._id} value={user._id}>
            {user.name}
          </option>
        ))}
      </select>
    </>
  );
}

export default ActivityLogsFilters;
