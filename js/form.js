import { isEscapeKey } from './util.js';
import { initScaleAndEffects, resetScaleAndEffects } from './scale-effects.js';
import { sendData } from './api.js';

const MAX_HASHTAGS = 5;
const MAX_SYMBOLS = 20;
const FILE_TYPES = ['jpg', 'jpeg', 'png'];
const DEFAULT_IMAGE = 'img/upload-default-image.jpg';
const MAX_COMMENT_LENGTH = 140;

let lastHashtagError = '';
let lastCommentError = '';

const uploadFormElement = document.querySelector('.img-upload__form');
const uploadInputElement = uploadFormElement.querySelector('#upload-file');
const uploadOverlayElement = uploadFormElement.querySelector('.img-upload__overlay');
const uploadCancelElement = uploadFormElement.querySelector('#upload-cancel');
const submitButton = uploadFormElement.querySelector('#upload-submit');
const hashtagsInputElement = uploadFormElement.querySelector('.text__hashtags');
const commentInputElement = uploadFormElement.querySelector('.text__description');

const previewImage = uploadFormElement.querySelector('.img-upload__preview img');
const effectsPreviews = uploadFormElement.querySelectorAll('.effects__preview');

const pristine = new Pristine(uploadFormElement, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__item--invalid',
  successClass: 'img-upload__item--valid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'img-upload__error-text',
});

const validateHashtags = (value) => {
  lastHashtagError = '';
  const text = (value || '').trim().toLowerCase();
  if (text.length === 0) {
    return true;
  }
  const tags = text.split(/\s+/).filter(Boolean);
  const rules = [
    {
      check: tags.some((item) => item === '#'),
      error: 'Хэш-тег не может состоять только из символа #',
    },
    {
      check: tags.some((item) => !item.startsWith('#')),
      error: 'Хэш-тег должен начинаться с символа #',
    },
    {
      check: tags.some((item) => item.indexOf('#', 1) !== -1),
      error: 'Хэш-теги должны разделяться пробелами',
    },
    {
      check: tags.some((item) => item.length > MAX_SYMBOLS),
      error: `Максимальная длина хэш-тега — ${MAX_SYMBOLS} символов (включая #)`,
    },
    {
      check: tags.some((item) => !/^#[a-zа-яё0-9]{1,19}$/i.test(item)),
      error: 'Хэш-тег содержит недопустимые символы',
    },
    {
      check: tags.some((item, i, arr) => arr.indexOf(item, i + 1) !== -1),
      error: 'Хэш-теги не должны повторяться',
    },
    {
      check: tags.length > MAX_HASHTAGS,
      error: `Максимальное количество хэш-тегов — ${MAX_HASHTAGS}`,
    },
  ];

  for (const rule of rules) {
    if (rule.check) {
      lastHashtagError = rule.error;
      return false;
    }
  }
  return true;
};

const getHashtagErrorMessage = () => lastHashtagError || '';

const validateComment = (value) => {
  lastCommentError = '';
  const text = value || '';
  if (text.length <= MAX_COMMENT_LENGTH) {
    return true;
  }
  lastCommentError = 'Максимальная длина комментария 140 символов';
  return false;
};

const getCommentErrorMessage = () => lastCommentError || '';

pristine.addValidator(hashtagsInputElement, validateHashtags, getHashtagErrorMessage, 2, false);
pristine.addValidator(commentInputElement, validateComment, getCommentErrorMessage, 1, false);

const showMessage = (templateId, messageClass, innerClass, buttonClass) => {
  const template = document.querySelector(templateId).content.cloneNode(true);
  const message = template.querySelector(messageClass);
  document.body.append(message);

  const onButtonClick = () => {
    message.remove();
    document.removeEventListener('keydown', onEsc);
    document.removeEventListener('click', onOutsideClick);
  };

  function onEsc(evt) {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      onButtonClick();
    }
  }

  function onOutsideClick(evt) {
    if (!evt.target.closest(innerClass)) {
      onButtonClick();
    }
  }

  const button = message.querySelector(buttonClass);
  if (button) {
    button.addEventListener('click', onButtonClick);
  }

  document.addEventListener('keydown', onEsc);
  document.addEventListener('click', onOutsideClick);
};

const onSuccessSendData = () => showMessage('#success', '.success', '.success__inner', '.success__button');
const onErrorSendData = () => showMessage('#error', '.error', '.error__inner', '.error__button');

const onUploadCancelClick = () => {
  uploadOverlayElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);

  uploadFormElement.reset();
  uploadInputElement.value = '';

  previewImage.src = DEFAULT_IMAGE;
  effectsPreviews.forEach((preview) => {
    preview.style.backgroundImage = '';
  });

  pristine.reset();
  resetScaleAndEffects();
};

const openUploadForm = () => {
  uploadOverlayElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
  initScaleAndEffects();
};

function onDocumentKeydown(evt) {
  if (isEscapeKey(evt)) {
    if (document.activeElement === hashtagsInputElement || document.activeElement === commentInputElement) {
      return;
    }
    if (document.querySelector('.error')) {
      return;
    }
    evt.preventDefault();
    onUploadCancelClick();
  }
}

const onFileInputChange = () => {
  const file = uploadInputElement.files[0];
  if (!file) {
    return;
  }

  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((ext) => fileName.endsWith(ext));

  if (matches) {
    const fileUrl = URL.createObjectURL(file);
    previewImage.src = fileUrl;

    effectsPreviews.forEach((preview) => {
      preview.style.backgroundImage = `url(${fileUrl})`;
    });

    openUploadForm();
  }
};

const onFormSubmit = (evt) => {
  evt.preventDefault();

  if (!pristine.validate()) {
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = 'Отправка...';

  sendData(
    new FormData(uploadFormElement),
    () => {
      onSuccessSendData();
      onUploadCancelClick();
      submitButton.disabled = false;
      submitButton.textContent = 'Опубликовать';
    },
    () => {
      onErrorSendData();
      submitButton.disabled = false;
      submitButton.textContent = 'Опубликовать';
    }
  );
};

uploadInputElement.addEventListener('change', onFileInputChange);
uploadCancelElement.addEventListener('click', onUploadCancelClick);
uploadFormElement.addEventListener('submit', onFormSubmit);

[hashtagsInputElement, commentInputElement].forEach((element) => {
  element.addEventListener('keydown', (evt) => {
    if (isEscapeKey(evt)) {
      evt.stopPropagation();
    }
  });
});

export { onErrorSendData };
