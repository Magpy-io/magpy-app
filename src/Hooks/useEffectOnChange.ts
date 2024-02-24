import { useEffect, useRef } from 'react';

export default function useEffectOnChange<T>(value: T, callback: () => unknown) {
  const oldValue = useRef(value);
  useEffect(() => {
    if (value !== oldValue.current) {
      oldValue.current = value;
      callback();
    }
  }, [callback, value]);
}
