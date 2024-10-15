import React from 'react';

import { UploadIcon } from '~/Components/CommonComponents/Icons';
import { useMainStackNavigation } from '~/Navigation/Navigators/MainStackNavigator';

import { GenericCard } from '../CommonComponents/GenericCard';

const TITLE = 'Automatic backup';
const TEXT = 'Automatically back up your media even when the app is closed';

export default function AutoBackupCard() {
  const { navigate } = useMainStackNavigation();

  return (
    <GenericCard
      icon={<UploadIcon />}
      title={TITLE}
      text={TEXT}
      buttonOk={'Enable'}
      onButtonOk={() => {
        navigate('BackupSettings');
      }}
    />
  );
}
