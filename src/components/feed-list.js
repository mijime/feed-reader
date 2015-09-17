import m from 'mithril';
import Anchor from '../components/anchor';

class FeedList {
  controller (props) {
    const {actions} = props;
    const {removeEntries, removeFeed, saveFeeds} = actions;

    this.handleRemoveFeed = (feed) => (e) => {
      e.preventDefault();

      removeEntries(feed);
      removeFeed(feed);
      saveFeeds();
    }
  }
  view (controller, props) {
    const {handleRemoveFeed} = controller;
    const {feeds} = props;

    const feedComponents = feeds.map((feed) => (
          <li className='feed-item'>
            <Anchor className='pure-menu-link' href={feed.link}>
              {feed.favicon?(<img src={feed.favicon} />):null}
              {feed.title}
              <span className='button-group'>
                <i className='fa fa-times' onclick={handleRemoveFeed(feed)} />
              </span>
            </Anchor>
          </li>
          ));

    return (<ul className='pure-menu-list'>{feedComponents}</ul>);
  }
}

const FeedListInstance = new FeedList;

export default FeedListInstance;
