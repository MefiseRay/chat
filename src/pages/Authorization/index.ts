import Block from "../../utils/Block";
import template from "./authorization.pug";

import * as centralAreaStyles from "../../layouts/CentralArea/centralArea.module.scss";

import {Form} from "../../modules/Form";

interface AuthorizationPageProps {
    form: Form,
    centralAreaStyles?: {}
}

export class AuthorizationPage extends Block {

    constructor(props: AuthorizationPageProps) {
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