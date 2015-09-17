import filter from 'lodash/collection/filter';
import find from 'lodash/collection/find';
import take from 'lodash/array/take';
import Notify from '../utils/notification';
import {
  APPEND_ENTRY,
  APPEND_ENTRY_SYNC,
  REMOVE_ENTRIES,
  MAX_ENTRIES,
} from '../constants';

function insertSort (fn) {
  return function insert (x, xs) {
    if (xs.length <= 0)
      return [x];

    const y = xs.shift();

    if (fn(x, y))
      return [x].concat([y].concat(xs));

    return [y].concat(insert(x, xs));
  }
}

const sort = insertSort(function (x, y) {
  return x.updated > y.updated;
});

export default function entries (state=[], action={}) {
  const {type, entry, feed} = action;

  switch (type) {
  case APPEND_ENTRY_SYNC:
    if (find(state, (e) => e.link === entry.link))
      return state;

    return take(sort(entry, state), MAX_ENTRIES);

  case APPEND_ENTRY:
    if (find(state, (e) => e.link === entry.link))
      return state;

    const {title} = entry;
    new Notify(title);

    return take([entry].concat(state), MAX_ENTRIES);

  case REMOVE_ENTRIES:
    return filter(state, (e) => e.url !== feed.url);

  default:
    return state;
  }
}
