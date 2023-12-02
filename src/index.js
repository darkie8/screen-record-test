const { app, BrowserWindow } = require('electron');
const path = require('path');
// const UrlBuffer = remote.require('url-buffer')
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}
let mainWindow = null;
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    center: true,
    alwaysOnTop: true,
    transparent: true,
    fullscreenable: true,
    maximizable: true,
    backgroundColor: ' #ffffff00',
    webPreferences:{
      nodeIntegration:true,
      enableRemoteModule: true
    }
  });
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
// Listen to custom protocole incoming messages
// app.on('open-url', function (ev, url) {
  // ev.preventDefault();
  // UrlBuffer.push(url);
// });


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// app.whenReady().then(() => {
//   protocol.registerFileProtocol('srcustom', (request, callback) => {
//     const url = request.url.substr(7);
//     protocol.registerStandardSchemes([url_scheme])
//     callback({ path: path.normalize(`${__dirname}/${url}`) })
//   })
// })

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) {mainWindow.restore()}
      mainWindow.focus()
    }
  })
}