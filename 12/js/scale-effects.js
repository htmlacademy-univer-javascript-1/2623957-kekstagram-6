const scaleValueElement = document.querySelector('.scale__control--value');
const scaleSmallerElement = document.querySelector('.scale__control--smaller');
const scaleBiggerElement = document.querySelector('.scale__control--bigger');
const imagePreviewElement = document.querySelector('.img-upload__preview img');

const effectsListElement = document.querySelector('.effects__list');
const effectLevelContainerElement = document.querySelector('.img-upload__effect-level');
const effectLevelSliderElement = document.querySelector('.effect-level__slider');
const effectLevelValueElement = document.querySelector('.effect-level__value');
const imagePreviewContainerElement = document.querySelector('.img-upload__preview');

const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_DEFAULT = 100;

const EFFECTS = {
  none: {
    min: 0,
    max: 100,
    step: 1,
    unit: '',
    filter: 'none',
  },
  chrome: {
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
    filter: 'grayscale',
  },
  sepia: {
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
    filter: 'sepia',
  },
  marvin: {
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
    filter: 'invert',
  },
  phobos: {
    min: 0,
    max: 3,
    step: 0.1,
    unit: 'px',
    filter: 'blur',
  },
  heat: {
    min: 1,
    max: 3,
    step: 0.1,
    unit: '',
    filter: 'brightness',
  },
};

let currentEffect = 'none';

const updateScaleValue = (value) => {
  scaleValueElement.value = `${value}%`;
  imagePreviewElement.style.transform = `scale(${value / 100})`;

  const hiddenInput = document.querySelector('input[name="scale"]');
  if (hiddenInput) {
    hiddenInput.value = `${value}%`;
  }
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

const initEffectSlider = () => {
  if (typeof noUiSlider === 'undefined' || !effectLevelSliderElement) {
    return;
  }

  if (effectLevelSliderElement.noUiSlider) {
    return;
  }

  noUiSlider.create(effectLevelSliderElement, {
    range: {
      min: EFFECTS[currentEffect].min,
      max: EFFECTS[currentEffect].max,
    },
    start: EFFECTS[currentEffect].max,
    step: EFFECTS[currentEffect].step,
    connect: 'lower',
    format: {
      to: (value) => {
        if (Number.isInteger(value)) {
          return value.toFixed(0);
        }
        return value.toFixed(1);
      },
      from: (value) => parseFloat(value),
    },
  });

  effectLevelSliderElement.noUiSlider.on('update', () => {
    const sliderValue = effectLevelSliderElement.noUiSlider.get();
    effectLevelValueElement.value = sliderValue;

    if (currentEffect === 'none') {
      imagePreviewElement.style.filter = 'none';
      return;
    }

    const effect = EFFECTS[currentEffect];
    imagePreviewElement.style.filter = `${effect.filter}(${sliderValue}${effect.unit})`;
  });
};

const updateEffectSlider = () => {
  if (currentEffect === 'none') {
    effectLevelContainerElement.classList.add('hidden');
    imagePreviewElement.style.filter = 'none';
    return;
  }

  effectLevelContainerElement.classList.remove('hidden');

  if (effectLevelSliderElement.noUiSlider) {
    effectLevelSliderElement.noUiSlider.updateOptions({
      range: {
        min: EFFECTS[currentEffect].min,
        max: EFFECTS[currentEffect].max,
      },
      start: EFFECTS[currentEffect].max,
      step: EFFECTS[currentEffect].step,
    });
  }
};

const onEffectChange = (evt) => {
  if (!evt.target.classList.contains('effects__radio')) {
    return;
  }

  currentEffect = evt.target.value;
  updateEffectSlider();

  imagePreviewContainerElement.className = 'img-upload__preview';
  if (currentEffect !== 'none') {
    imagePreviewContainerElement.classList.add(`effects__preview--${currentEffect}`);
  }
};

const resetScaleAndEffects = () => {
  updateScaleValue(SCALE_DEFAULT);
  currentEffect = 'none';

  const noneEffectRadioElement = document.querySelector('#effect-none');
  if (noneEffectRadioElement) {
    noneEffectRadioElement.checked = true;
  }

  if (effectLevelSliderElement && effectLevelSliderElement.noUiSlider) {
    effectLevelSliderElement.noUiSlider.destroy();
  }

  imagePreviewElement.style.filter = 'none';
  imagePreviewContainerElement.className = 'img-upload__preview';
  effectLevelContainerElement.classList.add('hidden');

  initEffectSlider();
};

const initScaleAndEffects = () => {
  updateScaleValue(SCALE_DEFAULT);
  scaleSmallerElement.addEventListener('click', onScaleSmallerClick);
  scaleBiggerElement.addEventListener('click', onScaleBiggerClick);

  initEffectSlider();
  effectLevelContainerElement.classList.add('hidden');
  effectsListElement.addEventListener('change', onEffectChange);
};

export { initScaleAndEffects, resetScaleAndEffects };
