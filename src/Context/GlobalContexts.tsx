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
import { ServerInvalidationContextProvider } from './Contexts/ServerInvalidationContext';

type PropsType = {
  children: ReactNode;
};

export const GlobalContexts: React.FC<PropsType> = props => {
  return (
    <PermissionsContextProvider>
      <MainContextProvider>
        <ServerInvalidationContextProvider>
          <AuthContextProvider>
            <LocalServersContextProvider>
              <ServerClaimContextProvider>
                <ServerContextProvider>
                  <UploadWorkerContextProvider>
                    <LocalAccountContextProvider>
                      <PhotosDownloadingContextProvider>
                        <BackupWorkerContextProvider>
                          {props.children}
                        </BackupWorkerContextProvider>
                      </PhotosDownloadingContextProvider>
                    </LocalAccountContextProvider>
                  </UploadWorkerContextProvider>
                </ServerContextProvider>
              </ServerClaimContextProvider>
            </LocalServersContextProvider>
          </AuthContextProvider>
        </ServerInvalidationContextProvider>
      </MainContextProvider>
    </PermissionsContextProvider>
  );
};
