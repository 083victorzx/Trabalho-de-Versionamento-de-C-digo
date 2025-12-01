# Imagem base com Node
FROM node:20-bullseye

# Instala dependências de sistema necessárias pro Electron funcionar
RUN apt-get update && apt-get install -y \
    libgtk-3-0 \
    libnss3 \
    libxss1 \
    libasound2 \
    libx11-xcb1 \
    libdrm2 \
    libxkbcommon0 \
    libxcb-dri3-0 \
    libgbm1 \
    && rm -rf /var/lib/apt/lists/*

# Cria usuário não-root pra rodar o app
RUN useradd -m appuser

# Diretório da aplicação
WORKDIR /app

# Copia manifestos primeiro pra aproveitar cache de build
COPY package*.json ./

# Instala dependências (electron, electron-store, fs-extra, file-type, etc)
RUN npm install

# Copia o restante do código
COPY . .

# Troca para usuário normal
USER appuser

# Só pra deixar os avisos de segurança do Electron mais silenciosos em dev
ENV ELECTRON_ENABLE_SECURITY_WARNINGS=false

# Comando padrão: inicia o Electron apontando para o main.js configurado no package.json
CMD ["npx", "electron", "."]