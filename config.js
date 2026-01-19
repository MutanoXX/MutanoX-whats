/**
 * Configurações do MutanoX-Bot Premium
 * @description Configurações principais do sistema
 */

module.exports = {
  // ==========================================
  // INFORMAÇÕES DO BOT
  // ==========================================
  bot: {
    name: 'MutanoX-Bot',
    version: '2.0.0',
    prefix: '/',
    owner: 'MutanoX',
    credits: '@MutanoX'
  },

  // ==========================================
  // CONFIGURAÇÕES DO DONO (ADMIN)
  // ==========================================
  owner: {
    // Número(s) do dono do bot (com código do país, sem @)
    // Exemplo: '5511999999999' para Brasil
    numbers: [
      '5511999999999',  // Número do dono (substitua pelo seu número)
    ],

    // Nome exibido
    name: 'MutanoX',

    // Avatar/nick do dono
    nickname: '👑 MutanoX'
  },

  // ==========================================
  // SISTEMA DE PROTEÇÃO
  // ==========================================
  protection: {
    // Lista de usuários protegidos
    // Formatos aceitos: CPF, Nome Completo, Telefone
    protected: {
      cpf: [],
      nome: [],
      telefone: []
    },

    // Mensagem de resposta para usuários protegidos
    message: '❌ Esse usuário é protegido pelo sistema MutanoX 🛡️',

    // Log de tentativas de consulta
    logAttempts: true,

    // Bloquear quem tentar consultar usuário protegido
    blockOnAttempt: false
  },

  // ==========================================
  // CONFIGURAÇÕES DO SERVIDOR WEB
  // ==========================================
  server: {
    port: process.env.PORT || 8080,
    host: '0.0.0.0',
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  },

  // ==========================================
  // CONFIGURAÇÕES DE API
  // ==========================================
  api: {
    // API key padrão para APIs externas
    defaultKey: 'freeApikey',

    // Timeout para requisições (ms)
    timeout: 30000,

    // Máximo de tentativas
    maxRetries: 3
  },

  // ==========================================
  // CONFIGURAÇÕES DE MENSGENS
  // ==========================================
  messages: {
    // Footer padrão para todas as respostas
    footer: '\n\n━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX',
    divider: '━━━━━━━━━━━━━━━━━━━━━━━',

    // Mensagens de erro
    errors: {
      commandNotFound: '❌ Comando não encontrado!\n\n📋 Use /menu para ver a lista de comandos.',
      ownerOnly: '❌ Este comando só pode ser usado pelo dono do bot! 👑',
      invalidArgs: '❌ Argumentos inválidos!\n\n💡 Use /help [comando] para ver como usar.',
      rateLimit: '⏱️ Você está enviando comandos muito rápido! Aguarde um momento.',
      apiError: '❌ Erro ao processar solicitação. Tente novamente mais tarde.',
      protectedUser: '❌ Esse usuário é protegido pelo sistema MutanoX 🛡️'
    },

    // Mensagens de sucesso
    success: {
      addedToProtection: '✅ Usuário adicionado à lista de proteção! 🛡️',
      removedFromProtection: '✅ Usuário removido da lista de proteção! 🛡️',
      settingsUpdated: '✅ Configurações atualizadas com sucesso! ⚙️',
      botRestarted: '✅ Bot reiniciado com sucesso! 🔄',
      botShutdown: '✅ Bot desligado! 👋'
    }
  },

  // ==========================================
  // CONFIGURAÇÕES DE LOGS
  // ==========================================
  logs: {
    enabled: true,
    saveToFile: true,
    maxFiles: 10,
    maxSize: '10m',
    level: 'info' // debug, info, warn, error
  },

  // ==========================================
  // CONFIGURAÇÕES DE CACHE
  // ==========================================
  cache: {
    enabled: true,
    ttl: 3600, // Tempo de vida em segundos (1 hora)
    maxSize: 100 // Máximo de entradas
  },

  // ==========================================
  // CONFIGURAÇÕES DE RATE LIMITING
  // ==========================================
  rateLimit: {
    enabled: true,
    windowMs: 60000, // 1 minuto
    max: 30, // Máximo de comandos por janela
    skipAdmin: true // Pular verificação para admin
  },

  // ==========================================
  // CONFIGURAÇÕES DE ANTISPAM
  // ==========================================
  antiSpam: {
    enabled: true,
    maxMessages: 10, // Máximo de mensagens em 5 segundos
    windowMs: 5000,
    skipAdmin: true
  },

  // ==========================================
  // CONFIGURAÇÕES DE AUTORESPONDER
  // ==========================================
  autoResponse: {
    enabled: false, // Desabilitado por padrão
    keywords: {
      // Exemplo: 'oi': 'Olá! Como posso ajudar?'
    }
  },

  // ==========================================
  // CONFIGURAÇÕES DE BLOQUEIO
  // ==========================================
  blocklist: {
    // Números ou IDs bloqueados
    numbers: [],
    reason: {} // Motivo do bloqueio
  },

  // ==========================================
  // CONFIGURAÇÕES DE WELCOME
  // ==========================================
  welcome: {
    enabled: false, // Desabilitado por padrão
    message: '👋 Bem-vindo ao grupo!\n\n🤖 Use /menu para ver os comandos.',
    groupsOnly: true
  },

  // ==========================================
  // CONFIGURAÇÕES DE GOODBYE
  // ==========================================
  goodbye: {
    enabled: false, // Desabilitado por padrão
    message: '👋 Até logo! Volte sempre!',
    groupsOnly: true
  },

  // ==========================================
  // FUNÇÕES DE AJUDA
  // ==========================================
  utils: {
    /**
     * Verifica se um número é dono do bot
     * @param {string} number - Número para verificar
     * @returns {boolean}
     */
    isOwner: function(number) {
      const cleanNumber = number.replace(/\D/g, '');
      return this.owner.numbers.some(ownerNum => {
        const cleanOwnerNum = ownerNum.replace(/\D/g, '');
        return cleanNumber === cleanOwnerNum;
      }.bind(this));
    },

    /**
     * Adiciona um usuário à proteção
     * @param {string} type - Tipo de proteção (cpf, nome, telefone)
     * @param {string} value - Valor a proteger
     * @returns {boolean}
     */
    addToProtection: function(type, value) {
      if (!this.protection.protected[type]) return false;
      const cleanValue = value.trim().toUpperCase();
      if (!this.protection.protected[type].includes(cleanValue)) {
        this.protection.protected[type].push(cleanValue);
        return true;
      }
      return false;
    },

    /**
     * Remove um usuário da proteção
     * @param {string} type - Tipo de proteção (cpf, nome, telefone)
     * @param {string} value - Valor para remover
     * @returns {boolean}
     */
    removeFromProtection: function(type, value) {
      if (!this.protection.protected[type]) return false;
      const cleanValue = value.trim().toUpperCase();
      const index = this.protection.protected[type].indexOf(cleanValue);
      if (index > -1) {
        this.protection.protected[type].splice(index, 1);
        return true;
      }
      return false;
    },

    /**
     * Verifica se um usuário está protegido
     * @param {string} type - Tipo de proteção (cpf, nome, telefone)
     * @param {string} value - Valor para verificar
     * @returns {boolean}
     */
    isProtected: function(type, value) {
      if (!this.protection.protected[type]) return false;
      const cleanValue = value.trim().toUpperCase();
      return this.protection.protected[type].includes(cleanValue);
    },

    /**
     * Adiciona créditos a uma mensagem
     * @param {string} message - Mensagem original
     * @returns {string} - Mensagem com créditos
     */
    addCredits: function(message) {
      const divider = this.messages.divider;
      const credits = this.bot.credits;
      const footer = this.messages.footer;

      // Se já tem footer, não duplica
      if (message.includes(footer)) return message;

      // Se não tem divisor, adiciona
      if (!message.includes(divider)) {
        return message + '\n\n' + divider + '\n✨ Bot por ' + credits;
      }

      return message;
    },

    /**
     * Formata mensagem com estilo
     * @param {string} title - Título
     * @param {string} content - Conteúdo
     * @param {object} options - Opções extras
     * @returns {string}
     */
    formatMessage: function(title, content, options = {}) {
      const { emoji = '✨', showCredits = true } = options;
      let message = `${emoji} ${title}\n${this.messages.divider}\n\n${content}`;

      if (showCredits) {
        message = this.addCredits(message);
      }

      return message;
    }
  }
};
