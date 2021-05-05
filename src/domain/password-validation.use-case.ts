function hasDigit(value: string): boolean {
  return value?.search(/\d/) !== -1;
}

function hasLetter(value: string): boolean {
  return value?.search(/[a-zA-Z]/) !== -1;
}

function validLength(value: string): boolean {
  return value.length >= 7;
}

function validate(password: string): boolean {
  return hasDigit(password) && hasLetter(password) && validLength(password);
}

export const ValidatePasswordUseCase = {
  exec: validate,
};
