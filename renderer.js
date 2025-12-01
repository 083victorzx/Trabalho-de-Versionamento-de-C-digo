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

// ---------- BOTÃO: NOVO ----------
btnNew.onclick = () => {
  currentFilePath = null;
  editor.value = "";
  updateFileName();
  setStatus("Novo arquivo");
};

// ---------- BOTÃO: ABRIR ----------
btnOpen.onclick = async () => {
  const result = await window.api.openFile();
  if (!result || result.canceled) {
    setStatus("Abertura cancelada");
    return;
  }

  currentFilePath = result.filePath;
  editor.value = result.content;
  updateFileName();
  setStatus("Arquivo aberto");
};

// ---------- BOTÃO: SALVAR ----------
btnSave.onclick = async () => {
  if (!currentFilePath) {
    // se ainda não tem caminho, chama Salvar Como
    await handleSaveAs();
    return;
  }

  const res = await window.api.saveFile(currentFilePath, editor.value);
  if (res && res.success) {
    setStatus("Arquivo salvo");
  } else {
    setStatus("Erro ao salvar");
  }
};

// ---------- Função auxiliar: SALVAR COMO ----------
async function handleSaveAs() {
  const res = await window.api.saveFileAs(editor.value);
  if (!res || res.canceled) {
    setStatus("Salvar como cancelado");
    return;
  }

  currentFilePath = res.filePath;
  updateFileName();
  setStatus("Arquivo salvo como");
}

// ---------- BOTÃO: SALVAR COMO ----------
btnSaveAs.onclick = async () => {
  await handleSaveAs();
};

// ---------- BOTÃO: SAIR ----------
btnExit.onclick = () => {
  window.api.quit();
};

// inicializa o texto da barra
updateFileName();
setStatus("Pronto");
