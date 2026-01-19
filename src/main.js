// Bloquear logs internos do Baileys
require("./utils/filterLogs")();

const P = require("pino");
const {
  default: makeWASocket,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  DisconnectReason,
} = require("baileys");

const { getAuthState } = require("./auth");
const eventsConfig = require("./events");
const { NodeCache } = require("@cacheable/node-cache");

// Cache para controle interno do Baileys
const msgRetryCounterCache = new NodeCache();

async function startSock(io, updateStats, addLog) {
  const { state, saveCreds } = await getAuthState();
  const { version, isLatest } = await fetchLatestBaileysVersion();

  addLog(`📦 Versão do WhatsApp Web v${version[0]}.${version[1]}`);
  addLog(`📦 Última versão: ${isLatest ? 'Sim' : 'Não'}`);

  const sock = makeWASocket({
    version,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys),
    },
    msgRetryCounterCache,
    generateHighQualityLinkPreview: true,
    logger: P({ level: "silent" }),
    printQRInTerminal: false, // QR será gerado via web
  });

  // Gerenciar QR Code e status de conexão
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    // Gerar QR code
    if (qr) {
      addLog('📱 QR Code gerado! Escaneie no WhatsApp.');
      updateStats('qrCode', qr);
      updateStats('connectionStatus', 'waiting_qr');
      io.emit('qrCode', qr);
    }

    // Desconexão
    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !==
        DisconnectReason.loggedOut;

      addLog(
        shouldReconnect
          ? "❌ Conexão encerrada. Reconectando..."
          : "❌ Conexão encerrada. Dispositivo deslogado."
      );

      updateStats('connectionStatus', shouldReconnect ? 'reconnecting' : 'logged_out');

      if (shouldReconnect) {
        setTimeout(() => startSock(io, updateStats, addLog), 5000);
      } else {
        addLog('🔐 Por favor, delete a pasta sessions e reinicie o bot.');
      }
    }

    // Conexão aberta
    if (connection === "open") {
      addLog("✅ Conectado ao WhatsApp com sucesso!");
      updateStats('connectionStatus', 'connected');
      updateStats('qrCode', null);
      const user = sock.user;
      addLog(`👤 Bot iniciado como: ${user?.name || 'Unknown'}`);
    }
  });

  // Configurar eventos de mensagens
  eventsConfig(sock, saveCreds, io, updateStats, addLog);

  return sock;
}

module.exports = startSock;

if (require.main === module) {
  const express = require('express');
  const http = require('http');
  const socketIO = require('socket.io');
  const path = require('path');

  const app = express();
  const server = http.createServer(app);
  const io = socketIO(server, {
    cors: { origin: '*' }
  });

  const PORT = 8080;

  // API básica para quando executado diretamente
  app.get('/', (req, res) => {
    res.json({
      name: 'MutanoX-Bot',
      status: 'running',
      port: PORT
    });
  });

  server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    startSock(io, () => {}, console.log);
  });
}
