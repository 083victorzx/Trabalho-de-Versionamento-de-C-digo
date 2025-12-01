const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs-extra");
const Store = require("electron-store");
const FileType = require("file-type");

const store = new Store();
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile("index.html");

  // REMOVE COMPLETAMENTE A BARRA DE MENU DO SISTEMA
  mainWindow.setMenu(null);
}


app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// --------- IPC: Abrir arquivo ---------
ipcMain.handle("open-file", async () => {
  const lastDir = store.get("lastDir", undefined);

  const result = await dialog.showOpenDialog(mainWindow, {
    title: "Abrir arquivo de texto",
    defaultPath: lastDir,
    filters: [{ name: "Texto", extensions: ["txt"] }],
    properties: ["openFile"]
  });

  if (result.canceled || !result.filePaths.length) {
    return { canceled: true };
  }

  const filePath = result.filePaths[0];

  // Usa file-type só para mostrar que está sendo usado
  try {
    const ft = await FileType.fromFile(filePath);
    if (ft && !ft.mime.startsWith("text")) {
      return { canceled: true, error: "Arquivo não é de texto." };
    }
  } catch {
    // se der erro, ignora e segue
  }

  const content = await fs.readFile(filePath, "utf8");
  store.set("lastDir", path.dirname(filePath));

  return { canceled: false, filePath, content };
});

// --------- IPC: Salvar em caminho existente ---------
ipcMain.handle("save-file", async (_event, { filePath, content }) => {
  try {
    await fs.writeFile(filePath, content, "utf8");
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// --------- IPC: Salvar Como ---------
ipcMain.handle("save-file-as", async (_event, content) => {
  const lastDir = store.get("lastDir", undefined);

  const result = await dialog.showSaveDialog(mainWindow, {
    title: "Salvar como",
    defaultPath: lastDir ? path.join(lastDir, "novo.txt") : "novo.txt",
    filters: [{ name: "Texto", extensions: ["txt"] }]
  });

  if (result.canceled || !result.filePath) {
    return { canceled: true };
  }

  await fs.writeFile(result.filePath, content, "utf8");
  store.set("lastDir", path.dirname(result.filePath));

  return { canceled: false, filePath: result.filePath };
});

// --------- IPC: Sair ---------
ipcMain.on("quit-app", () => {
  app.quit();
});
