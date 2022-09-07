import Block from "../../utils/Block";
import template from "./registration.pug";

import * as centralAreaStyles from "../../layouts/CentralArea/centralArea.module.scss";


import {Form} from "../../modules/Form";

interface RegistrationPageProps{
    form: Form,
    centralAreaStyles?: {}
}

export class RegistrationPage extends Block {

    constructor(props: RegistrationPageProps) {
        super('div', props);
        this.element!.classList.add(centralAreaStyles["wrapper"]);
    }

    protected init() {
        this.props.centralAreaStyles = centralAreaStyles;
    }

    render() {
        return this.compile(template, this.props);
    }
}