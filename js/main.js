import {renderPictures} from './render-thumbnails.js';
import { getData } from './api.js';
import { setupFilters } from './filters.js';
import { showErrorMessage } from './form.js';

getData(
  (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {return;}
    renderPictures(data);
    setupFilters(data);
  },
  (error) => {
    if (error) {
      showErrorMessage();
    }
  }
);
