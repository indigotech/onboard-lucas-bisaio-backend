function hasDigit(value: string): boolean {
  return value?.search(/\d/) !== -1;
}

function hasLetter(value: string): boolean {
  return value?.search(/[a-zA-Z]/) !== -1;
}

function length(value: string): boolean {
  return value.length >= 7;
}

export const validatePassword = {
  check: (password: string): boolean => {
    return hasDigit(password) && hasLetter(password) && length(password);
  },
};
