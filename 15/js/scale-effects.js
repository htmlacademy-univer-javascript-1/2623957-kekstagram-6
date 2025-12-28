const scaleValueElement = document.querySelector('.scale__control--value');
const scaleSmallerElement = document.querySelector('.scale__control--smaller');
const scaleBiggerElement = document.querySelector('.scale__control--bigger');
const imagePreviewElement = document.querySelector('.img-upload__preview img');

const effectsListElement = document.querySelector('.effects__list');
const effectLevelContainerElement = document.querySelector('.img-upload__effect-level');
const effectLevelSliderElement = document.querySelector('.effect-level__slider');
const effectLevelValueElement = document.querySelector('.effect-level__value');

const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_DEFAULT = 100;

const EFFECTS = {
  none: {
    range: { min: 0, max: 100 },
    start: 100,
    step: 1,
    filter: () => '',
  },
  chrome: {
    range: { min: 0, max: 1 },
    start: 1,
    step: 0.1,
    filter: (value) => `grayscale(${value})`,
  },
  sepia: {
    range: { min: 0, max: 1 },
    start: 1,
    step: 0.1,
    filter: (value) => `sepia(${value})`,
  },
  marvin: {
    range: { min: 0, max: 100 },
    start: 100,
    step: 1,
    filter: (value) => `invert(${value}%)`,
  },
  phobos: {
    range: { min: 0, max: 3 },
    start: 3,
    step: 0.1,
    filter: (value) => `blur(${value}px)`,
  },
  heat: {
    range: { min: 1, max: 3 },
    start: 3,
    step: 0.1,
    filter: (value) => `brightness(${value})`,
  },
};

let currentEffect = 'none';

const updateScaleValue = (value) => {
  scaleValueElement.value = `${value}%`;
  imagePreviewElement.style.transform = `scale(${value / 100})`;
};

const onScaleSmallerClick = () => {
  const currentValue = parseInt(scaleValueElement.value, 10);
  const newValue = Math.max(currentValue - SCALE_STEP, SCALE_MIN);
  updateScaleValue(newValue);
};

const onScaleBiggerClick = () => {
  const currentValue = parseInt(scaleValueElement.value, 10);
  const newValue = Math.min(currentValue + SCALE_STEP, SCALE_MAX);
  updateScaleValue(newValue);
};

const onScaleInputChange = () => {
  let value = parseInt(scaleValueElement.value, 10);
  if (Number.isNaN(value)) {
    value = SCALE_DEFAULT;
  }
  value = Math.min(SCALE_MAX, Math.max(SCALE_MIN, value));
  updateScaleValue(value);
};

const initEffectSlider = () => {
  if (!effectLevelSliderElement) {
    return;
  }

  if (!effectLevelSliderElement.noUiSlider) {
    noUiSlider.create(effectLevelSliderElement, {
      range: EFFECTS.none.range,
      start: EFFECTS.none.start,
      step: EFFECTS.none.step,
      connect: 'lower',
      format: {
        to: (value) => Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1),
        from: (value) => parseFloat(value),
      },
    });
  }

  effectLevelSliderElement.noUiSlider.on('update', () => {
    const value = effectLevelSliderElement.noUiSlider.get();
    effectLevelValueElement.value = value;

    if (currentEffect === 'none') {
      imagePreviewElement.style.filter = '';
    } else {
      imagePreviewElement.style.filter = EFFECTS[currentEffect].filter(value);
    }
  });
};

const updateEffectSlider = () => {
  const effectConfig = EFFECTS[currentEffect];

  if (currentEffect === 'none') {
    effectLevelContainerElement.classList.add('hidden');
    imagePreviewElement.style.filter = '';
  } else {
    effectLevelContainerElement.classList.remove('hidden');
  }

  effectLevelSliderElement.noUiSlider.updateOptions({
    range: effectConfig.range,
    step: effectConfig.step,
    start: effectConfig.start,
  });
};

const onEffectChange = (evt) => {
  if (!evt.target.classList.contains('effects__radio')) {
    return;
  }

  currentEffect = evt.target.value;

  imagePreviewElement.className = '';
  if (currentEffect !== 'none') {
    imagePreviewElement.classList.add(`effects__preview--${currentEffect}`);
  }

  updateEffectSlider();
};

const resetScaleAndEffects = () => {
  currentEffect = 'none';
  updateScaleValue(SCALE_DEFAULT);

  const noneEffectRadioElement = document.querySelector('#effect-none');
  if (noneEffectRadioElement) {
    noneEffectRadioElement.checked = true;
  }

  imagePreviewElement.className = '';

  updateEffectSlider();
};

const initScaleAndEffects = () => {
  updateScaleValue(SCALE_DEFAULT);

  scaleSmallerElement.addEventListener('click', onScaleSmallerClick);
  scaleBiggerElement.addEventListener('click', onScaleBiggerClick);
  scaleValueElement.addEventListener('change', onScaleInputChange);

  initEffectSlider();
  effectLevelContainerElement.classList.add('hidden');
  effectsListElement.addEventListener('change', onEffectChange);
};

export { initScaleAndEffects, resetScaleAndEffects };
