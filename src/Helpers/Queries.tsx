const HOST = "89.157.173.59";
//const HOST = "192.168.0.12";
const PORT = "8000";
const path = `http://${HOST}:${PORT}/`;

const routes = {
  getPhotosN: path + "photosGetNb/",
  getPhotoId: path + "photoGetId/",
  postPhoto: path + "photoAdd/",
  postPhotoInit: path + "photoAddInit/",
  postPhotoPart: path + "photoAddPart/",
  getPhotosExist: path + "photosExist/",
  getPhotosDataN: path + "photosDataGetNb/",
  getPhotosByIds: path + "photosGetId/",
  deletePhotoId: path + "photoDelete/",
  updatePhotoPath: path + "photoUpdatePath/",
};

function getPhotoById(id: string) {
  return fetch(routes.getPhotoId, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  }).then((r) => r.json());
}

function getPhotosN(count: number, offset: number = 0) {
  return fetch(routes.getPhotosN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ number: count, offset: offset }),
  }).then((r) => r.json());
}

function getPhotosDataN(count: number, offset: number = 0) {
  return fetch(routes.getPhotosDataN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ number: count, offset: offset }),
  }).then((r) => r.json());
}

function getPhotosExist(paths: Array<string>) {
  return fetch(routes.getPhotosExist, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paths: paths }),
  }).then((r) => r.json());
}

function getPhotosByIds(ids: Array<string>) {
  return fetch(routes.getPhotosByIds, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids: ids }),
  }).then((r) => r.json());
}

function removePhotoById(id: string) {
  return fetch(routes.deletePhotoId, {
    method: "Delete",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  }).then((r) => r.json());
}

type PostPhotoFormat = {
  name: string;
  fileSize: number;
  width: number;
  height: number;
  date: string;
  path: string;
  image64: string;
};

function postPhoto(photo: PostPhotoFormat) {
  return fetch(routes.postPhoto, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(photo),
  }).then((r) => r.json());
}

async function postPhotoWithProgress(
  photo: PostPhotoFormat,
  f: (progess: number, total: number) => void
) {
  const base64Image = photo.image64;

  const base64ImageSplit = splitString(base64Image);

  const r = await fetch(routes.postPhotoInit, {
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
  });

  const rJson = await r.json();

  const id = rJson.data.photo.id;

  for (let i = 0; i < base64ImageSplit.length; i++) {
    await fetch(routes.postPhotoPart, {
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
    });
    f(i, base64ImageSplit.length);
  }
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

function updatePhotoPath(id: string, path: string) {
  return fetch(routes.updatePhotoPath, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id, path: path }),
  }).then((r) => r.json());
}

export {
  getPhotoById,
  getPhotosN,
  postPhoto,
  getPhotosExist,
  getPhotosDataN,
  getPhotosByIds,
  removePhotoById,
  postPhotoWithProgress,
  updatePhotoPath,
};
