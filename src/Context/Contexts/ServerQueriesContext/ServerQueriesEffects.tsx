import React, { ReactNode, useEffect } from 'react';

import { useCachingServerQueries } from './useCachingServerQueries';

type PropsType = {
  children: ReactNode;
};

export const ServerQueriesEffects: React.FC<PropsType> = props => {
  const { LoadCachedServerPhotos } = useCachingServerQueries();

  useEffect(() => {
    LoadCachedServerPhotos().catch(console.log);
  }, [LoadCachedServerPhotos]);

  return props.children;
};
