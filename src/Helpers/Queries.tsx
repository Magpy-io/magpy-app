const HOST = "192.168.0.21";
const PORT = "8000";
const path = `http://${HOST}:${PORT}/`;

const routes = {
  getPhotosN: (count: number, offset: number) =>
    path + `photos/${count}/${offset}`,
  getPhotoId: (id: string) => path + `photo/${id}`,
  postPhoto: () => path + `photo/`,
};

function getPhoto(id: string) {
  return fetch(routes.getPhotoId(id)).then((r) => r.json());
}

function getPhotosJson(count: number, offset: number = 0) {
  return fetch(routes.getPhotosN(count, offset)).then((r) => r.json());
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
  fetch(routes.postPhoto(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(photo),
  });
}

export { getPhoto, getPhotosJson, postPhoto };
