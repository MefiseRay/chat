import Block from '../../utils/Block';
import template from './form.pug';
import * as formStyles from './form.module.scss';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { ValidationResult } from '../../utils/CustomValidation';

interface FormProps {
    action: string,
    method: string,
    title: string,
    inputs: Input[],
    buttons: Button[],
    styles?: Record<string, unknown>
}

export class Form extends Block {
  constructor(props: FormProps) {
    super(props);
        this.element!.classList.add(formStyles.form);
  }

  protected editPropsBeforeMakeThemProxy(props: FormProps) {
    props.styles = formStyles;
  }

  protected render() {
    return this.compile(template, this.props);
  }

  public checkValidate():{
    validate: boolean,
    validationResultList: Record<string, ValidationResult>,
    formData: Record<string, string>
    } {
    return this._validation(false);
  }

  public getValidationResult():{
    validate: boolean,
    validationResultList: Record<string, ValidationResult>,
    formData: Record<string, string>
    } {
    return this._validation(true);
  }

  private _validation(onlyResult: boolean):{
    validate: boolean,
    validationResultList: Record<string, ValidationResult>,
    formData: Record<string, string>
  } {
    let validate = true;
    const validationResultList: Record<string, ValidationResult> = {};
    const formData: Record<string, string> = {};
    (this.children.inputs as Input[]).forEach((input:Input) => {
      const validationResult: ValidationResult = onlyResult
        ? input.getValidationResult() : input.checkValidate();
      validationResultList[input.getPropValue('name')] = validationResult;
      formData[input.getPropValue('name')] = validationResult.value;
      if (!validationResult.result) {
        validate = false;
      }
    });
    return { validate, validationResultList, formData };
  }
}
