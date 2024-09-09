import { useCallback, useEffect, useRef } from 'react';

export function useTimeLastChanged(value: unknown) {
  const valueRef = useRef(value);
  const lastChangeTime = useRef(Date.now());

  useEffect(() => {
    if (valueRef.current != value) {
      valueRef.current = value;
      lastChangeTime.current = Date.now();
    }
  }, [value]);

  const timeSinceLastChange = useCallback(() => {
    return Date.now() - lastChangeTime.current;
  }, [lastChangeTime]);

  return { timeSinceLastChange };
}
