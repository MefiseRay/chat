import Block from '../../utils/Block';
import template from './profile.pug';
import { Profile } from '../../modules/Profile';

import * as centralAreaStyles from '../../layouts/CentralArea/centralArea.module.scss';

interface ProfilePageProps {
    profile: Profile,
    centralAreaStyles?: Record<string, unknown>
}

export class ProfilePage extends Block {
  constructor(props: ProfilePageProps) {
    super('div', props);
        this.element!.classList.add(centralAreaStyles.wrapper);
  }

  protected init() {
    this.props.centralAreaStyles = centralAreaStyles;
  }

  render() {
    return this.compile(template, this.props);
  }
}
