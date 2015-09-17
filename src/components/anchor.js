import m from 'mithril';
import ipc from 'ipc';
import {IPC_OPEN_BROWSER} from '../constants';

class Anchor {
  controller () {
    this.handleClick = (e) => {
      e.preventDefault();
      ipc.send(IPC_OPEN_BROWSER, e.target.href);
    }
  }

  view (controller, props, children) {
    const {handleClick} = controller;

    return (<a {...props} onclick={handleClick}> {children} </a>);
  }
}

export default new Anchor;
