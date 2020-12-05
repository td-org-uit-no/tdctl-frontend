export const emailValidator = (email: string) => {
  if (email.length === 0) {
    return ['E-post er påkrevd'];
  }
  if (email.length < 2) {
    return ['E-posten er ikke gyldig'];
  }
};

export const passwordValidator = (password: string): string[] | undefined => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Passorder må være lengre en 8 karakterer');
  }

  return errors.length > 0 ? errors : undefined;
};
