import { renderPictures } from './render-thumbnails.js';
import { debounce } from './util.js';

const TOTAL_RANDOM = 10;
const TIMEOUT = 500;

const filterSection = document.querySelector('.img-filters');
const filterForm = filterSection.querySelector('.img-filters__form');

let localData = [];

const removeOldItems = () => {
  const pictures = document.querySelectorAll('.picture');
  pictures.forEach((item) => item.remove());
};

const FilterHandlers = {
  'filter-default': (data) => data,
  'filter-random': (data) => [...data].sort(() => Math.random() - 0.5).slice(0, TOTAL_RANDOM),
  'filter-discussed': (data) => [...data].sort((a, b) => b.comments.length - a.comments.length)
};

const rebuildGrid = (id) => {
  removeOldItems();
  const sorted = FilterHandlers[id](localData);
  renderPictures(sorted);
};

const optimizedRefresh = debounce((id) => rebuildGrid(id), TIMEOUT);

const setupFilters = (data) => {
  localData = [...data];
  filterSection.classList.remove('img-filters--inactive');

  filterForm.addEventListener('click', (evt) => {
    const target = evt.target;

    if (!target.classList.contains('img-filters__button')) {
      return;
    }

    const activeBtn = filterForm.querySelector('.img-filters__button--active');
    if (activeBtn) {
      activeBtn.classList.remove('img-filters__button--active');
    }

    // 2. Добавляем класс нажатой кнопке
    target.classList.add('img-filters__button--active');

    optimizedRefresh(target.id);
  });
};

export { setupFilters };
