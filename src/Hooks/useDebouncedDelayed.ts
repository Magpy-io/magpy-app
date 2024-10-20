import { useEffect, useState } from 'react';

/**
 * Returns a debounced version of the passed value.
 * The returned value is not updated immediatly after the input value changes.
 * Instead a delay is used to return the last stable value, while ignoring rapid value changes of the input.
 *
 * @param   value  The value to debounce.
 * @param   delay  The time to wait before accepting a value.
 * @returns The input value but debounced.
 */
export function useDebouncedDelayed<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handle);
    };
  }, [delay, value]);

  return debouncedValue;
}
