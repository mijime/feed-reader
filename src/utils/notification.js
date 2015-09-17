import notifier from 'node-notifier';
import os from 'os';

export default class Notify {
  constructor (title, args) {

    if (os.type().toString().match('Windows') !== null) {
      const {message = title, icon} = args;
      this.context = notifier.notify({
        title, message, icon,
      });
    } else {
      this.context = new Notification(title, args);
    }
  }
}
