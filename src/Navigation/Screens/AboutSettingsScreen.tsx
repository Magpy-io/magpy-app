import React from 'react';

import SettingsPageComponent, {
  SettingsListType,
} from '~/Components/SettingsComponents/SettingsPageComponent';
import { BuildVersionProvider, IBuildVersionProvider } from '~/Helpers/GetBuildVersion';

export default function AboutSettingsScreen() {
  const buildVersionProvider: IBuildVersionProvider = new BuildVersionProvider();

  const data: SettingsListType = [
    {
      title: 'About Magpy',
      data: [
        { type: 'Button', title: 'Magpy website', onPress: () => {} },
        { type: 'Label', title: 'Version ' + buildVersionProvider.getVersionName() },
      ],
    },
  ];

  return <SettingsPageComponent data={data} />;
}
