const editor = document.getElementById("editor");
const statusBar = document.getElementById("status");
const fileNameLabel = document.getElementById("fileName");

const btnNew = document.getElementById("btnNew");
const btnOpen = document.getElementById("btnOpen");
const btnSave = document.getElementById("btnSave");
const btnSaveAs = document.getElementById("btnSaveAs");
const btnExit = document.getElementById("btnExit");

let currentFilePath = null;

function setStatus(text) {
  statusBar.textContent = text;
}

function updateFileName() {
  if (!currentFilePath) {
    fileNameLabel.textContent = "Nenhum arquivo aberto";
  } else {
    // mostra só o nome do arquivo
    const parts = currentFilePath.split(/[/\\]/);
    fileNameLabel.textContent = parts[parts.length - 1];
  }
}