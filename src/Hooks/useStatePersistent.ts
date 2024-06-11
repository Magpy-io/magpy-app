import { useCallback, useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

/** Only use with serializable values*/
export function useStatePersistent<T>(
  initialValue: T,
  keyName: string,
): StatePersistentType<T> {
  const [value, setValue] = useState<T>(initialValue);
  const [isLoaded, setLoaded] = useState(false);

  const loadValue = useCallback(async () => {
    console.log('loading ', keyName);
    const objectSerialized = await AsyncStorage.getItem(keyName);

    if (objectSerialized) {
      const objectStored = JSON.parse(objectSerialized) as T;
      setValue(objectStored);
    }
  }, [keyName]);

  const clearValue = useCallback(async () => {
    await AsyncStorage.removeItem(keyName);
    setValue(initialValue);
  }, [keyName, initialValue]);

  useEffect(() => {
    AsyncStorage.setItem(keyName, JSON.stringify(value)).catch(console.log);
  }, [keyName, value]);

  useEffect(() => {
    loadValue()
      .then(() => setLoaded(true))
      .catch(console.log);
  }, [loadValue]);

  return [value, isLoaded, setValue, clearValue];
}

export type StatePersistentType<T> = [
  value: T,
  isLoaded: boolean,
  setValue: SetStateType<T>,
  clearValue: () => Promise<void>,
];

export function StatePersistentDefaultValue<T>(
  initialValue: T,
): [value: T, isLoaded: boolean, setValue: () => void, clearValue: () => Promise<void>] {
  return [
    initialValue,
    false,
    () => {},
    () => {
      return new Promise(resolve => resolve());
    },
  ];
}
