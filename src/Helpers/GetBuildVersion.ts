import VersionInfo from 'react-native-version-info';

export interface IBuildVersionProvider {
  getVersionName(): string;
}

export class BuildVersionProvider implements IBuildVersionProvider {
  getVersionName(): string {
    return VersionInfo.appVersion;
  }
}
