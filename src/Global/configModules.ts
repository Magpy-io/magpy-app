import {SetPath} from '~/Helpers/backendImportedQueries';
import * as config from '~/Config/config';

export function ConfigModules() {
    SetPath(config.backendPath + ':' + config.backendPort);
}
