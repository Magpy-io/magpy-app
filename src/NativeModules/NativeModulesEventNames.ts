import { EmitterSubscription, NativeEventEmitter } from 'react-native';

export enum NativeEventsNames {
  FullScreenChanged = 'FullScreenChanged',
  PhotoUploaded = 'PhotoUploaded',
  ServiceResolved = 'RNZeroconfResolved',
  SearchStarted = 'RNZeroconfStart',
  SearchStopped = 'RNZeroconfStopped',
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

  subscribeOnServiceResolved(f: (service: Service) => void): EmitterSubscription {
    return this.emitter.addListener(NativeEventsNames.ServiceResolved, f);
  }

  subscribeOnSearchStarted(f: () => void): EmitterSubscription {
    return this.emitter.addListener(NativeEventsNames.SearchStarted, f);
  }

  subscribeOnSearchStopped(f: () => void): EmitterSubscription {
    return this.emitter.addListener(NativeEventsNames.SearchStopped, f);
  }
}

export interface Service {
  name: string;
  fullName: string;
  addresses: string[];
  host: string;
  port: number;
  txt: {
    [key: string]: unknown;
  };
}
