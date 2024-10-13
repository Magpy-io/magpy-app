import { useCallback } from 'react';

import Toast from 'react-native-toast-message';

export function useToast() {
  const showToastError = useCallback((text: string) => {
    Toast.show({
      type: 'error',
      text1: text,
      position: 'top',
    });
  }, []);

  const hideToast = useCallback(() => {
    Toast.hide();
  }, []);

  return { showToastError, hideToast };
}
