import { useState, useEffect } from 'react';

export const useAppLoader = (initialLoading = true, delay = 0) => {
  const [isLoading, setIsLoading] = useState(initialLoading);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        // setIsLoading(false);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return {
    isLoading,
    startLoading,
    stopLoading,
  };
};
