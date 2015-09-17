import Notifier from 'node-notifier';

export default class Notification {
  constructor (args) {
    const {title, message = title, icon} = args;

    this.context = Notifier.notify({
      title, message, icon,
    });
  }
}
