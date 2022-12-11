const HOST = "192.168.0.12";
const PORT = "8000";
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

export { getPhoto, getPhotosJson };
