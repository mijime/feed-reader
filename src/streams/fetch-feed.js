import Kefir from 'kefir';
import FeedParser from 'feedparser';
import fetchURL from '../utils/url';

export default function createFetchFeed (request) {
  const stream = Kefir.fromCallback(fetchURL(request))
    .flatMap((response) => {
      const feedParser = new FeedParser();
      feedParser.write(response.target.response);
      return Kefir.fromEvents(feedParser, 'data');
    }).map((response) => ({request, response}));
  stream.log('createFetchFeed');
  return stream;
}
