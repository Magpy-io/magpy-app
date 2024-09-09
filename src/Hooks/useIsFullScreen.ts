import { useEffect, useState } from 'react';

import { FullScreenModuleEvents } from '~/NativeModules/FullScreenModule';

export function useIsFullScreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const subscription = FullScreenModuleEvents.subscribeOnFullscreenChanged(e => {
      setIsFullscreen(e.isFullScreen);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return isFullscreen;
}
