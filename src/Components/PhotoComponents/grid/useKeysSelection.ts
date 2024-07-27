import { useCallback, useState } from 'react';

type ContainsKey = { key: string; [key: string]: unknown };

export interface KeysSelection {
  selectSingle: (item: ContainsKey) => void;
  selectGroup: (items: ContainsKey[]) => void;
  selectAll: (items: ContainsKey[]) => void;
  resetSelection: (item?: ContainsKey) => void;
  isSelected: (item: ContainsKey) => boolean;
  countSelected: () => number;
}

export function useKeysSelection(): KeysSelection {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const selectSingle = useCallback((item: ContainsKey) => {
    setSelectedKeys(sKeys => {
      if (sKeys.has(item.key)) {
        const newSet = new Set(sKeys);
        newSet.delete(item.key);
        return newSet;
      } else {
        const newSet = new Set(sKeys);
        newSet.add(item.key);
        return newSet;
      }
    });
  }, []);

  const selectGroup = useCallback((items: ContainsKey[]) => {
    setSelectedKeys(sKeys => {
      const newSet = new Set(sKeys);

      const isAllGroupSelected = !items.find(item => !sKeys.has(item.key));

      if (isAllGroupSelected) {
        items.forEach(item => {
          newSet.delete(item.key);
        });
      } else {
        items.forEach(item => {
          if (!sKeys.has(item.key)) {
            newSet.add(item.key);
          }
        });
      }
      return newSet;
    });
  }, []);

  const selectAll = useCallback((items: ContainsKey[]) => {
    setSelectedKeys(sKeys => {
      if (sKeys.size == items.length) {
        return new Set<string>();
      }

      return new Set(items.map(item => item.key));
    });
  }, []);

  const resetSelection = useCallback((item?: ContainsKey) => {
    const newKeys = new Set<string>();
    if (item) {
      newKeys.add(item.key);
    }
    setSelectedKeys(newKeys);
  }, []);

  const isSelected = useCallback(
    (item: ContainsKey) => {
      return selectedKeys.has(item.key);
    },
    [selectedKeys],
  );

  const countSelected = useCallback(() => {
    return selectedKeys.size;
  }, [selectedKeys]);

  return { countSelected, isSelected, selectSingle, selectGroup, selectAll, resetSelection };
}
