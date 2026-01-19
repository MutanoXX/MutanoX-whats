// Socket.io connection
const socket = io();

// Elements
const botStatusEl = document.getElementById('bot-status');
const connectionStatusEl = document.getElementById('connection-status');
const uptimeEl = document.getElementById('uptime');
const messagesProcessedEl = document.getElementById('messages-processed');
const commandsUsedEl = document.getElementById('commands-used');
const sessionStartEl = document.getElementById('session-start');
const protectedCountEl = document.getElementById('protected-count');
const qrContainerEl = document.getElementById('qr-container');
const logsContainerEl = document.getElementById('logs');

// Connect event
socket.on('connect', () => {
    console.log('📱 Conectado ao servidor Socket.io');
    addLog('📱 Painel web conectado', 'info');
});

// Disconnect event
socket.on('disconnect', () => {
    console.log('📱 Desconectado do servidor Socket.io');
    addLog('📱 Painel web desconectado', 'warning');
});

// Stats update event
socket.on('stats', (stats) => {
    updateStats(stats);
});

// QR Code event
socket.on('qrCode', (qr) => {
    displayQRCode(qr);
});

// New log event
socket.on('newLog', (log) => {
    addLog(log, 'info');
});

// Initial logs
socket.on('logs', (logs) => {
    logs.forEach(log => addLog(log, 'info'));
});

// Update stats on page
function updateStats(stats) {
    // Update bot status
    const statusBadge = getStatusBadge(stats.botStatus || 'unknown');
    botStatusEl.innerHTML = statusBadge;

    // Update connection status
    const connBadge = getStatusBadge(stats.connectionStatus || 'unknown', true);
    connectionStatusEl.innerHTML = connBadge;

    // Update uptime
    if (stats.uptime) {
        uptimeEl.textContent = formatUptime(stats.uptime);
    }

    // Update messages processed
    if (stats.messagesProcessed !== undefined) {
        messagesProcessedEl.textContent = stats.messagesProcessed.toLocaleString();
    }

    // Update commands used
    if (stats.commandsUsed !== undefined) {
        commandsUsedEl.textContent = stats.commandsUsed.toLocaleString();
    }

    // Update session start
    if (stats.startTime) {
        sessionStartEl.textContent = formatDateTime(new Date(stats.startTime));
    }

    // Update protected count
    if (stats.protectedCount !== undefined) {
        protectedCountEl.textContent = stats.protectedCount.toLocaleString();
    }

    // Update QR code
    if (stats.qrCode) {
        displayQRCode(stats.qrCode);
    } else if (stats.connectionStatus === 'connected') {
        qrContainerEl.innerHTML = `
            <p class="qr-placeholder" style="color: #4caf50; font-weight: 600;">
                ✅ Bot conectado com sucesso!
            </p>
        `;
    }
}

// Display QR Code
function displayQRCode(qr) {
    const img = document.createElement('img');
    img.id = 'qr-code';
    img.src = qr;
    img.alt = 'QR Code do WhatsApp';

    qrContainerEl.innerHTML = '';
    qrContainerEl.appendChild(img);

    addLog('📱 QR Code gerado. Escaneie no WhatsApp.', 'info');
}

// Add log to container
function addLog(message, type = 'info') {
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';

    const timestamp = new Date().toISOString();

    logEntry.innerHTML = `
        <span class="log-timestamp">[${timestamp}]</span>
        ${escapeHtml(message)}
    `;

    logsContainerEl.appendChild(logEntry);

    // Auto scroll to bottom
    logsContainerEl.scrollTop = logsContainerEl.scrollHeight;

    // Limit logs to 100 entries
    while (logsContainerEl.children.length > 100) {
        logsContainerEl.removeChild(logsContainerEl.firstChild);
    }
}

// Clear logs
function clearLogs() {
    logsContainerEl.innerHTML = '';
    addLog('🧹 Logs limpos', 'info');
}

// Get status badge HTML
function getStatusBadge(status, isConnection = false) {
    const statusMap = {
        // Bot status
        'initializing': { text: 'Inicializando', class: 'status-waiting' },
        'starting': { text: 'Iniciando', class: 'status-waiting' },
        'running': { text: 'Rodando', class: 'status-connected' },
        'error': { text: 'Erro', class: 'status-error' },
        'stopped': { text: 'Parado', class: 'status-disconnected' },

        // Connection status
        'disconnected': { text: 'Desconectado', class: 'status-disconnected' },
        'waiting_qr': { text: 'Aguardando QR', class: 'status-waiting' },
        'connecting': { text: 'Conectando', class: 'status-waiting' },
        'connected': { text: 'Conectado', class: 'status-connected' },
        'reconnecting': { text: 'Reconectando', class: 'status-waiting' },
        'logged_out': { text: 'Deslogado', class: 'status-disconnected' }
    };

    const config = statusMap[status] || { text: 'Desconhecido', class: 'status-error' };

    return `<span class="status-badge ${config.class}">${config.text}</span>`;
}

// Format uptime
function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0) parts.push(`${secs}s`);

    return parts.length > 0 ? parts.join(' ') : '0s';
}

// Format date time
function formatDateTime(date) {
    const pad = (num) => String(num).padStart(2, '0');

    return [
        pad(date.getDate()),
        pad(date.getMonth() + 1),
        date.getFullYear()
    ].join('/') + ' ' + [
        pad(date.getHours()),
        pad(date.getMinutes()),
        pad(date.getSeconds())
    ].join(':');
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Periodic stats update
setInterval(() => {
    fetch('/api/stats')
        .then(res => res.json())
        .then(stats => updateStats(stats))
        .catch(err => console.error('Erro ao buscar stats:', err));
}, 5000);

console.log('🚀 Dashboard MutanoX-Bot carregado!');
