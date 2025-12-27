import {renderPictures} from './render-thumbnails.js';
import { getData } from './api.js';
import './form.js';

getData(
  (data) => {
    renderPictures(data.slice());
  },
  () => {
    document.body.dispatchEvent(new CustomEvent('showError'));
  }
);
