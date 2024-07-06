import React, { ReactNode, useEffect } from 'react';

import { AutoBackupModule } from '~/NativeModules/AutoBackupModule';

import { useBackupWorkerContextSettersInner } from './BackupWorkerContext';

type PropsType = {
  children: ReactNode;
};

export const BackupWorkerEffect: React.FC<PropsType> = props => {
  const { setAutobackupEnabled } = useBackupWorkerContextSettersInner();

  useEffect(() => {
    AutoBackupModule.IsWorkerAlive()
      .then(alive => setAutobackupEnabled(alive))
      .catch(console.log);
  }, [setAutobackupEnabled]);

  return props.children;
};
