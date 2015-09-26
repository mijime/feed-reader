import app from 'app';
import menubar from 'menubar';
import BrowserWindow from 'browser-window';
import ipc from 'ipc';
import shell from 'shell';
import {IPC_OPEN_BROWSER, IPC_CLOSE_APP} from '../constants';

const index = `file://${__dirname}/../renderer/index.html`;
const mb = menubar({index});

mb.on('ready', () => {
  ipc.on(IPC_CLOSE_APP, () => app.quit());
  ipc.on(IPC_OPEN_BROWSER, function (_, url) {
    return shell.openExternal(url);
  });
});
