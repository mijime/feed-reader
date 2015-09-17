import XMLHttpRequest from 'xhr2';

export default function fetchURL (request) {
  // console.debug('fetchURL', request);
  const {url, method = 'GET'} = request;

  function sendXHRequest (done, reject) {
    const xhr = new XMLHttpRequest;

    xhr.onload = done;
    xhr.onerror = (error) => reject(error);
    xhr.onabort = (error) => reject(error);

    xhr.open(method, url);
    xhr.send();
  }

  return function (done) {
    const p = new Promise(sendXHRequest);

    if (done)
      return p.then(done);

    return p;
  }
}
