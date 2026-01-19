const config = require('../config');
const fs = require('fs');
const path = require('path');

// ==========================================
// FUNÇÕES DE UTILIDADE PARA O BOT
// ==========================================

/**
 * Verifica se o número é do dono do bot
 * @param {string} number - Número do WhatsApp (com ou sem @s.whatsapp.net)
 * @returns {boolean}
 */
function isOwner(number) {
  if (!number) return false;

  // Remove @s.whatsapp.net se presente
  const cleanNumber = number.replace('@s.whatsapp.net', '').replace(/\D/g, '');

  return config.owner.numbers.some(ownerNum => {
    const cleanOwnerNum = ownerNum.replace(/\D/g, '');
    return cleanNumber === cleanOwnerNum;
  });
}

/**
 * Verifica se um valor está na lista de proteção
 * @param {string} type - Tipo de proteção (cpf, nome, telefone)
 * @param {string} value - Valor para verificar
 * @returns {boolean}
 */
function isProtected(type, value) {
  if (!type || !value) return false;

  const cleanValue = value.trim().toUpperCase();

  switch (type) {
    case 'cpf':
      return config.protection.protected.cpf.includes(cleanValue);
    case 'nome':
      return config.protection.protected.nome.includes(cleanValue);
    case 'telefone':
      return config.protection.protected.telefone.includes(cleanValue);
    default:
      return false;
  }
}

/**
 * Adiciona um valor à lista de proteção
 * @param {string} type - Tipo de proteção (cpf, nome, telefone)
 * @param {string} value - Valor para proteger
 * @returns {boolean}
 */
function addToProtection(type, value) {
  if (!type || !value) return false;

  const cleanValue = value.trim().toUpperCase();
  const protectionPath = path.join(__dirname, '../../data/protection.json');

  try {
    // Carregar proteções do arquivo se existir
    let protections = {};
    if (fs.existsSync(protectionPath)) {
      protections = JSON.parse(fs.readFileSync(protectionPath, 'utf8'));
    }

    // Inicializar arrays se não existirem
    if (!protections[type]) protections[type] = [];

    // Adicionar se não existir
    if (!protections[type].includes(cleanValue)) {
      protections[type].push(cleanValue);

      // Salvar no arquivo
      const dataDir = path.join(__dirname, '../../data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      fs.writeFileSync(protectionPath, JSON.stringify(protections, null, 2));

      // Atualizar contador global
      if (global.updateProtectedCount) {
        global.updateProtectedCount(1);
      }

      return true;
    }

    return false;
  } catch (error) {
    console.error('Erro ao adicionar à proteção:', error);
    return false;
  }
}

/**
 * Remove um valor da lista de proteção
 * @param {string} type - Tipo de proteção (cpf, nome, telefone)
 * @param {string} value - Valor para remover
 * @returns {boolean}
 */
function removeFromProtection(type, value) {
  if (!type || !value) return false;

  const cleanValue = value.trim().toUpperCase();
  const protectionPath = path.join(__dirname, '../../data/protection.json');

  try {
    // Carregar proteções do arquivo
    if (!fs.existsSync(protectionPath)) return false;

    let protections = JSON.parse(fs.readFileSync(protectionPath, 'utf8'));

    if (!protections[type] || !protections[type].includes(cleanValue)) {
      return false;
    }

    // Remover valor
    protections[type] = protections[type].filter(v => v !== cleanValue);

    // Salvar no arquivo
    fs.writeFileSync(protectionPath, JSON.stringify(protections, null, 2));

    // Atualizar contador global
    if (global.updateProtectedCount) {
      global.updateProtectedCount(-1);
    }

    return true;
  } catch (error) {
    console.error('Erro ao remover da proteção:', error);
    return false;
  }
}

/**
 * Lista todos os valores protegidos por tipo
 * @param {string} type - Tipo de proteção (cpf, nome, telefone) ou 'all' para todos
 * @returns {object|array}
 */
function listProtected(type) {
  const protectionPath = path.join(__dirname, '../../data/protection.json');

  try {
    if (!fs.existsSync(protectionPath)) {
      return type === 'all' ? { cpf: [], nome: [], telefone: [] } : [];
    }

    const protections = JSON.parse(fs.readFileSync(protectionPath, 'utf8'));

    if (type === 'all') {
      return protections;
    }

    return protections[type] || [];
  } catch (error) {
    console.error('Erro ao listar proteções:', error);
    return type === 'all' ? { cpf: [], nome: [], telefone: [] } : [];
  }
}

/**
 * Adiciona créditos @MutanoX a uma mensagem
 * @param {string} message - Mensagem original
 * @returns {string}
 */
function addCredits(message) {
  if (!message) return '';

  const divider = config.messages.divider;
  const credits = config.bot.credits;
  const footer = config.messages.footer;

  // Se já tem footer, não duplica
  if (message.includes(footer)) return message;

  // Se não tem divisor, adiciona
  if (!message.includes(divider)) {
    return message + '\n\n' + divider + '\n✨ Bot por ' + credits;
  }

  return message;
}

/**
 * Formata uma mensagem com título e conteúdo
 * @param {string} title - Título da mensagem
 * @param {string} content - Conteúdo da mensagem
 * @param {object} options - Opções extras
 * @returns {string}
 */
function formatMessage(title, content, options = {}) {
  const { emoji = '✨', showCredits = true } = options;

  let message = `${emoji} ${title}\n${config.messages.divider}\n\n${content}`;

  if (showCredits) {
    message = addCredits(message);
  }

  return message;
}

/**
 * Formata tempo de uptime
 * @param {number} seconds - Segundos
 * @returns {string}
 */
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

/**
 * Formata número com máscara
 * @param {string} number - Número para formatar
 * @param {string} type - Tipo de formatação (cpf, telefone, cnpj)
 * @returns {string}
 */
function formatNumber(number, type) {
  const clean = number.replace(/\D/g, '');

  switch (type) {
    case 'cpf':
      return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    case 'cnpj':
      return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    case 'telefone':
      if (clean.length === 11) {
        return clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
      return clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    default:
      return number;
  }
}

/**
 * Formata CPF
 * @param {string} cpf - CPF para formatar
 * @returns {string}
 */
function formatCPF(cpf) {
  const clean = cpf.replace(/\D/g, '');
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata CNPJ
 * @param {string} cnpj - CNPJ para formatar
 * @returns {string}
 */
function formatCNPJ(cnpj) {
  const clean = cnpj.replace(/\D/g, '');
  return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Formata telefone
 * @param {string} telefone - Telefone para formatar
 * @returns {string}
 */
function formatTelefone(telefone) {
  const clean = telefone.replace(/\D/g, '');
  if (clean.length === 11) {
    return clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (clean.length === 10) {
    return clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return clean;
}

/**
 * Verifica se é credencial de teste
 * @param {string} type - Tipo de credencial (cpf, nome, telefone)
 * @param {string} value - Valor para verificar
 * @returns {boolean}
 */
function isTestCredential(type, value) {
  const cleanValue = value.trim().toUpperCase();
  
  const TEST_CREDENTIALS = {
    cpf: '74302051191',
    nome: 'ALAN FILIPY FIDELIS COELHO',
    telefone: '65999701064'
  };

  switch (type) {
    case 'cpf':
      return cleanValue === TEST_CREDENTIALS.cpf;
    case 'nome':
      return cleanValue === TEST_CREDENTIALS.nome;
    case 'telefone':
      return cleanValue === TEST_CREDENTIALS.telefone.replace(/\D/g, '');
    default:
      return false;
  }
}

/**
 * Remove máscara de número
 * @param {string} number - Número com máscara
 * @returns {string}
 */
function unformatNumber(number) {
  return number.replace(/\D/g, '');
}

/**
 * Valida CPF
 * @param {string} cpf - CPF para validar
 * @returns {boolean}
 */
function validateCPF(cpf) {
  const clean = cpf.replace(/\D/g, '');

  if (clean.length !== 11) return false;

  // Verificar sequências iguais
  if (/^(\d)\1+$/.test(clean)) return false;

  let sum = 0;
  let remainder;

  // Validar primeiro dígito
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(clean.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(clean.substring(9, 10))) return false;

  // Validar segundo dígito
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(clean.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(clean.substring(10, 11))) return false;

  return true;
}

/**
 * Gera barra de progresso em texto
 * @param {number} current - Valor atual
 * @param {number} total - Valor total
 * @param {number} size - Tamanho da barra (padrão: 20)
 * @returns {string}
 */
function progressBar(current, total, size = 20) {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));
  const filled = Math.round((size * percentage) / 100);
  const empty = size - filled;

  const filledChar = '█';
  const emptyChar = '░';

  return `${filledChar.repeat(filled)}${emptyChar.repeat(empty)} ${Math.round(percentage)}%`;
}

/**
 * Trunca texto com reticências
 * @param {string} text - Texto para truncar
 * @param {number} maxLength - Tamanho máximo
 * @returns {string}
 */
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Escapa caracteres especiais para regex
 * @param {string} text - Texto para escapar
 * @returns {string}
 */
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Gera ID único
 * @returns {string}
 */
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Obtém o número limpo (sem @ e caracteres especiais)
 * @param {string} number - Número do WhatsApp
 * @returns {string}
 */
function cleanNumber(number) {
  return number.replace('@s.whatsapp.net', '').replace(/\D/g, '');
}

/**
 * Verifica se é número válido de WhatsApp
 * @param {string} number - Número para verificar
 * @returns {boolean}
 */
function isValidWhatsAppNumber(number) {
  const clean = cleanNumber(number);
  return clean.length >= 10 && clean.length <= 15 && /^\d+$/.test(clean);
}

/**
 * Obtém a mensagem de erro configurada
 * @param {string} errorType - Tipo de erro
 * @returns {string}
 */
function getErrorMessage(errorType) {
  return config.messages.errors[errorType] || 'Erro desconhecido.';
}

/**
 * Obtém a mensagem de sucesso configurada
 * @param {string} successType - Tipo de sucesso
 * @returns {string}
 */
function getSuccessMessage(successType) {
  return config.messages.success[successType] || 'Operação realizada com sucesso!';
}

/**
 * Salva log em arquivo
 * @param {string} message - Mensagem do log
 * @param {string} level - Nível do log (info, warn, error)
 */
function saveLog(message, level = 'info') {
  if (!config.logs.enabled || !config.logs.saveToFile) return;

  try {
    const logsDir = path.join(__dirname, '../../logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;

    const logFile = path.join(logsDir, 'bot.log');
    fs.appendFileSync(logFile, logMessage);
  } catch (error) {
    console.error('Erro ao salvar log:', error);
  }
}

module.exports = {
  isOwner,
  isProtected,
  addToProtection,
  removeFromProtection,
  listProtected,
  addCredits,
  formatMessage,
  formatUptime,
  formatNumber,
  formatCPF,
  formatCNPJ,
  formatTelefone,
  isTestCredential,
  unformatNumber,
  validateCPF,
  progressBar,
  truncateText,
  escapeRegex,
  generateUniqueId,
  cleanNumber,
  isValidWhatsAppNumber,
  getErrorMessage,
  getSuccessMessage,
  saveLog
};
