import Moment from 'moment';
import {
  APPEND_ENTRY,
  APPEND_ENTRY_SYNC,
  REMOVE_ENTRIES,
} from '../constants';

export function appendEntry ({request, response}, isSync = false) {
  const {url} = request;
  const {
    title,
    description,
    link,
    pubDate, pubdate, date,
    meta,
  } = response;
  const {xmlUrl, xmlurl} = meta;

  return {
    type: isSync ? APPEND_ENTRY_SYNC : APPEND_ENTRY,
    entry: {
      title,
      description,
      link,
      updated: Moment(pubDate || pubdate || date).unix(),
      url: xmlUrl || xmlurl || url,
    },
  }
}

export function appendEntrySync (args) {
  return appendEntry(args, true);
}

export function removeEntries (feed) {
  return {type: REMOVE_ENTRIES, feed}
}
