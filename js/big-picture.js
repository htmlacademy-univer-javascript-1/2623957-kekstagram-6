const BIG_PICTURE_ELEMENT = document.querySelector('.big-picture');
const BODY_ELEMENT = document.querySelector('body');
const CLOSE_BUTTON_ELEMENT = BIG_PICTURE_ELEMENT.querySelector('.big-picture__cancel');
const IMAGE_ELEMENT = BIG_PICTURE_ELEMENT.querySelector('.big-picture__img img');
const LIKES_COUNT_ELEMENT = BIG_PICTURE_ELEMENT.querySelector('.likes-count');
const COMMENTS_COUNT_ELEMENT = BIG_PICTURE_ELEMENT.querySelector('.comments-count');
const SOCIAL_CAPTION_ELEMENT = BIG_PICTURE_ELEMENT.querySelector('.social__caption');
const COMMENTS_LIST_ELEMENT = BIG_PICTURE_ELEMENT.querySelector('.social__comments');
const COMMENTS_LOADER_ELEMENT = BIG_PICTURE_ELEMENT.querySelector('.comments-loader');
const SOCIAL_COMMENT_COUNT_ELEMENT = BIG_PICTURE_ELEMENT.querySelector('.social__comment-count');

const createCommentElement = ({ avatar, name, message }) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  const commentAvatar = document.createElement('img');
  commentAvatar.classList.add('social__picture');
  commentAvatar.src = avatar;
  commentAvatar.alt = name;
  commentAvatar.width = 35;
  commentAvatar.height = 35;

  const commentText = document.createElement('p');
  commentText.classList.add('social__text');
  commentText.textContent = message;

  commentElement.appendChild(commentAvatar);
  commentElement.appendChild(commentText);

  return commentElement;
};

const renderComments = (comments) => {
  COMMENTS_LIST_ELEMENT.innerHTML = '';
  const fragment = document.createDocumentFragment();

  comments.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    fragment.appendChild(commentElement);
  });

  COMMENTS_LIST_ELEMENT.appendChild(fragment);
};

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeBigPicture();
  }
};

function closeBigPicture() {
  BIG_PICTURE_ELEMENT.classList.add('hidden');
  BODY_ELEMENT.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
}

CLOSE_BUTTON_ELEMENT.addEventListener('click', () => {
  closeBigPicture();
});

const openBigPicture = (data) => {
  BIG_PICTURE_ELEMENT.classList.remove('hidden');
  BODY_ELEMENT.classList.add('modal-open');

  IMAGE_ELEMENT.src = data.url;
  LIKES_COUNT_ELEMENT.textContent = data.likes;
  COMMENTS_COUNT_ELEMENT.textContent = data.comments.length;
  SOCIAL_CAPTION_ELEMENT.textContent = data.description;

  renderComments(data.comments);

  SOCIAL_COMMENT_COUNT_ELEMENT.classList.add('hidden');
  COMMENTS_LOADER_ELEMENT.classList.add('hidden');

  document.addEventListener('keydown', onDocumentKeydown);
};

export {openBigPicture};
