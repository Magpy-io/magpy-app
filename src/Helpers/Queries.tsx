//const HOST = "89.157.173.59";
const HOST = "192.168.0.12";
const PORT = "8000";
const path = `http://${HOST}:${PORT}/`;

const routes = {
  getPhotos: path + "getPhotos/",
  getPhotosById: path + "getPhotosById/",
  getPhotosByPath: path + "getPhotosByPath/",
  getPhotoPartById: path + "getPhotoPartById/",
  getNumberPhotos: path + "getNumberPhotos/",
  addPhoto: path + "addPhoto/",
  addPhotoInit: path + "addPhotoInit/",
  addPhotoPart: path + "addPhotoPart/",
  updatePhotoPath: path + "updatePhotoPath/",
  deletePhotosById: path + "deletePhotosById/",
};

type PhotoType = "data" | "thumbnail" | "compressed" | "original";

type ErrorTypes =
  | "SERVER_ERROR"
  | "BAD_REQUEST"
  | "PHOTO_EXISTS"
  | "PHOTO_TRANSFER_NOT_FOUND"
  | "INVALID_PART_NUMBER"
  | "ID_NOT_FOUND";

type ServerErrorType = {
  error: boolean;
  message: string;
  errorCode: ErrorTypes;
};

type ServerPhotoType = {
  id: string;
  image64: string;
  meta: {
    name: string;
    fileSize: number;
    width: number;
    height: number;
    date: string;
    syncDate: string;
    serverPath: string;
    clientPath: string;
  };
};

type GetPhotosReturnType = {
  error?: ServerErrorType;
  endReached: boolean;
  number: number;
  photos: ServerPhotoType[];
};

async function getPhotos(
  count: number,
  offset: number = 0,
  photoType: PhotoType
): Promise<GetPhotosReturnType> {
  const response = await fetch(routes.getPhotos, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      number: count,
      offset: offset,
      photoType: photoType,
    }),
  }).then((r) => r.json());

  if (!response.ok) {
    return formatError(response) as GetPhotosReturnType;
  }
  return response.data as GetPhotosReturnType;
}

type GetPhotosByIdReturnType = {
  error?: ServerErrorType;
  number: number;
  photos: { id: "string"; exists: boolean; photo?: ServerPhotoType }[];
};

async function getPhotosById(
  ids: Array<string>,
  photoType: PhotoType
): Promise<GetPhotosByIdReturnType> {
  const response = await fetch(routes.getPhotosById, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids: ids, photoType: photoType }),
  }).then((r) => r.json());

  if (!response.ok) {
    return formatError(response) as GetPhotosByIdReturnType;
  }
  return response.data as GetPhotosByIdReturnType;
}

type GetPhotosByPathReturnType = {
  error?: ServerErrorType;
  number: number;
  photos: { path: "string"; exists: boolean; photo?: ServerPhotoType }[];
};

async function getPhotosByPath(
  paths: Array<string>,
  photoType: PhotoType
): Promise<GetPhotosByPathReturnType> {
  const response = await fetch(routes.getPhotosByPath, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paths: paths, photoType: photoType }),
  }).then((r) => r.json());

  if (!response.ok) {
    return formatError(response) as GetPhotosByPathReturnType;
  }
  return response.data as GetPhotosByPathReturnType;
}

type GetPhotoWithProgressReturnType = {
  error?: ServerErrorType;
  photo: ServerPhotoType;
};

async function getPhotoWithProgress(
  id: string,
  f: (progess: number, total: number) => void
): Promise<GetPhotoWithProgressReturnType> {
  const response = await fetch(routes.getPhotoPartById, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  }).then((r) => r.json());

  if (!response.ok) {
    return formatError(response) as GetPhotoWithProgressReturnType;
  }

  const totalNbParts = response.data.totalNbOfParts;

  const image64Parts = [response.data.photo.image64];

  let responseI;
  for (let i = 1; i < totalNbParts; i++) {
    responseI = await fetch(routes.getPhotoPartById, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        part: i,
      }),
    }).then((r) => r.json());

    if (!responseI.ok) {
      return formatError(responseI) as GetPhotoWithProgressReturnType;
    }

    image64Parts.push(responseI.data.photo.image64);

    f(i, totalNbParts);
  }
  response.data.photo.image64 = image64Parts.join("");
  return { photo: response.data.photo } as GetPhotoWithProgressReturnType;
}

type GetNumberPhotosReturnType = {
  error?: ServerErrorType;
  number: number;
};

async function getNumberPhotos(): Promise<GetNumberPhotosReturnType> {
  const response = await fetch(routes.getNumberPhotos, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  }).then((r) => r.json());

  if (!response.ok) {
    return formatError(response) as GetNumberPhotosReturnType;
  }

  return { number: response.data.number } as GetNumberPhotosReturnType;
}

type PostPhotoFormat = {
  name: string;
  fileSize: number;
  width: number;
  height: number;
  path: string;
  date: string;
  image64: string;
};

type AddPhotoReturnType = {
  error?: ServerErrorType;
  photo: ServerPhotoType;
};

async function addPhoto(photo: PostPhotoFormat): Promise<AddPhotoReturnType> {
  const response = await fetch(routes.addPhoto, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(photo),
  }).then((r) => r.json());

  if (!response.ok) {
    return formatError(response) as AddPhotoReturnType;
  }

  return { photo: response.data.photo } as AddPhotoReturnType;
}

type AddPhotoWithProgressReturnType = {
  error?: ServerErrorType;
  photo: ServerPhotoType;
};

async function addPhotoWithProgress(
  photo: PostPhotoFormat,
  f: (progess: number, total: number) => void
): Promise<AddPhotoWithProgressReturnType> {
  const base64Image = photo.image64;

  const base64ImageSplit = splitString(base64Image);

  const response = await fetch(routes.addPhotoInit, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: photo.name,
      fileSize: photo.fileSize,
      width: photo.width,
      height: photo.height,
      date: photo.date,
      path: photo.path,
      image64Len: base64Image.length,
    }),
  }).then((r) => r.json());

  if (!response.ok) {
    return formatError(response) as AddPhotoWithProgressReturnType;
  }

  const id = response.data.id;

  let responseI;
  for (let i = 0; i < base64ImageSplit.length; i++) {
    responseI = await fetch(routes.addPhotoPart, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        partNumber: i,
        partSize: base64ImageSplit[i].length,
        photoPart: base64ImageSplit[i],
      }),
    }).then((r) => r.json());

    if (!responseI.ok) {
      return formatError(responseI) as AddPhotoWithProgressReturnType;
    }

    f(i, base64ImageSplit.length);
  }
  return { photo: responseI.data.photo } as AddPhotoWithProgressReturnType;
}

type UpdatePhotoPathReturnType = {
  error?: ServerErrorType;
};

async function updatePhotoPath(
  id: string,
  path: string
): Promise<UpdatePhotoPathReturnType> {
  const response = await fetch(routes.updatePhotoPath, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id, path: path }),
  }).then((r) => r.json());

  if (!response.ok) {
    return formatError(response) as UpdatePhotoPathReturnType;
  }
  return {} as UpdatePhotoPathReturnType;
}

type DeletePhotosByIdReturnType = {
  error?: ServerErrorType;
  deletedIds: string[];
};

async function deletePhotosById(
  ids: string[]
): Promise<DeletePhotosByIdReturnType> {
  const response = await fetch(routes.deletePhotosById, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids: ids }),
  }).then((r) => r.json());

  if (!response.ok) {
    return formatError(response) as DeletePhotosByIdReturnType;
  }

  return { deletedIds: response.data.deletedIds } as DeletePhotosByIdReturnType;
}

function splitString(str: string) {
  const partSize = 100000;
  const len = str.length;
  const numberOfParts = Math.floor(len / partSize);
  const parts = [];

  for (let i = 0; i < numberOfParts; i++) {
    parts.push(str.substring(i * partSize, (i + 1) * partSize));
  }
  if (len % partSize != 0) {
    parts.push(str.substring(partSize * numberOfParts, len));
  }

  return parts;
}

function formatError(res: any) {
  return {
    error: {
      error: true,
      message: res.message,
      errorCode: res.errorCode,
    } as ServerErrorType,
  };
}

export {
  getPhotos,
  getPhotosById,
  getPhotosByPath,
  getPhotoWithProgress,
  getNumberPhotos,
  addPhoto,
  addPhotoWithProgress,
  updatePhotoPath,
  deletePhotosById,
};

export type {
  PhotoType,
  ErrorTypes,
  ServerErrorType,
  ServerPhotoType,
  GetPhotosReturnType,
  GetPhotosByIdReturnType,
  GetPhotosByPathReturnType,
  GetNumberPhotosReturnType,
  PostPhotoFormat,
  UpdatePhotoPathReturnType,
  DeletePhotosByIdReturnType,
};
