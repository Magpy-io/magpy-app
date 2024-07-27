let path: string = '';

export function SetPath(path_p: string) {
  if (typeof path_p !== 'string') {
    throw new Error('path_p parameter must be astring');
  }

  if (path_p[path_p.length - 1] != '/') {
    path_p += '/';
  }

  path = path_p;
}

export function GetPath() {
  checkPathExists();
  return path;
}

export function getPathWithEndpoint(endpoint: string, path?: string) {
  let pathFormatted = path;

  if (pathFormatted) {
    if (pathFormatted[pathFormatted.length - 1] != '/') {
      pathFormatted += '/';
    }
  }

  return (pathFormatted ?? GetPath()) + endpoint + '/';
}

function checkPathExists() {
  if (!path) {
    throw new ErrorPathNotSet();
  }
}

export class ErrorPathNotSet extends Error {
  constructor() {
    super();
    this.message = 'You need to set a path before runing any requests';
  }
}
