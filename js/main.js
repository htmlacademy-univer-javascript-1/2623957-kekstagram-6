import {renderPictures} from './render-thumbnails.js';
import { getData } from './api.js';
import { setupFilters } from './filters.js';
import { showAlert } from './util.js';
import './form.js';

getData(
  (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {return;}
    renderPictures(data);
    setupFilters(data);
  },
  (error) => {
    if (error) {
      showAlert('Не удалось загрузить данные. Попробуйте обновить страницу');
    }
  }
);
