// Sistema de espera por respostas do usuário
const responsePromises = new Map();

/**
 * Processa uma mensagem para verificar se há uma Promise esperando
 * @param {string} from - ID do chat
 * @param {string} idUnico - ID único do usuário
 * @param {string} text - Texto da mensagem
 * @returns {boolean} - true se encontrou e resolveu uma Promise
 */
function processResponse(from, idUnico, text) {
  const key = idUnico || from;

  if (responsePromises.has(key)) {
    const { resolve } = responsePromises.get(key);
    responsePromises.delete(key);
    resolve(text);
    return true;
  }

  return false;
}

/**
 * Cria uma Promise que espera por uma resposta do usuário
 * @param {string} from - ID do chat
 * @param {string} idUnico - ID único do usuário
 * @param {number} timeout - Tempo de espera em ms (padrão: 30000)
 * @returns {Promise<string>} - Resposta do usuário
 */
function waitForResponse(from, idUnico, timeout = 30000) {
  const key = idUnico || from;

  return new Promise((resolve, reject) => {
    // Limpa qualquer Promise anterior
    responsePromises.delete(key);

    // Cria nova Promise
    responsePromises.set(key, {
      resolve,
      reject,
      timestamp: Date.now()
    });

    // Timeout
    setTimeout(() => {
      if (responsePromises.has(key)) {
        responsePromises.delete(key);
        reject(new Error('Tempo esgotado. Nenhuma resposta recebida.'));
      }
    }, timeout);
  });
}

module.exports = { processResponse, waitForResponse };
