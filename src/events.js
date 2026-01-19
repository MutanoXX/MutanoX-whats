const mime = require("mime-types");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const { processResponse } = require("./utils/waitMessage");

// Importar comandos de todos os arquivos
const commandsAdmin = require('./commands/index');
const commandsAPI = require('./commands/api');
const commandsConsultas = require('./commands/consultas');
const commandsEntretenimento = require('./commands/entretenimento');

// Mesclar todos os comandos
const commands = {
  ...commandsAdmin,
  ...commandsAPI,
  ...commandsConsultas,
  ...commandsEntretenimento
};

// Prefixo obrigatório
const PREFIX = '/';

// Mensagens processadas para evitar duplicação
const processedMessages = new Set();

function eventsConfig(sock, saveCreds, io, updateStats, addLog) {
  // Salvar credenciais
  sock.ev.on("creds.update", saveCreds);

  // Processar mensagens
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type === "notify" || type === "append") {
      for (const msg of messages) {
        // Propriedades da mensagem
        const idMensagem = msg.key.id;
        const textRaw =
          msg.message?.conversation ||
          msg.message?.extendedTextMessage?.text ||
          "";
        const text = textRaw.trim();
        const from = msg.key.remoteJid;
        const fromMe = msg.key.fromMe;
        const idUnico = msg.key.participant;

        // Verificar se já foi processada
        if (processedMessages.has(idMensagem)) continue;
        processedMessages.add(idMensagem);

        // Extrair número do usuário
        let number;
        if (msg.key.participant) {
          number = msg.key.participant.split('@')[0];
        } else if (msg.key.remoteJid && msg.key.remoteJid.includes('@')) {
          number = msg.key.remoteJid.split('@')[0];
        }

        // Validar mensagem
        if (!text || !from) continue;

        // Verificar se é um comando (começa com prefixo)
        if (text.startsWith(PREFIX)) {
          addLog(`📨 Comando de ${number}: ${text}`);
          updateStats('commandsUsed', (updateStats.__proto__.commandsUsed || 0) + 1);

          // Extrair comando e argumentos
          const [command, ...args] = text.slice(PREFIX.length).trim().split(' ');
          const commandName = command.toLowerCase();

          // Executar comando
          try {
            await handleCommand(sock, from, commandName, args, msg, number, addLog, updateStats);
          } catch (error) {
            console.error(`Erro no comando /${commandName}:`, error);
            await sock.sendMessage(from, {
              text: `❌ Erro ao executar comando: ${error.message}`
            });
          }
        }

        // Atualizar estatísticas
        updateStats('messagesProcessed', (updateStats.__proto__.messagesProcessed || 0) + 1);
      }
    }
  });

  addLog('📨 Sistema de eventos iniciado');
}

// Handler de comandos
async function handleCommand(sock, from, command, args, msg, number, addLog, updateStats) {
  const commandFunc = commands[command];

  if (!commandFunc) {
    await sock.sendMessage(from, {
      text: `❌ Comando desconhecido: /${command}\n\n📋 Use /menu para ver a lista de comandos disponíveis.`
    });
    return;
  }

  addLog(`▶️ Executando comando: /${command}`);

  // Executar comando
  try {
    await commandFunc(sock, from, args, msg, number, addLog, updateStats);
    addLog(`✅ Comando /${command} executado com sucesso`);
  } catch (error) {
    addLog(`❌ Erro ao executar /${command}: ${error.message}`);
    throw error;
  }
}

module.exports = eventsConfig;
