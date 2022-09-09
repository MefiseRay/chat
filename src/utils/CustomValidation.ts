export interface ValidationResult {
    result: boolean,
    value: string,
    message?: string
}

export interface ValidationRule {
    required: boolean,
    trim: boolean,
    validate?: (value: string) => ValidationResult,
    preprocess?: (value: string) => string,
    postprocess?: (value: string) => string,
}

const customValidation = (
  value: string,
  validationRule: ValidationRule,
  withoutValueMessage?: string,
) => {
  let result: ValidationResult;
  if (validationRule.trim) {
    value = value.trim();
  }
  if (validationRule.preprocess) {
    value = validationRule.preprocess(value);
  }
  if (validationRule.required && value === '') {
    const message = withoutValueMessage ?? 'There is no value in the required field';
    result = {
      result: false,
      value,
      message,
    };
  }
  console.log([
    validationRule.validate,
    value !== '',
    !validationRule.required,
  ]);
  if (validationRule.validate && (value !== '' || validationRule.required)) {
    result = validationRule.validate(value);
  } else {
    result = {
      result: true,
      value,
    };
  }
  if (validationRule.postprocess) {
    value = validationRule.postprocess(value);
  }
  result.value = value;
  return result;
};

export default customValidation;
