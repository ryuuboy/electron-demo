const { app, ipcMain, dialog, shell } = require("electron");
const { autoUpdater } = require("electron-updater");
const { join } = require("path");

const checkUpdate = (win) => {
  // start,这里是是为了在本地做应用升级测试使用，正式环境请务必删除
  // if (process.env.NODE_ENV === "development") {
  //   Object.defineProperty(app, "isPackaged", {
  //     get() {
  //       return true;
  //     }
  //   });
  //   autoUpdater.updateConfigPath = join(__dirname, "../../dev-app-update.yml");
  // }
  // end

  // 自动下载更新
  autoUpdater.autoDownload = false;
  // 退出时自动安装更新
  autoUpdater.autoInstallOnAppQuit = false;
  autoUpdater.disableWebInstaller = true;
  // 渲染进程触发检查更新
  ipcMain.on("check-for-update", () => {
    autoUpdater.checkForUpdates();
  });
  // 检查是否需要更新
  autoUpdater.on("checking-for-update", () => {
    console.log("正在检查更新...");
  });
  // 有新版本时
  autoUpdater.on("update-available", (releaseInfo) => {
    dialog.showMessageBox({
      type: "info",
      title: "应用有新的更新",
      message: "发现新版本，是否现在更新？",
      buttons: ["否", "是"]
    }).then(({ response }) => {
      if (response === 1) {
        autoUpdater.downloadUpdate();
      }
    });
  });
  // 检测到不需要更新时
  autoUpdater.on("update-not-available", () => {
    dialog.showMessageBox({
      type: "info",
      title: "更新提示",
      message: "你已经是最新的版本"
    });
  });
  // 更新下载进度
  autoUpdater.on("download-progress", (progress) => {
    win.webContents.send("downloadProgress", progress);
  });
  // 更新下载完毕
  autoUpdater.on("update-downloaded", () => {
    dialog.showMessageBox({
      title: "安装更新",
      message: "更新下载完毕，应用将重启并进行安装"
    }).then(() => {
      autoUpdater.quitAndInstall();
    })
  });
  // 更新发生错误
  autoUpdater.on("error", () => {
    dialog.showMessageBox({
      type: "warning",
      title: "更新提示",
      message: "软件更新失败",
      buttons: ["网站下载", "取消更新"],
      cancelId: 1
    }).then(({ response }) => {
      if (response === 0) {
        shell.openExternal("https://github.com/ryuuboy/electron-demo");
      }
    })
  })
};

module.exports = {
  checkUpdate
};


