import { useEffect } from 'react';
import { BackHandler } from 'react-native';

export function useCustomBackPress(
  action: (...args: unknown[]) => unknown,
  condition: boolean,
) {
  useEffect(() => {
    if (condition) {
      const backAction = () => {
        action();
        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => backHandler.remove();
    }
  }, [action, condition]);
}
