import React, { ReactNode } from 'react';

import { useAuthDataEffect } from './ContextSlices/AuthContext';
import { useBackgroundServiceEffects } from './ContextSlices/BackgroundServiceContext';
import { useLocalServersEffect } from './ContextSlices/LocalServersContext';
import { usePhotosDownloadingEffect } from './ContextSlices/PhotosDownloadingContext/PhotosDownloadingEffect';
import { useServerClaimEffects } from './ContextSlices/ServerClaimContext';
import { useServerEffect } from './ContextSlices/ServerContext';
import { usePhotosStoreEffect } from './ReduxStore/Slices/PhotosFunctions';

type PropsType = {
  children: ReactNode;
};

const MainContextEffects: React.FC<PropsType> = props => {
  useAuthDataEffect();
  useLocalServersEffect();
  useBackgroundServiceEffects();
  useServerClaimEffects();
  useServerEffect();
  usePhotosStoreEffect();
  usePhotosDownloadingEffect();

  return <>{props.children}</>;
};

export default MainContextEffects;
