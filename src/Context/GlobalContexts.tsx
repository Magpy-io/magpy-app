import React, { ReactNode } from 'react';

import { AuthContextProvider } from '~/Context/Contexts/AuthContext';
import { BackgroundServiceContextProvider } from '~/Context/Contexts/BackgroundServiceContext';
import { LocalServersContextProvider } from '~/Context/Contexts/LocalServersContext';
import { PhotosDownloadingContextProvider } from '~/Context/Contexts/PhotosDownloadingContext/PhotosDownloadingContext';
import { ServerClaimContextProvider } from '~/Context/Contexts/ServerClaimContext';
import { ServerContextProvider } from '~/Context/Contexts/ServerContext';

import { BackupWorkerContextProvider } from './Contexts/BackupWorkerContext';
import { LocalAccountContextProvider } from './Contexts/LocalAccountContext';
import { MainContextProvider } from './Contexts/MainContext';

type PropsType = {
  children: ReactNode;
};

export const GlobalContexts: React.FC<PropsType> = props => {
  return (
    <MainContextProvider>
      <AuthContextProvider>
        <LocalServersContextProvider>
          <BackgroundServiceContextProvider>
            <ServerClaimContextProvider>
              <ServerContextProvider>
                <LocalAccountContextProvider>
                  <PhotosDownloadingContextProvider>
                    <BackupWorkerContextProvider>{props.children}</BackupWorkerContextProvider>
                  </PhotosDownloadingContextProvider>
                </LocalAccountContextProvider>
              </ServerContextProvider>
            </ServerClaimContextProvider>
          </BackgroundServiceContextProvider>
        </LocalServersContextProvider>
      </AuthContextProvider>
    </MainContextProvider>
  );
};
