import { Dimensions, PixelRatio, StatusBar } from 'react-native';

import { FullScreenModule } from '~/NativeModules/FullScreenModule';

export function GetScreenHeight() {
  return Dimensions.get('screen').height;
}

export function GetWindowHeight() {
  return Dimensions.get('window').height;
}

export async function GetStatusBarHeight() {
  const insets = await FullScreenModule.getWindowInsets();
  if (insets.valid) {
    return PixelRatio.roundToNearestPixel(insets.top / PixelRatio.get());
  } else {
    return StatusBar.currentHeight || 24;
  }
}

export async function GetNavigatorBarHeight() {
  const insets = await FullScreenModule.getWindowInsets();
  if (insets.valid) {
    return PixelRatio.roundToNearestPixel(insets.bottom / PixelRatio.get());
  } else {
    return GetScreenHeight() - GetWindowHeight() - (await GetStatusBarHeight());
  }
}

export async function GetIsFullScreen() {
  const insets = await FullScreenModule.getWindowInsets();
  if (insets.valid) {
    return insets.isFullScreen;
  } else {
    return false;
  }
}
