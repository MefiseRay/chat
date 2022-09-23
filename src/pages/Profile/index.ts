import Block from '../../utils/Block';
import template from './profile.pug';
import {Profile} from '../../modules/Profile';

import * as centralAreaStyles from '../../layouts/CentralArea/centralArea.module.scss';
import logoutIcon from "../../../static/icon/logout.svg";
import beforeIcon from "../../../static/icon/before.svg";
import moreVertIcon from "../../../static/icon/more-vert.svg";

export class ProfilePage extends Block<{}> {

  constructor() {
    super({});
    this.element!.classList.add(centralAreaStyles.wrapper);
  }

  protected init() {
    this.children.profile = new Profile({
      renderStatus: 'show',
      logoutSvg: logoutIcon,
      backSvg: beforeIcon,
      menuSvg: moreVertIcon,
    });
    this.props.centralAreaStyles = centralAreaStyles;
  }

  protected render() {
    return this.compile(template, this.props);
  }
}
