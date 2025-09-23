const isStringLengthValid  = (string, maxLength) => string.length <= maxLength;

const isStringPalindrome = (string) => {
  const newString = string.replaceAll(' ', '').toUpperCase();
  let reverseString = '';
  for (let i = newString.length - 1; i >= 0; i--) {
    reverseString += newString[i];
  }
  return newString === reverseString;
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

