import Notifier from 'node-notifier';
import os from 'os';

export default class Notify {
  constructor (title, args) {
    if (os.type().toString().match('Windows') !== null)
      this.context = Notifier.notify({
        title, message: title, ...args,
      });
    else
      this.context = new Notification(title);
  }
}
