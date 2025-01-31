const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("windowApi", {
  renderToMain: (title) => {
    console.log(title);
    ipcRenderer.send("setTitle", title);
  },
  mainToRender: (num) => {
    ipcRenderer.on("increment", num);
  },
  invokeHandle: (num1, num2) => {
    return ipcRenderer.invoke("sumNumbers", num1, num2);
  }
});

contextBridge.exposeInMainWorld("updateApi", {
  checkUpdate: () => {
    ipcRenderer.send("check-for-update");
  },
  showUpdateProgress: (progress) => {
    ipcRenderer.on("downloadProgress", progress);
  }
});
