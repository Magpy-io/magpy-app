import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export function useToast() {
  const insets = useSafeAreaInsets();

  const showToastError = (text: string, position?: 'bottom' | 'top') => {
    Toast.show({
      type: 'error',
      text1: text,
      position: position ?? 'top',
      bottomOffset: insets.bottom + 5,
    });
  };

  const hideToast = () => {
    Toast.hide();
  };

  return { showToastError, hideToast };
}
