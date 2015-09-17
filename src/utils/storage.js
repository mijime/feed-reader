export default {
  getItem (path, done) {
    // console.debug('getItem', path);
    const promise = new Promise((resolve, reject) => {
      try {
        return resolve(JSON.parse(localStorage.getItem(path)));

      } catch (error) {
        return reject(error);
      }
    });

    if (done)
      return promise.then(done);
    return promise;
  },

  setItem (path, item, done) {
    // console.debug('setItem', path, item);
    const promise = new Promise((resolve, reject) => {
      try {
        const itemStr = JSON.stringify(item);
        localStorage.setItem(path, itemStr);
        return resolve(item);

      } catch (error) {
        return reject(error);
      }
    });

    if (done)
      return promise.then(done);
    return promise;
  },
}
