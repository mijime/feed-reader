import Kefir from 'kefir';

export default function createScheduler (store, distance = 1) {
  // console.debug('createScheduler', store);

  return Kefir.interval(1000 * 60 * distance, store)
    .map((store) => store.getState())
    .map(({feeds}) => feeds)
    .flatten();
}
