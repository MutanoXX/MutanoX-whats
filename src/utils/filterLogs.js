// Bloquear logs internos do Baileys
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

const blockedPatterns = [
  /baileys/i,
  /WAConnection/i,
  /WAWeb/i,
  /@whiskeysockets/i,
  /signal/i,
  /proto/i,
];

function filterLogs() {
  console.log = (...args) => {
    const message = args.join(' ');
    const shouldBlock = blockedPatterns.some(pattern => pattern.test(message));
    if (!shouldBlock) {
      originalLog.apply(console, args);
    }
  };

  console.error = (...args) => {
    const message = args.join(' ');
    const shouldBlock = blockedPatterns.some(pattern => pattern.test(message));
    if (!shouldBlock) {
      originalError.apply(console, args);
    }
  };

  console.warn = (...args) => {
    const message = args.join(' ');
    const shouldBlock = blockedPatterns.some(pattern => pattern.test(message));
    if (!shouldBlock) {
      originalWarn.apply(console, args);
    }
  };
}

module.exports = filterLogs;
