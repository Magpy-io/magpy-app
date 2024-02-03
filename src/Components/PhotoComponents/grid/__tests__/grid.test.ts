import {
  photo1,
  photoLocal1,
  photosLocal,
  photosServer,
} from '~/Context/ReduxStore/Slices/__tests__/MockValues';

import { getPhotoServerOrLocal } from '../Helpers';

it('Should return local photo', () => {
  const photo = photo1;
  const photoData = getPhotoServerOrLocal(photosLocal, photosServer, photo);

  expect(photoData).toBe(photoLocal1);
});
