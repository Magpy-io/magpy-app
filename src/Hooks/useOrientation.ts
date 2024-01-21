import { useWindowDimensions } from 'react-native';

type Orientation = 'PORTRAIT' | 'LANDSCAPE';

export function useOrientation() {
  const { height, width } = useWindowDimensions();

  const isPortrait: boolean = height >= width;
  const orientation: Orientation = isPortrait ? 'PORTRAIT' : 'LANDSCAPE';

  return { orientation: orientation, height: height, width: width };
}
