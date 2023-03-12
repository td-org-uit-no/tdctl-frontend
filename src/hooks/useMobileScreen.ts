import { useEffect, useState } from 'react';

export const useMobileScreen = () => {
  const mobileThreshold = 768;
  const [isMobile, setIsMobile] = useState<boolean>(
    window.innerWidth <= mobileThreshold
  );

  const handleWindowSizeChange = () => {
    setIsMobile(window.innerWidth <= mobileThreshold);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  return isMobile;
};
