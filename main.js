const electron = require('electron'), path = require('path'), url = require('url'), storage = require('electron-json-storage'), scale = 2;
let mainWindow;
const app = electron.app, browserWindow = electron.BrowserWindow,
  winWidth = 240, winHeight = 320;

createWindow = function(){
  mainWindow = new browserWindow({
    width: winWidth * scale,
    height: winHeight * scale,
    minWidth: winWidth,
    minHeight: winHeight
  });
  mainWindow.setMenu(null);
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  mainWindow.webContents.openDevTools()
  mainWindow.on('closed', function(){
    mainWindow = null
  });
}

app.on('ready', createWindow);
app.on('window-all-closed', function(){
  if(process.platform != 'darwin') app.quit();
});
app.on('activate', function(){
  if(mainWindow == null) createWindow();
});