import * as config from '~/Config/config';
import { SetPath } from '~/Helpers/BackendQueries';

export function ConfigModules() {
  console.log('Setting backend path to : ', config.backendPath);
  SetPath(config.backendPath);
}
