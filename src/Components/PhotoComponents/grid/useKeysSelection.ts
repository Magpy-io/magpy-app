import { useCallback, useState } from 'react';

export function useKeysSelection() {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const selectSingle = useCallback(<T extends { key: string }>(item: T) => {
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

  const selectGroup = useCallback(<T extends { key: string }>(items: T[]) => {
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

  const selectAll = useCallback(<T extends { key: string }>(items: T[]) => {
    setSelectedKeys(sKeys => {
      if (sKeys.size == items.length) {
        return new Set<string>();
      }

      return new Set(items.map(item => item.key));
    });
  }, []);

  const resetSelection = useCallback(<T extends { key: string }>(item?: T) => {
    const newKeys = new Set<string>();
    if (item) {
      newKeys.add(item.key);
    }
    setSelectedKeys(newKeys);
  }, []);

  return { selectedKeys, selectSingle, selectGroup, selectAll, resetSelection };
}
