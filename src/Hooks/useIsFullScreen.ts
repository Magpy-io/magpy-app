import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useIsFullScreen() {
  const insets = useSafeAreaInsets();
  return insets.top == 0 && insets.bottom == 0;
}
