const PICTURE_TEMPLATE = document.querySelector('#picture').content.querySelector('.picture');

const renderPictures = (photoDescriptions) => {
  const PICTURES_CONTAINER = document.querySelector('.pictures');
  const PICTURES_FRAGMENT = document.createDocumentFragment();

  photoDescriptions.forEach(({url, description, likes, comments}) => {
    const PICTURE_ELEMENT = PICTURE_TEMPLATE.cloneNode(true);

    const IMAGE = PICTURE_ELEMENT.querySelector('.picture__img');
    IMAGE.src = url;
    IMAGE.alt = description;

    PICTURE_ELEMENT.querySelector('.picture__likes').textContent = likes;
    PICTURE_ELEMENT.querySelector('.picture__comments').textContent = comments.length;

    PICTURES_FRAGMENT.appendChild(PICTURE_ELEMENT);
  });

  PICTURES_CONTAINER.appendChild(PICTURES_FRAGMENT);
};

export {renderPictures};
