import m from 'mithril';
import App from './app';

class Root {
  controller (props) {
    // console.debug('controller', props);
    const {store} = props;
    const {dispatch, getState} = store;

    this.dispatch = dispatch;
    this.getState = getState;
  }

  view (controller, props) {
    // console.debug('view', controller);
    const {dispatch, getState} = controller;
    const {store} = props;

    return (<App store={store} dispatch={dispatch} {...getState()} />);
  }
}

const RootInstance = new Root;

export default RootInstance;
