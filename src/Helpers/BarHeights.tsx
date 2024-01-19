import {Dimensions, StatusBar, PixelRatio} from 'react-native';

import {NativeModules} from 'react-native';
const {MainModule} = NativeModules;

export function GetScreenHeight() {
    return Dimensions.get('screen').height;
}

export function GetWindowHeight() {
    return Dimensions.get('window').height;
}

export function GetStatusBarHeight() {
    // const insets = MainModule.getWindowInsets();
    // if (insets.valid) {
    //   return PixelRatio.roundToNearestPixel(insets.top / PixelRatio.get());
    // } else {
    //   return StatusBar.currentHeight || 24;
    // }
}

export function GetNavigatorBarHeight() {
    // const insets = MainModule.getWindowInsets();
    // if (insets.valid) {
    //   return PixelRatio.roundToNearestPixel(insets.bottom / PixelRatio.get());
    // } else {
    //   return GetScreenHeight() - GetWindowHeight() - GetStatusBarHeight();
    // }
}

export function GetIsFullScreen() {
    // const insets = MainModule.getWindowInsets();
    // if (insets.valid) {
    //   return insets.isFullScreen;
    // } else {
    //   return false;
    // }
}
