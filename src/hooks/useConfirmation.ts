import { useEffect, useState } from 'react';

const useConfirmation = (callback: () => void) => {
  const [confirmed, setConfirmed] = useState<boolean | undefined>();

  useEffect(() => {
    if (confirmed !== undefined) {
      callback();
      setConfirmed(undefined);
    }
  }, [confirmed, callback]);

  return { confirmed, setConfirmed };
};

export default useConfirmation;
