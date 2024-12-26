import { useCallback, useRef, useEffect } from 'react';

export const useAnimationFrame = (callback: () => Promise<void>) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const isRunningRef = useRef(false);

  const animate = useCallback(async (time: number) => {
    if (previousTimeRef.current !== undefined && !isRunningRef.current) {
      isRunningRef.current = true;
      try {
        await callback();
      } finally {
        isRunningRef.current = false;
      }
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [callback]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);
};