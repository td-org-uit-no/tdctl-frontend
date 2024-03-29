import React, { useState, useEffect, createContext } from 'react';
import { JobItem } from 'models/apiModels';
export interface FilterContext {
  allJobs: JobItem[];
  sortedJobs: JobItem[];
  tags: string[];
  search_string: string;
  sort_date: boolean;
}
type FilterHookType = {
  context: FilterContext;
  setContext: (_: FilterContext) => void;
};

export const FilterContextHook = createContext<FilterHookType>({
  context: {
    allJobs: [],
    sortedJobs: [],
    tags: [],
    search_string: '',
    sort_date: false,
  } as FilterContext,
  setContext: (_: FilterContext) => {},
});

interface IJobFilterProvider {
  children?: React.ReactNode;
}

const JobFilterProvider: React.FC<IJobFilterProvider> = ({ children }) => {
  const [filterContext, setFilterContext] = useState<FilterContext>({
    allJobs: [],
    sortedJobs: [],
    tags: [],
    search_string: '',
    sort_date: false,
  });

  useEffect(() => {
    const searchList = filterContext.search_string.split(' ');
    const filterPipeline = () => {
      //Filters all jobs that includes any of the search words
      let searchFilter =
        filterContext.search_string === ''
          ? filterContext.allJobs
          : filterContext.allJobs.filter((job) => {
              return searchList.every((word) => {
                return (
                  job.title.toLowerCase().includes(word.toLowerCase()) ||
                  job.description_preview
                    .toLowerCase()
                    .includes(word.toLowerCase()) ||
                  job.description.toLowerCase().includes(word.toLowerCase()) ||
                  job.tags.some((tag) =>
                    tag.toLowerCase().includes(word.toLowerCase())
                  ) ||
                  job.type.toLowerCase().includes(word.toLowerCase()) ||
                  job.location.toLowerCase().includes(word.toLowerCase()) ||
                  job.company.toLowerCase().includes(word.toLowerCase()) ||
                  job.location.toLowerCase().includes(word.toLowerCase())
                );
              });
            });
      // Filters all jobs that includes any of the tags
      let tagFilter =
        filterContext.tags.length === 0
          ? searchFilter
          : searchFilter.filter((job) => {
              return job.tags.some((tag) => filterContext.tags.includes(tag));
            });
      // Sorts the jobs by date
      function sortByDueDate(a: JobItem, b: JobItem) {
        if (!a.due_date && !b.due_date) {
          return 0; // Both with undefined due_dates
        }
        if (!a.due_date) {
          return 1;
        }
        if (!b.due_date) {
          return -1;
        }
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      return filterContext.sort_date
        ? tagFilter.sort(sortByDueDate) // Ascending
        : tagFilter.sort((a, b) => sortByDueDate(b, a)); // Descending
    };
    setFilterContext({
      ...filterContext,
      sortedJobs: filterPipeline(),
    });
  }, [
    filterContext.search_string,
    filterContext.tags,
    filterContext.sort_date,
  ]);

  return (
    <FilterContextHook.Provider
      value={{
        context: filterContext,
        setContext: setFilterContext,
      }}>
      {children}
    </FilterContextHook.Provider>
  );
};

export default JobFilterProvider;
