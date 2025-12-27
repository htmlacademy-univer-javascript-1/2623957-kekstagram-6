import { openBigPicture } from './big-picture.js';

const PICTURE_TEMPLATE = document.querySelector('#picture').content.querySelector('.picture');
const PICTURES_CONTAINER = document.querySelector('.pictures');

const renderPictures = (photoDescriptions) => {
  const PICTURES_FRAGMENT = document.createDocumentFragment();

  photoDescriptions.forEach((picture) => {
    const pictureElement = PICTURE_TEMPLATE.cloneNode(true);

    const image = pictureElement.querySelector('.picture__img');

    image.src = picture.url;
    image.alt = picture.description;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

    pictureElement.addEventListener('click', (evt) => {
      evt.preventDefault();
      openBigPicture(picture);
    });

    PICTURES_FRAGMENT.appendChild(pictureElement);
  });

  PICTURES_CONTAINER.appendChild(PICTURES_FRAGMENT);
};

export { renderPictures };
