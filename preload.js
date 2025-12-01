const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  openFile: () => ipcRenderer.invoke("open-file"),
  saveFile: (filePath, content) =>
    ipcRenderer.invoke("save-file", { filePath, content }),
  saveFileAs: (content) => ipcRenderer.invoke("save-file-as", content),
  quit: () => ipcRenderer.send("quit-app")
});
