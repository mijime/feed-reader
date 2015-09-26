import m from 'mithril';
import ipc from 'ipc';
import createFetchFeed from '../streams/fetch-feed';
import {IPC_CLOSE_APP} from '../constants';

class FeedForm {
  controller (props) {
    const {actions} = props;
    const {appendFeed, appendEntry, appendEntrySync, saveFeeds} = actions;

    const appendEntryFromStream = (stream) => {
      return stream.map(appendEntry)
        .onValue(() => m.redraw())
        .log('feedStream:appendEntry');
    }

    const appendEntrySyncFromStream = (stream) => {
      return stream.map(appendEntrySync)
        .onValue(() => m.redraw())
        .log('feedStream:appendEntrySync');
    }

    const appendFeedFromStream = (stream) => {
      return stream.take(1)
        .map(appendFeed)
        .onValue(() => saveFeeds())
        .onValue(() => m.redraw())
        .onValue(() => this.inputURL(''))
        .log('feedStream:appendFeed');
    }

    this.inputURL = m.prop('');

    this.handleFeedButton = (feeds) => (e) => {
      e.preventDefault();

      const url = this.inputURL();

      if (!url)
        return feeds.map(createFetchFeed)
          .map(appendEntryFromStream);

      const feed = {url}
      const fetchFeedStream = createFetchFeed(feed);

      appendFeedFromStream(fetchFeedStream);
      appendEntrySyncFromStream(fetchFeedStream);
    }
  }

  view (controller, props) {
    const {inputURL, handleFeedButton} = controller;
    const {feeds} = props;

    const close = () => ipc.send(IPC_CLOSE_APP);

    return (
        <form className='feed-form' onsubmit={handleFeedButton(feeds)}>
          <button className='pure-button' onclick={close}>
            <i class="fa fa-close"></i>
          </button>
          <button className='pure-button'>
            <i class="fa fa-rss"></i>
          </button>
          <input type='text' value={inputURL()}
            onchange={m.withAttr('value', inputURL)}
            placeholder='URL' />
        </form>
        );
  }
}

export default new FeedForm;
