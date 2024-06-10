import { useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

/** Only use with serializable values*/
export function useStatePersistent<T>(initialValue: T, name: string) {
  const [value, setValue] = useState<T | null>(null);

  const setValuePersistent = async (newValue: T) => {
    await AsyncStorage.setItem(name, JSON.stringify(newValue));
    setValue(newValue);
  };

  const loadValue = async () => {
    const objectSerialized = await AsyncStorage.getItem(name);

    if (objectSerialized == null) {
      setValue(initialValue);
      return;
    }

    const objectStored = JSON.parse(objectSerialized) as T;
    setValue(objectStored);
  };

  const isLoaded = value != null;

  return {
    value,
    setValuePersistent,
    loadValue,
    isLoaded,
  };
}

export type StatePersistentType<T> = {
  value: T | null;
  setValuePersistent: ((newValue: T) => Promise<void>) | (() => void);
  loadValue: (() => Promise<void>) | (() => void);
  isLoaded: boolean;
};

export const StatePersistentDefaultValue = {
  value: null,
  setValuePersistent: () => {},
  loadValue: () => {},
  isLoaded: false,
};
