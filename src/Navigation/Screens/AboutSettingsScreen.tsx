import React from 'react';
import { Linking } from 'react-native';

import SettingsPageComponent, {
  SettingsListType,
} from '~/Components/SettingsComponents/SettingsPageComponent';
import { privacyPolicyUrl, websiteUrl } from '~/Config/config';
import { BuildVersionProvider, IBuildVersionProvider } from '~/Helpers/GetBuildVersion';
import { ShareLogsFolder } from '~/Helpers/Logging/ShareLogs';

export default function AboutSettingsScreen() {
  const buildVersionProvider: IBuildVersionProvider = new BuildVersionProvider();

  const data: SettingsListType = [
    {
      title: 'About Magpy',
      data: [
        {
          type: 'Label',
          title: 'Magpy website',
          onPress: () => {
            Linking.openURL(websiteUrl).catch(console.log);
          },
        },
        {
          type: 'Label',
          title: 'Privacy Policy',
          onPress: () => {
            Linking.openURL(privacyPolicyUrl).catch(console.log);
          },
        },
        { type: 'Label', title: 'Version ' + buildVersionProvider.getVersionName() },
        {
          type: 'Label',
          title: 'Send logs',
          onPress: () => {
            ShareLogsFolder().catch(console.log);
          },
        },
      ],
    },
  ];

  return <SettingsPageComponent data={data} />;
}
