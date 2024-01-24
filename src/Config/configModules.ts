import * as config from '~/Config/config';
import { SetPath } from '~/Helpers/BackendQueries';

export function ConfigModules() {
  console.log('Setting backend path to : ', config.backendPath + ':' + config.backendPort);
  SetPath(config.backendPath + ':' + config.backendPort);
}
