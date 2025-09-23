const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const NAMES = [
  'Артём',
  'Иван',
  'Илья',
  'Вера',
  'Алина',
  'Карина'
];

const PHOTO_DESCRIPTION_COUNT = 25;


const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const createRandomIdFromRangeGenerator = (min, max) => {
  const previousValues = [];

  return function () {
    let currentValue = getRandomInteger(min, max);
    if (previousValues.length >= (max - min + 1)) {
      return null;
    }
    while (previousValues.includes(currentValue)) {
      currentValue = getRandomInteger(min, max);
    }
    previousValues.push(currentValue);
    return currentValue;
  };
};

const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

const generatePhotoId = createRandomIdFromRangeGenerator(1, PHOTO_DESCRIPTION_COUNT);
const generateUrlId = createRandomIdFromRangeGenerator(1, PHOTO_DESCRIPTION_COUNT);
const generateAvatarId = () => getRandomInteger(1, 6);
const generateCommentId = createRandomIdFromRangeGenerator(1, 5000);


const createMessage = () => {
  const messages = Array.from({length: getRandomInteger(1, 2)}, () => getRandomArrayElement(MESSAGES));
  return messages.join(' ');
};

const createComment = () => ({
  id: generateCommentId(),
  avatar: `img/avatar-${generateAvatarId()}.svg`,
  message: createMessage(),
  name: getRandomArrayElement(NAMES)
});

const createComments = () => Array.from({ length: getRandomInteger(0, 30) }, createComment);

const createPhotoDescription = () => ({
  id: generatePhotoId(),
  url: `photos/${generateUrlId()}.jpg`,
  description: 'Это очень красиво и это мне нравится!',
  likes: getRandomInteger(15, 200),
  comments: createComments()
});

const photoDescriptions = Array.from({length: PHOTO_DESCRIPTION_COUNT}, createPhotoDescription);
