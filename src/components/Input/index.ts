import Block from '../../utils/Block';
import template from './input.pug';
import * as inputStyles from './input.module.scss';
import { Icon } from '../Icon';
import { ValidationResult } from '../../utils/CustomValidation';
import refElementsCollection from '../../utils/RefElementsCollection';

export enum InputTypes {
  text = 'text',
  number = 'number',
  email = 'email',
  hidden = 'hidden',
  month = 'month',
  password = 'password',
  search = 'search',
  tel = 'tel',
  time = 'time',
  url = 'url',
  week = 'week',
  datetime = 'datetime',
  file = 'file'
}

interface InputProps {
  title: string,
  type: InputTypes,
  name: string,
  value: string,
  placeholder: string,
  isRounded: boolean,
  isLight: boolean,
  displayBlock: boolean,
  iconSrc: string | null,
  validation?: {
    required?: boolean,
    trim?: boolean,
    callback: (value: string, required?:boolean, trim?:boolean) => ValidationResult
  },
  styles?: Record<string, unknown>
}

export class Input extends Block<InputProps> {
  private _input: HTMLInputElement | undefined;

  private _message: Element | undefined;

  constructor(props: InputProps) {
    super(props);
        this.element!.classList.add(inputStyles.input);
        if (props.isRounded) {
            this.element!.classList.add(inputStyles.rounded);
            if (props.isLight) this.element!.classList.add(inputStyles.light);
        }
        if (props.displayBlock) {
            this.element!.classList.add(inputStyles.block);
        }
  }

  protected editPropsBeforeMakeThemProxy(props: InputProps) {
    props.styles = inputStyles;
  }

  protected init() {
    if (this.props.iconSrc != null) {
      this.children.icon = new Icon({
        size: '1em',
        icon: this.props.iconSrc,
      });
    }
  }

  protected render() {
    return this.compile(template, this.props);
  }

  protected afterRender() {
    this._addValidateEvents();
  }

  private _addValidateEvents() {
    if (this.props.validation) {
      this.getInput().addEventListener('focus', () => {
        this.element!.classList.remove(inputStyles.success);
        this.element!.classList.remove(inputStyles.error);
        this.getMessage().innerHTML = '';
      });
      this.getInput().addEventListener('blur', () => {
        this.checkValidate(true);
      });
    }
  }

  public checkValidate(noCheckEmpty = false): ValidationResult {
    const validationResult: ValidationResult = this.getValidationResult();
    this.getInput().value = validationResult.value;
    if (this.getInput().value === '' && (noCheckEmpty || !this.props.validation.required)) {
      return validationResult;
    }
    if (validationResult.result) {
      this.element!.classList.add(inputStyles.success);
      this.getMessage().innerHTML = '';
    } else {
      this.element!.classList.add(inputStyles.error);
      this.getMessage().innerHTML = validationResult.message ?? '';
    }
    return validationResult;
  }

  public getValidationResult():ValidationResult {
    if (!this.props.validation) {
      throw new Error('This input does not have a validator');
    }
    const { value } = this.getInput();
    const validationResult: ValidationResult = this.props.validation.callback(
      value,
      this.props.validation.required,
      this.props.validation.trim,
    );
    return validationResult;
  }

  public getInput(): HTMLInputElement {
    if (!this._input) {
      this._input = (refElementsCollection.getElement(this.id, 'input') as HTMLInputElement);
    }
    return this._input;
  }

  public getMessage(): Element {
    if (!this._message) {
      this._message = refElementsCollection.getElement(this.id, 'message');
    }
    return this._message;
  }

  public getValue() {
    const { value } = this.getInput();
    return value;
  }
}
