import { EmitterSubscription, NativeEventEmitter } from 'react-native';

export enum NativeEventsNames {
  FullScreenChanged = 'FullScreenChanged',
  PhotoUploaded = 'PhotoUploaded',
}

export class NativeEventEmitterWrapper {
  emitter: NativeEventEmitter;

  constructor() {
    this.emitter = new NativeEventEmitter();
  }

  subscribeOnPhotoUploaded(f: (event: { mediaId: string }) => void): EmitterSubscription {
    return this.emitter.addListener(NativeEventsNames.PhotoUploaded, f);
  }

  subscribeOnFullScreenChanged(
    f: (event: { isFullScreen: boolean }) => void,
  ): EmitterSubscription {
    return this.emitter.addListener(NativeEventsNames.FullScreenChanged, f);
  }
}
