import filter from 'lodash/collection/filter';
import find from 'lodash/collection/find';
import take from 'lodash/array/take';
import ipc from 'ipc';
import {
  APPEND_FEED,
  REMOVE_FEED,
  INIT_FEEDS,
  MAX_FEEDS,
  IPC_NOTIFICATION,
} from '../constants';

export default function feeds (state = [], action = {}) {
  const {type, feed = {}, feeds = []} = action;

  switch (type) {
  case APPEND_FEED:
    if (find(state, (f) => f.url === feed.url))
      return state;

    const {title} = feed;
    ipc.send(IPC_NOTIFICATION, title);

    return take([feed].concat(state), MAX_FEEDS);

  case REMOVE_FEED:
    return filter(state, (f) => f.url !== feed.url);

  case INIT_FEEDS:
    return feeds;

  default:
    return state;
  }
}
