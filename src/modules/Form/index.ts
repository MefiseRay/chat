import {nanoid} from 'nanoid';
import Block from '../../utils/Block';
import template from './form.pug';
import * as formStyles from './form.module.scss';
import {Button} from '../../components/Button';
import {Input} from '../../components/Input';
import {ValidationResult} from '../../utils/CustomValidation';

interface FormProps {
  action: string,
  method: string,
  title: string,
  inputs: Input[],
  buttons: Button[],
  styles?: Record<string, unknown>,
  formId?: string,
}

export class Form<FD extends Record<string, any>> extends Block<FormProps> {
  constructor(props: FormProps) {
    super(props);
    this.element!.classList.add(formStyles.form);
  }

  protected editPropsBeforeMakeThemProxy(props: FormProps) {
    props.styles = formStyles;
    props.formId = nanoid(10);
  }

  protected render() {
    return this.compile(template, this.props);
  }

  public checkValidate(): {
    validate: boolean,
    validationResultList: Record<string, ValidationResult>,
    formData: FD
  } {
    return this._validation(false);
  }

  public getValidationResult(): {
    validate: boolean,
    validationResultList: Record<string, ValidationResult>,
    formData: FD
  } {
    return this._validation(true);
  }

  private _validation(onlyResult: boolean): {
    validate: boolean,
    validationResultList: Record<string, ValidationResult>,
    formData: FD
  } {
    let validate = true;
    const validationResultList: Record<string, ValidationResult> = {};
    const data: Record<string, unknown> = {};
    (this.children.inputs as Input[]).forEach((input: Input) => {
      const validationResult: ValidationResult = onlyResult
        ? input.getValidationResult() : input.checkValidate();
      validationResultList[input.getPropValue('name')] = validationResult;
      data[input.getPropValue('name')] = validationResult.value;
      if (!validationResult.result) {
        validate = false;
      }
    });
    const formData: FD = data as FD;
    return {validate, validationResultList, formData};
  }

  public getFormData(): FormData | null {
    const form = document.getElementById(this.props.formId);
    if (form) {
      return new FormData(form as HTMLFormElement);
    }
    return null;
  }
}
