const HOST = "192.168.0.21";
const PORT = "8000";
const path = `http://${HOST}:${PORT}/`;

const routes = {
  getPhotosN: path + "photosGetNb/",
  getPhotoId: path + "photoGetId/",
  postPhoto: path + "photoAdd/",
  getPhotosExist: path + "photosExist/",
  getPhotosDataN: path + "photosDataGetNb/",
  getPhotosByIds: path + "photosGetId/",
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
  fetch(routes.postPhoto, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(photo),
  }).then((r) => r.json());
}

export {
  getPhotoById,
  getPhotosN,
  postPhoto,
  getPhotosExist,
  getPhotosDataN,
  getPhotosByIds,
};
