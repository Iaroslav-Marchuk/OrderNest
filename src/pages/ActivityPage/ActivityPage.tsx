import { useSearchParams } from 'react-router-dom';

import css from './ActivityPage.module.css';
import type { SortOrder } from '../../types/common';

import Pagination from '../../components/Pagination/Pagination';

import type { ActivityLogsSortField } from '../../types/activityLogs';
import { useActivityLogs } from '../../hooks/useActivityLogs';
import ActivityLogsFilters from '../../components/ActivityLogsFilters/ActivityLogsFilters';
import ActivityLogsTable from '../../components/ActivityLogsTable/ActivityLogsTable';
import { useEffect } from 'react';

function ActivityPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSearchParams(
      prev => {
        const params = new URLSearchParams(prev);
        params.delete('date');
        params.delete('page');
        return params;
      },
      { replace: true }
    );
  }, []);

  const queryParams = {
    page: Number(searchParams.get('page') || 1),
    perPage: Number(searchParams.get('perPage') || 20),
    sortBy: (searchParams.get('sortBy') ||
      'createdAt') as ActivityLogsSortField,
    sortOrder: (searchParams.get('sortOrder') || 'desc') as SortOrder,
    userId: searchParams.get('userId') || undefined,
    date: searchParams.get('date') || undefined,
  };

  const { page, perPage } = queryParams;

  const handleSetPage = (page: number) => {
    const params = Object.fromEntries(searchParams.entries());
    setSearchParams({
      ...params,
      page: String(page),
    });
  };

  const {
    activityLogs,
    totalItems,
    totalPages,
    isActivityLogsLoading,
    isActivityLogsError,
  } = useActivityLogs(queryParams);

  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, totalItems);

  return (
    <div className={css.wrapper}>
      <div className={css.top}>
        <div>
          <span className={css.title}>User's Activity</span>
          <p className={css.subtitle}>What happened on this day</p>
        </div>

        <div className={css.topWrapper}>
          <ActivityLogsFilters defaultRangeDays={1} />
        </div>
      </div>

      <ActivityLogsTable
        activityLogs={activityLogs}
        isLoading={isActivityLogsLoading}
        isError={isActivityLogsError}
        page={page}
        perPage={perPage}
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
    </div>
  );
}

export default ActivityPage;
