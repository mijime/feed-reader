import {
  APPEND_FEED,
  REMOVE_FEED,
  INIT_FEEDS,
  FEEDS_PATH,
} from '../constants';

import Storage from '../utils/storage';

export function appendFeed ({request, response}) {
  const {url} = request;
  const {meta} = response;
  const {title, xmlUrl, xmlurl, link, favicon} = meta;

  return {
    type: APPEND_FEED,
    feed: {
      title: title || xmlUrl || xmlurl,
      url: xmlUrl || xmlurl || url,
      link,
      favicon,
    },
  }
}

export function removeFeed (feed) {
  return {type: REMOVE_FEED, feed}
}

export function initFeeds (feeds) {
  return {type: INIT_FEEDS, feeds}
}

export function saveFeeds () {
  return (dispatch, getState) => {
    const {feeds} = getState();

    return Storage.setItem(FEEDS_PATH, feeds)
      .then((feeds) => ({type: INIT_FEEDS, feeds}))
      .then(dispatch);
  }
}

export function loadFeeds () {
  return (dispatch) => {
    return Storage.getItem(FEEDS_PATH)
      .then((feeds) => ({type: INIT_FEEDS, feeds}))
      .then(dispatch);
  }
}
