// Sistema de auditoria de eventos do Baileys
function eventsAudit(sock) {
  // Auditoria de mensagens recebidas
  sock.ev.on("messages.upsert", ({ messages, type }) => {
    if (type === "notify" || type === "append") {
      for (const msg of messages) {
        const from = msg.key.remoteJid;
        const text = (
          msg.message?.conversation ||
          msg.message?.extendedTextMessage?.text ||
          ""
        ).trim();

        if (text && from) {
          console.log(`📨 [AUDITORIA] Mensagem de ${from}: ${text}`);
        }
      }
    }
  });

  // Auditoria de atualizações de conexão
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log(`📱 [AUDITORIA] QR Code gerado`);
    }

    if (connection === "close") {
      console.log(`❌ [AUDITORIA] Conexão encerrada`);
      console.log(`📡 [AUDITORIA] Update:`, JSON.stringify(update, null, 2));
      console.log(`📡 [AUDITORIA] Last Disconnect:`, JSON.stringify(lastDisconnect, null, 2));
    }

    if (connection === "open") {
      console.log(`✅ [AUDITORIA] Conexão aberta`);
    }
  });

  // Auditoria de atualizações de credenciais
  sock.ev.on("creds.update", () => {
    console.log(`🔐 [AUDITORIA] Credenciais atualizadas`);
  });
}

module.exports = { eventsAudit };
