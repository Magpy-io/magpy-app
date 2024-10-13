import { useCallback } from 'react';

import Toast from 'react-native-toast-message';

let lastToastTime = 0;

const TOAST_VISIBILITY_TIME = 3000;

export function useToast() {
  const showToastError = useCallback((text: string) => {
    const timeNow = Date.now();

    if (timeNow - lastToastTime < TOAST_VISIBILITY_TIME) {
      return;
    }

    lastToastTime = timeNow;

    Toast.show({
      type: 'error',
      text1: text,
      position: 'top',
      visibilityTime: TOAST_VISIBILITY_TIME,
    });
  }, []);

  const hideToast = useCallback(() => {
    Toast.hide();
  }, []);

  return { showToastError, hideToast };
}
