import './index.css';
import m from 'mithril';
import {applyMiddleware, createStore, combineReducers} from 'redux';
import ThunkMiddleware from 'redux-thunk';
// import createLogger from 'redux-logger';
import * as ud from 'ud';

import feeds from '../reducers/feeds';
import entries from '../reducers/entries';
import Root from '../containers/root';

const middleware = applyMiddleware(ThunkMiddleware);
const reducers = {
  feeds: ud.defn(module, feeds, 'reducers/feeds'),
  entries: ud.defn(module, entries, 'reducers/entries'),
}
const combinedReducers = combineReducers(reducers);
const store = ud.defonce(module,
    () => middleware(createStore)(combinedReducers));

ud.defn(module,
    () => m.mount(document.body, (<Root store={store} />)))();
