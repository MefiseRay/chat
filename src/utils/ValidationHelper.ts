import customValidation, { ValidationResult } from './CustomValidation';

class ValidationHelper {
  protected static regExpValidation(
    value: string,
    regExp: RegExp,
    errorMessage: string,
  ):ValidationResult {
    const result = regExp.test(value);
    const validationResult:ValidationResult = { result, value };
    if (!result) {
      validationResult.message = errorMessage;
    }
    return validationResult;
  }

  public static loginValidation(
    login: string,
    required = true,
    trim = true,
  ):ValidationResult {
    const regExp = /(?=.*[A-Za-z])[0-9a-zA-Z-_]{3,20}$/;
    const errorMessage: string = 'Логин должен обязательно состоять из латинских букв.<br>'
      + 'Логин может содержать в себе цифры, деффис и символ нижнего подчеркивания.<br>'
      + 'Длина Логина должна быть от 2 до 20 символов.<br>';
    return customValidation(login, {
      required,
      trim,
      validate: (value):ValidationResult => ValidationHelper
        .regExpValidation(value, regExp, errorMessage),
    });
  }

  public static passwordValidation(
    password: string,
    required = true,
    trim = true,
  ):ValidationResult {
    const regExp = /(?=.*[0-9])(?=.*[A-Z])[0-9a-zA-Z-_!@#$%^&*]{8,40}$/;
    const errorMessage: string = 'Пароль должен состоять из латинских букв '
      + 'спец символов и цифрт.<br>'
      + 'В пароле обязательно должна быть хотя бы одна заглавная буква.<br>'
      + 'В пароле обязательно должно быть хотя бы одно число.<br>'
      + 'Длина пароль должна быть от 8 до 40 символов.';
    return customValidation(password, {
      required,
      trim,
      validate: (value):ValidationResult => ValidationHelper
        .regExpValidation(value, regExp, errorMessage),
    });
  }

  public static nameValidation(
    name: string,
    required = true,
    trim = true,
  ):ValidationResult {
    const regExp = /^([A-ZА-Я])[a-zа-я]+$/;
    const errorMessage = 'Имя должно начинаться с заглавной буквы и состоять из букв';
    return customValidation(name, {
      required,
      trim,
      validate: (value):ValidationResult => ValidationHelper
        .regExpValidation(value, regExp, errorMessage),
    });
  }

  public static secondNameValidation(
    secondName: string,
    required = true,
    trim = true,
  ):ValidationResult {
    const regExp = /^([A-ZА-Я])[a-zа-я]+$/;
    const errorMessage = 'фамилия должна начинаться с заглавной буквы и состоять из букв';
    return customValidation(secondName, {
      required,
      trim,
      validate: (value):ValidationResult => ValidationHelper
        .regExpValidation(value, regExp, errorMessage),
    });
  }

  public static phoneValidation(
    phone: string,
    required = true,
    trim = true,
  ):ValidationResult {
    const regExp = /^(?:^\+|\d){10,15}$/;
    const errorMessage: string = 'Номер телефона должен состоять только '
      + 'из цифр и может начинаться с символа +';
    return customValidation(phone, {
      required,
      trim,
      validate: (value):ValidationResult => ValidationHelper
        .regExpValidation(value, regExp, errorMessage),
    });
  }

  public static emailValidation(
    email: string,
    required = true,
    trim = true,
  ):ValidationResult {
    const regExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]+\.+[a-zA-Z0-9]+$/;
    const errorMessage = 'Введеный почтовый ящик не соответствует стандарту';
    return customValidation(email, {
      required,
      trim,
      validate: (value:string):ValidationResult => ValidationHelper
        .regExpValidation(value, regExp, errorMessage),
    });
  }
}

export default ValidationHelper;
