import {createPhotoDescriptions} from './data.js';
import {renderPictures} from './render-thumbnails.js';
import './form.js';

const PHOTO_DESCRIPTIONS = createPhotoDescriptions();
renderPictures(PHOTO_DESCRIPTIONS);
