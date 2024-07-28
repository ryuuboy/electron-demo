const { BrowserWindow, app, ipcMain, Menu, MenuItem } = require('electron');
const { join } = require('path');
const { checkUpdate } = require("./autoUpdate");

const createWindow = () => {
  console.log(process.env.NODE_ENV);
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      nodeIntegration: true,
      // webSecurity: false
    }
  });

  const menu = Menu.getApplicationMenu();
  const menuItem = new MenuItem({
    label: "菜单",
    submenu: [
      {
        label: "增加",
        //主进程向渲染进程发送消息
        click: () => win.webContents.send('increment', 1),
      }
    ]
  });
  menu.append(menuItem);
  Menu.setApplicationMenu(menu);

  win.on("ready-to-show", () => {
    win.show();
  });

  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
    win.loadURL("http://localhost:9080");
  } else {
    win.webContents.openDevTools();
    win.loadFile("dist/index.html");
    // win.loadFile(join(__dirname, "../renderer/index.html"));
  }
  checkUpdate(win);
};

app.whenReady().then(() => {
  console.log(join(__dirname, '../preload/preload.js'));
  createWindow();
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });
  // 主进程监听
  ipcMain.on('setTitle', function(event, args) {
    console.log(event, args);
    //获取用于控制网页的webContents对象
    const webContents = event.sender;
    //获取窗口
    const win = BrowserWindow.fromWebContents(webContents);
    //设置窗口标题
    win.setTitle(args);
  });
  ipcMain.handle("sumNumbers", (event, num1, num2) => {
    return num1 + num2;
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})
