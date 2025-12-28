import { renderPictures } from './render-thumbnails.js';
import { debounce } from './util.js';

const TOTAL_RANDOM = 10;
const TIMEOUT = 500;

const filterSection = document.querySelector('.img-filters');
const buttons = document.querySelectorAll('.img-filters__button');

let localData = [];

const removeOldItems = () => {
  const pictures = document.getElementsByClassName('picture');
  while (pictures[0]) {
    pictures[0].parentNode.removeChild(pictures[0]);
  }
};

const FilterHandlers = {
  'filter-default': (data) => data,
  'filter-random': (data) => [...data].sort(() => Math.random() - 0.5).slice(0, TOTAL_RANDOM),
  'filter-discussed': (data) => data.slice().sort((a, b) => b.comments.length - a.comments.length)
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

  for (const btn of buttons) {
    btn.addEventListener('click', (evt) => {
      buttons.forEach((el) => el.classList.remove('img-filters__button--active'));

      const currentBtn = evt.target;
      currentBtn.classList.add('img-filters__button--active');

      optimizedRefresh(currentBtn.id);
    });
  }
};

export { setupFilters };
