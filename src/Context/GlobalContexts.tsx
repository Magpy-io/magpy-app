import React, { ReactNode } from 'react';

import { AuthContextProvider } from '~/Context/Contexts/AuthContext';
import { LocalServersContextProvider } from '~/Context/Contexts/LocalServersContext';
import { PhotosDownloadingContextProvider } from '~/Context/Contexts/PhotosDownloadingContext/PhotosDownloadingContext';
import { ServerClaimContextProvider } from '~/Context/Contexts/ServerClaimContext';
import { ServerContextProvider } from '~/Context/Contexts/ServerContext';
import { UploadWorkerContextProvider } from '~/Context/Contexts/UploadWorkerContext';

import { BackupWorkerContextProvider } from './Contexts/BackupWorkerContext';
import { LocalAccountContextProvider } from './Contexts/LocalAccountContext';
import { MainContextProvider } from './Contexts/MainContext';
import { PermissionsContextProvider } from './Contexts/PermissionsContext';

type PropsType = {
  children: ReactNode;
};

export const GlobalContexts: React.FC<PropsType> = props => {
  return (
    <PermissionsContextProvider>
      <MainContextProvider>
        <AuthContextProvider>
          <LocalServersContextProvider>
            <UploadWorkerContextProvider>
              <ServerClaimContextProvider>
                <ServerContextProvider>
                  <LocalAccountContextProvider>
                    <PhotosDownloadingContextProvider>
                      <BackupWorkerContextProvider>
                        {props.children}
                      </BackupWorkerContextProvider>
                    </PhotosDownloadingContextProvider>
                  </LocalAccountContextProvider>
                </ServerContextProvider>
              </ServerClaimContextProvider>
            </UploadWorkerContextProvider>
          </LocalServersContextProvider>
        </AuthContextProvider>
      </MainContextProvider>
    </PermissionsContextProvider>
  );
};
