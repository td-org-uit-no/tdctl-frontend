import { useState, useEffect } from 'react';

// TODO handle async - await
// Hook to fetch data
const useFetchUpdate = (callback: () => void) => {
  const [shouldFetch, setShouldFetch] = useState(false);

  useEffect(() => {
    if (shouldFetch) {
      callback();
      setShouldFetch(false);
      return;
    }
  }, [shouldFetch, callback]);

  return { setShouldFetch };
};

export default useFetchUpdate;
