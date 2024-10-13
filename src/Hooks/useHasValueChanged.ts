import { useRef } from 'react';

export function useHasValueChanged<T>(value: T, initialValue: T) {
  const lastValueRef = useRef<T>(initialValue);

  const valueChanged = lastValueRef.current != value;
  lastValueRef.current = value;

  return valueChanged;
}
