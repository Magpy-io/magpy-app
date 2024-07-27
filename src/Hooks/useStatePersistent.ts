import { useCallback, useEffect, useMemo, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

/** Only use with serializable values*/
export function useStatePersistent<T>(
  initialValue: T,
  keyName: string,
): StatePersistentType<T> {
  const [value, setValue] = useState<T>(initialValue);
  const [isLoaded, setLoaded] = useState(false);

  const keyNameFull = useMemo(() => 'USE_STATE_PERSISTENT_KEY_' + keyName, [keyName]);

  const loadValue = useCallback(async () => {
    const objectSerialized = await AsyncStorage.getItem(keyNameFull);

    if (objectSerialized) {
      const objectStored = JSON.parse(objectSerialized) as T;
      setValue(objectStored);
    }
  }, [keyNameFull]);

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
    AsyncStorage.setItem(keyNameFull, JSON.stringify(value)).catch(console.log);
  }, [keyNameFull, value, isLoaded]);

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
