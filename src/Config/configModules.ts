import axios from 'axios';

import * as config from '~/Config/config';
import { SetPath } from '~/Helpers/BackendQueries';

export function ConfigModules() {
  SetPath(config.backendPath);

  axios.defaults.timeout = 10000;
}
