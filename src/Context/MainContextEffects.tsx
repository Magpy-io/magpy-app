import React, { ReactNode } from 'react';

import { usePhotosDownloadingEffect } from './Contexts/PhotosDownloadingContext/PhotosDownloadingEffect';
import { useServerClaimEffects } from './Contexts/ServerClaimContext';
import { useServerEffect } from './Contexts/ServerContext';
import { usePhotosStoreEffect } from './ReduxStore/Slices/Photos/PhotosFunctions';

type PropsType = {
  children: ReactNode;
};

const MainContextEffects: React.FC<PropsType> = props => {
  useServerClaimEffects();
  useServerEffect();
  usePhotosStoreEffect();
  usePhotosDownloadingEffect();

  return <>{props.children}</>;
};

export default MainContextEffects;
