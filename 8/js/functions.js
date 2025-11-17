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

const formatTime = (time) => {
  let result = time.split(':');
  const hours = parseInt(result[0], 10);
  const minutes = parseInt(result[1], 10);

  result = hours * 60 + minutes;

  return result;
};

const isMeetingIncluded = (workingDayStart, workingDayEnd, meetingStartTime, meetingDuration) => {
  const workStartMinutes = formatTime(workingDayStart);
  const workEndMinutes = formatTime(workingDayEnd);
  const meetingStartMinutes = formatTime(meetingStartTime);

  return meetingStartMinutes >= workStartMinutes &&
         meetingStartMinutes + meetingDuration <= workEndMinutes;
};

export {isStringLengthValid, isStringPalindrome, extractNumber, isMeetingIncluded, formatTime};

