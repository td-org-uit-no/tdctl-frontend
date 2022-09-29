import { useEffect, useState } from 'react';

const useConfirmation = (callback: () => void) => {
  const [confirmed, setConfirmed] = useState<boolean | undefined>();

  useEffect(() => {
    if (confirmed !== undefined) {
      callback();
      setConfirmed(undefined);
    }
  }, [confirmed]);

  return { confirmed, setConfirmed };
};

export default useConfirmation;
