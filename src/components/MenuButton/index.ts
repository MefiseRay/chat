import Block from '../../utils/Block';
import template from './menuButton.pug';
import {Icon} from "../Icon";
import {DropdownMenu} from "../DropdownMenu";

import * as menuButtonStyles from "./menuButton.module.scss";

interface MenuButtonProps {
    icon: Icon,
    menu: DropdownMenu,
    horizontalShift: number,
    verticalShift: number,
    styles?: {}
}

export class MenuButton extends Block {
    constructor(props: MenuButtonProps) {
        super('div', props);
        this.element!.classList.add(menuButtonStyles["wrapper"]);
    }

    protected editPropsBeforeMakeThemProxy(props: MenuButtonProps) {
        props.styles = menuButtonStyles;
    }

    protected init() {
        const menu = this.children.menu as DropdownMenu;
        const icon = this.children.icon as Icon;
        icon.element!.addEventListener("click", (event: MouseEvent) => {
            document.body.append(menu.getContent()!);
            menu.dispatchComponentDidMount();
            const target = event.target as HTMLElement;
            const sourceElRect = target.getBoundingClientRect();
            const elRect = menu.element!.getBoundingClientRect();
            const horizontalShift = this.props.horizontalShift;
            const verticalShift = this.props.verticalShift;

            if(icon.element) {
                let top = sourceElRect.bottom + verticalShift;
                let left = sourceElRect.left + horizontalShift;

                if (top + elRect.height > document.documentElement.clientHeight) {
                    top = sourceElRect.top - elRect.height - verticalShift;
                }

                if(left + elRect.width > document.documentElement.clientWidth) {
                    left = sourceElRect.left - elRect.width - horizontalShift;
                }

                menu.element!.style.top = `${top}px`;
                menu.element!.style.left = `${left}px`;
            }
        });
        document.addEventListener('scroll', (event: Event) => {
            menu.element!.remove();
        });
        document.addEventListener('click', function(event: MouseEvent){
            if(event.target) {
                if(!menu.element!.contains(event.target as HTMLElement) && !icon.element!.contains(event.target as HTMLElement)) {
                    menu.element!.remove();
                }
            }
        });
    }

    public removeMenu() {
        const menu = this.children.menu as DropdownMenu;
        menu.element!.remove();
    }

    render() {
        return this.compile(template, this.props);
    }
}