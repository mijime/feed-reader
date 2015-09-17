import m from 'mithril';
import Anchor from '../components/anchor';

class EntryList {
  view (_, props) {
    const {entries} = props;

    const entryComponents = entries.map((entry) => (
          <li className='entry-item'>
            <Anchor className='pure-menu-link' href={entry.link}>
              {entry.title}
            </Anchor>
          </li>
          ));

    return (<ul className='pure-menu-list'>{entryComponents}</ul>);
  }
}

export default new EntryList;
