import { IPageStats, IPageVisit, IVisits } from 'models/apiModels';
import { get, post } from './requests';

export const postUniqueVisit = (): Promise<{}> =>
  post<{}>('stats/unique-visit', {});

export const getUniqueVisits = (
  start?: string,
  end?: string
): Promise<IVisits[]> => {
  return get<IVisits[]>('stats/unique-visit', {
    ...(start && { start: start }),
    // endpoint uses datenow if end is not specified
    ...(end && { end: end }),
  });
};

export const logVisit = (payload: IPageVisit): Promise<{}> =>
  post<{}>('stats/page-visit', payload);

export const getPageVisitsLastMonth = (): Promise<IPageStats[]> =>
  get<IPageStats[]>('stats/most_visited_pages_last_month');

export const getPageVisit = (page: string): Promise<{ visits: number }> =>
  get<{ visits: number }>('stats/get-all-page-visits', { page: page });
