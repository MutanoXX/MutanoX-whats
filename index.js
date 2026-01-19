// Imports
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const startBot = require('./src/main');

// Configurações
const PORT = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Estatísticas do bot
let stats = {
  startTime: new Date(),
  uptime: 0,
  messagesProcessed: 0,
  commandsUsed: 0,
  protectedCount: 0,
  qrCode: null,
  botStatus: 'initializing',
  connectionStatus: 'disconnected'
};

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rotas API
app.get('/api/stats', (req, res) => {
  stats.uptime = Math.floor((Date.now() - stats.startTime.getTime()) / 1000);
  res.json(stats);
});

app.get('/api/logs', (req, res) => {
  // Ler logs do arquivo se existir
  const fs = require('fs');
  const logPath = path.join(__dirname, 'logs', 'bot.log');
  try {
    const logs = fs.existsSync(logPath) ? fs.readFileSync(logPath, 'utf8').split('\n').slice(-100) : [];
    res.json(logs.filter(l => l.trim()));
  } catch (err) {
    res.json([]);
  }
});

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Socket.IO para atualizações em tempo real
io.on('connection', (socket) => {
  console.log('📱 Cliente conectado ao painel web');

  socket.emit('stats', stats);
  socket.emit('logs', []);

  socket.on('disconnect', () => {
    console.log('📱 Cliente desconectado do painel web');
  });
});

// Função para atualizar estatísticas
function updateStats(key, value) {
  stats[key] = value;
  io.emit('stats', stats);
}

// Função para atualizar contador de protegidos
function updateProtectedCount(delta) {
  stats.protectedCount += delta;
  io.emit('stats', stats);
}

// Função para adicionar logs
function addLog(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);

  // Salvar no arquivo
  const fs = require('fs');
  const logsDir = path.join(__dirname, 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  fs.appendFileSync(path.join(logsDir, 'bot.log'), logMessage + '\n');

  // Emitir via socket
  io.emit('newLog', logMessage);
}

// Exportar funções para o bot
global.updateBotStats = updateStats;
global.addBotLog = addLog;
global.getSocketIO = () => io;
global.updateProtectedCount = updateProtectedCount;

// Iniciar o bot
addLog('🚀 Iniciando MutanoX-Bot...');
updateStats('botStatus', 'starting');

startBot(io, updateStats, addLog).then(() => {
  addLog('✅ Bot iniciado com sucesso!');
  updateStats('botStatus', 'running');
}).catch(err => {
  addLog(`❌ Erro ao iniciar bot: ${err.message}`);
  updateStats('botStatus', 'error');
  console.error(err);
});

// Iniciar servidor
server.listen(PORT, () => {
  addLog(`🌐 Servidor web iniciado na porta ${PORT}`);
  console.log(`\n🌐 Acesse o painel em: http://localhost:${PORT}\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  addLog('🛑 Desligando MutanoX-Bot...');
  server.close(() => {
    console.log('\n✅ Servidor encerrado.');
    process.exit(0);
  });
});

module.exports = { app, server, io };
