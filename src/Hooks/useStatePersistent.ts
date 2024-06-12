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
    const objectSerialized = await AsyncStorage.getItem(keyName);

    console.log('loading', keyName, ':', objectSerialized);

    if (objectSerialized) {
      const objectStored = JSON.parse(objectSerialized) as T;
      setValue(objectStored);
    }
  }, [keyName]);

  const clearValue = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    loadValue()
      .then(() => setLoaded(true))
      .catch(console.log);
  }, [loadValue]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    AsyncStorage.setItem(keyName, JSON.stringify(value))
      .then(() => console.log('saved', keyName, ':', JSON.stringify(value)))
      .catch(console.log);
  }, [keyName, value, isLoaded]);

  return [value, isLoaded, setValue, clearValue];
}

export type StatePersistentType<T> = [
  value: T,
  isLoaded: boolean,
  setValue: SetStateType<T>,
  clearValue: () => void,
];

export function StatePersistentDefaultValue<T>(
  initialValue: T,
): [value: T, isLoaded: boolean, setValue: () => void, clearValue: () => void] {
  return [initialValue, false, () => {}, () => {}];
}
