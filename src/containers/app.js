import m from 'mithril';
import {bindActionCreators} from 'redux';
import * as FeedAction from '../actions/feed';
import * as EntryAction from '../actions/entry';
import createScheduler from '../streams/scheduler';
import createFetchFeed from '../streams/fetch-feed'
import Storage from '../utils/storage';
import {FEEDS_PATH} from '../constants';
import Anchor from '../components/anchor';
import EntryList from '../components/entry-list';
import FeedList from '../components/feed-list';
import FeedForm from '../components/feed-form';

const Actions = {...FeedAction, ...EntryAction}

class App {
  controller (props) {
    // console.debug('controller', props);
    const {store, dispatch} = props;
    const actions = bindActionCreators(Actions, dispatch);

    this.actions = actions;

    const schedulerStream = createScheduler(store, 15);

    schedulerStream
      .flatMap((feed) => createFetchFeed(feed))
      .map(actions.appendEntry)
      .onValue(() => m.redraw())
      .log('schedulerStream:appendEntry');

    const fetchFeedStorage = Storage.getItem(FEEDS_PATH);

    fetchFeedStorage
      .then((feeds) => actions.initFeeds(feeds || []))
      .then(() => m.redraw());

    fetchFeedStorage
      .then((feeds) => (feeds || [])
        .map((feed) => createFetchFeed(feed)
          .map(actions.appendEntrySync)
          .onValue(() => m.redraw())
          .log('schedulerStream:appendEntry')));
  }

  view (controller, props) {
    // console.debug('view', controller, props);
    const {actions} = controller;
    const {entries = [], feeds = []} = props;

    return (
        <div className='pure-menu'>
          <FeedList actions={actions} feeds={feeds} />
          <FeedForm actions={actions} feeds={feeds} />
          <EntryList entries={entries} />
        </div>
        );
  }
}

const AppInstance = new App;

export default AppInstance;
