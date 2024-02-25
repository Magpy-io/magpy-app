import {
  makeGalleryPhoto,
  makeNGalleryPhotosWithDifferentDates,
} from '~/Context/ReduxStore/Slices/Photos/__tests__/MockValues';

import { getIndexInSectionList, getSectionsFromPhotos } from '../Helpers';

describe('Tests for function getIndexInSectionList', () => {
  it('Should return section 0 and itemIndex 0 when passing first photo', () => {
    const photos = makeNGalleryPhotosWithDifferentDates(2);
    const sections = getSectionsFromPhotos(photos, 'Day');

    const { sectionIndex, itemIndex } = getIndexInSectionList(photos[0], sections);
    expect(sectionIndex).toBe(0);
    expect(itemIndex).toBe(0);
  });

  it('Should return sectionIndex 0 and itemIndex 1 when passing second photo', () => {
    const photos = makeNGalleryPhotosWithDifferentDates(2);
    const sections = getSectionsFromPhotos(photos, 'Month');

    const { sectionIndex, itemIndex } = getIndexInSectionList(photos[1], sections);
    expect(sectionIndex).toBe(0);
    expect(itemIndex).toBe(1);
  });

  it('Should return sectionIndex 1 and itemIndex 0 when passing first photo in second section', () => {
    const photos = makeNGalleryPhotosWithDifferentDates(2);
    const sections = getSectionsFromPhotos(photos, 'Day');

    const { sectionIndex, itemIndex } = getIndexInSectionList(photos[1], sections);
    expect(sectionIndex).toBe(1);
    expect(itemIndex).toBe(0);
  });

  it('Should return sectionIndex -1 when photo section not found', () => {
    const [extraPhoto, ...photos] = makeNGalleryPhotosWithDifferentDates(3);
    const sections = getSectionsFromPhotos(photos, 'Day');

    const { sectionIndex } = getIndexInSectionList(extraPhoto, sections);
    expect(sectionIndex).toBe(-1);
  });

  it('Should return sectionIndex 0 and itemIndex -1 when photo section is found but does not exist in the section', () => {
    const photos = makeNGalleryPhotosWithDifferentDates(2);
    const sections = getSectionsFromPhotos(photos, 'Day');

    const photo = makeGalleryPhoto({ mediaId: 'newPhotoId', date: photos[0].date });
    const { sectionIndex, itemIndex } = getIndexInSectionList(photo, sections);

    expect(sectionIndex).toBe(0);
    expect(itemIndex).toBe(-1);
  });
});

describe('Testing getSectionsFromPhotos function', () => {
  it('Should group photos by day when called with "Day"', () => {
    const photo1 = makeGalleryPhoto({ date: '2024-02-12T12:30:00.000Z' });
    const photo2 = makeGalleryPhoto({ date: '2024-02-11T12:30:00.000Z' });

    const sections = getSectionsFromPhotos([photo1, photo2], 'Day');

    expect(sections.length).toBe(2);

    expect(sections[0].sectionData.getTitle()).toBe('Feb 12, 2024');
    expect(sections[0].data.length).toBe(1);
    expect(sections[0].data[0]).toBe(photo1);

    expect(sections[1].sectionData.getTitle()).toBe('Feb 11, 2024');
    expect(sections[1].data.length).toBe(1);
    expect(sections[1].data[0]).toBe(photo2);
  });

  it('Should group photos by month when called with "Month"', () => {
    const photo1 = makeGalleryPhoto({ date: '2024-02-12T12:30:00.000Z' });
    const photo2 = makeGalleryPhoto({ date: '2024-01-11T12:30:00.000Z' });

    const sections = getSectionsFromPhotos([photo1, photo2], 'Month');

    expect(sections.length).toBe(2);

    expect(sections[0].sectionData.getTitle()).toBe('February 2024');
    expect(sections[0].data.length).toBe(1);
    expect(sections[0].data[0]).toBe(photo1);

    expect(sections[1].sectionData.getTitle()).toBe('January 2024');
    expect(sections[1].data.length).toBe(1);
    expect(sections[1].data[0]).toBe(photo2);
  });

  it('Should group photos by year when called with "Year"', () => {
    const photo1 = makeGalleryPhoto({ date: '2024-02-12T12:30:00.000Z' });
    const photo2 = makeGalleryPhoto({ date: '2023-01-11T12:30:00.000Z' });

    const sections = getSectionsFromPhotos([photo1, photo2], 'Year');

    expect(sections.length).toBe(2);

    expect(sections[0].sectionData.getTitle()).toBe('2024');
    expect(sections[0].data.length).toBe(1);
    expect(sections[0].data[0]).toBe(photo1);

    expect(sections[1].sectionData.getTitle()).toBe('2023');
    expect(sections[1].data.length).toBe(1);
    expect(sections[1].data[0]).toBe(photo2);
  });
});

describe('Testing more cases for getSectionsFromPhotos function', () => {
  it('Should work with more than two photos per group', () => {
    const photo1 = makeGalleryPhoto({ date: '2024-02-12T12:30:00.000Z' });
    const photo2 = makeGalleryPhoto({ date: '2024-02-12T12:30:00.000Z' });
    const photo3 = makeGalleryPhoto({ date: '2024-01-11T12:30:00.000Z' });
    const photo4 = makeGalleryPhoto({ date: '2024-01-11T12:30:00.000Z' });

    const sections = getSectionsFromPhotos([photo1, photo2, photo3, photo4], 'Day');

    expect(sections.length).toBe(2);

    expect(sections[0].data.length).toBe(2);
    expect(sections[0].data[0]).toBe(photo1);
    expect(sections[0].data[1]).toBe(photo2);

    expect(sections[1].data.length).toBe(2);
    expect(sections[1].data[0]).toBe(photo3);
    expect(sections[1].data[1]).toBe(photo4);
  });

  it('Should return empty array when empty array of photos is passed', () => {
    const sections = getSectionsFromPhotos([], 'Day');
    expect(sections.length).toBe(0);
  });

  it('Should return a single section when passing a single photo', () => {
    const photo1 = makeGalleryPhoto({ date: '2024-02-12T12:30:00.000Z' });

    const sections = getSectionsFromPhotos([photo1], 'Day');

    expect(sections.length).toBe(1);
    expect(sections[0].data.length).toBe(1);
    expect(sections[0].data[0]).toBe(photo1);
  });
});
