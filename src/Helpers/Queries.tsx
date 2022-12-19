const HOST = "192.168.0.21";
const PORT = "8001";
const path = `http://${HOST}:${PORT}/`;

const routes = {
  photos: "photos/",
  photo: "photo/",
};

function getPhoto(id: string) {
  const getPhotoPath = path + routes.photo + id;
  return fetch(getPhotoPath);
}

function getPhotosJson() {
  const getPhotosPath = path + routes.photos;
  return fetch(getPhotosPath).then((r) => r.json());
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
  const postPhotoPath = path + routes.photo;
  console.log(photo.name);
  fetch(postPhotoPath, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(photo),
  });
}

export { getPhoto, getPhotosJson, postPhoto };
