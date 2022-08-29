import Block from '../../utils/Block';
import template from './home.pug';

interface HomePageProps {
    title: string;
}

export class HomePage extends Block {
    constructor(props: HomePageProps) {
        super('div', props);
    }

    init() {
        // this.children.button = new Button({
        //     label: 'Click me',
        //     events: {
        //         click: () => console.log('clicked'),
        //     },
        // });
    }

    render() {
        return this.compile(template, this.props);
    }
}