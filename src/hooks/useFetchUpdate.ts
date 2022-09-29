import { useState, useEffect } from 'react';

// TODO handle async - await
const useFetchUpdate = (callback: () => void) => {
  const [shouldFetch, setShouldFetch] = useState(false);

  useEffect(() => {
    if (shouldFetch) {
      console.log("fetching");
      callback();
      setShouldFetch(false);
      return;
    }
    console.log("not fetching");
  }, [shouldFetch]);

  return { setShouldFetch };
};

export default useFetchUpdate;
