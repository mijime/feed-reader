import app from 'app';
import BrowserWindow from 'browser-window';
import ipc from 'ipc';
import shell from 'shell';
import {IPC_OPEN_BROWSER} from '../constants';

app.on('window-all-closed', () => app.quit());

app.on('ready', () => {
  const browser = new BrowserWindow({width: 800, height: 600});
  browser.loadUrl(`file://${__dirname}/../renderer/index.html`);

  ipc.on(IPC_OPEN_BROWSER, function (_, url) {
    return shell.openExternal(url);
  });
});

console.log('app');
