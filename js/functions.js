const isStringLongerThan = (string, maxLength) => string.length <= maxLength;

const isStringPalindrome = (string) => {
  let newString = string.replaceAll(' ', '').toUpperCase();
  let reversedString = newString.reverse();
  return newString === reversedString;
};

const extractNumber = (input) => {
  let result = '';

  input = String(input);

  for (let i = 0; i < input.length; i++) {
    if (!isNaN(parseInt(input[i], 10))) {
      result += input[i];
    }
  }

  return Number(result);
};

