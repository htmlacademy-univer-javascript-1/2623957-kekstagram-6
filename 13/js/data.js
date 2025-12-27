import { getData } from './api.js';

const getPhotosData = async () => {
  const photosData = await getData();
  return photosData;
};

export {getPhotosData};
