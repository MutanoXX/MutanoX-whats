const axios = require('axios');
const path = require('path');
const fs = require('fs');
const {
  isOwner,
  isProtected,
  addToProtection,
  removeFromProtection,
  listProtected,
  addCredits,
  formatMessage,
  formatUptime,
  formatNumber,
  validateCPF
} = require('../utils/helpers');

// Configuração de API key padrão
const DEFAULT_API_KEY = 'freeApikey';

// ==========================================
// COMANDOS DO BOT MUTANOX PREMIUM
// ==========================================

module.exports = {
  // ========================================
  // MENU ADMIN (EXCLUSIVO PARA DONO)
  // ========================================
  menuadm: async (sock, from, args, msg, number, addLog) => {
    // Verificar se é admin
    if (!isOwner(number)) {
      await sock.sendMessage(from, {
        text: '❌ Este comando só pode ser usado pelo dono do bot! 👑\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX'
      });
      return;
    }

    const menuAdmText = `
╔═════════════════════════════╗
║   👑 MENU ADMIN MUTANOX     ║
║   Sistema Premium v2.1.0      ║
╚═════════════════════════════╝

🛡️ **SISTEMA DE PROTEÇÃO**
━━━━━━━━━━━━━━━━━━━━━━━━━
/protect [cpf|nome|telefone] [valor]
  Protege um usuário de consultas

/unprotect [cpf|nome|telefone] [valor]
  Remove proteção de um usuário

/listprotect [cpf|nome|telefone|all]
  Lista todos os usuários protegidos

Exemplos:
  /protect cpf 12345678900
  /protect nome João Silva
  /protect telefone 11999999999

📢 **GERENCIAMENTO DE GRUPOS**
━━━━━━━━━━━━━━━━━━━━━━━━━
/broadcast [mensagem]
  Envia mensagem para todos os grupos

/cleargroup
  Limpa mensagens do bot no grupo

/kick @usuario
  Remove um participante do grupo

/add [número]
  Adiciona um participante ao grupo

Exemplos:
  /broadcast Nova atualização!
  /kick @11999999999
  /add 11999999999

🚫 **BLOQUEIO DE USUÁRIOS**
━━━━━━━━━━━━━━━━━━━━━━━━━
/block [número]
  Bloqueia um número de usar o bot

/unblock [número]
  Desbloqueia um número

Exemplos:
  /block 11999999999
  /unblock 11999999999

⚙️ **CONFIGURAÇÕES DO BOT**
━━━━━━━━━━━━━━━━━━━━━━━━━
/setstatus [texto]
  Define o status do bot

Exemplo:
  /setstatus Online e pronto!

🔄 **CONTROLE DO SISTEMA**
━━━━━━━━━━━━━━━━━━━━━━━━━
/leave
  Sai do grupo atual

/restart
  Reinicia o bot

/shutdown
  Desliga o bot completamente

━━━━━━━━━━━━━━━━━━━━━━━━━
📊 **INFORMAÇÕES:**
• Todos os comandos admin só funcionam para você
• Ações são logadas para auditoria
• Sistema de proteção bloqueia consultas indesejadas
• Contador de protegidos no dashboard

━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Bot por @MutanoX
👑 Sistema Exclusivo para o Dono
    `;

    const finalMessage = addCredits(menuAdmText);

    const imagePath = path.join(__dirname, '../../public/images/menu.svg');

    try {
      if (fs.existsSync(imagePath)) {
        await sock.sendMessage(from, {
          image: fs.readFileSync(imagePath),
          caption: finalMessage
        });
      } else {
        await sock.sendMessage(from, {
          text: finalMessage
        });
      }
    } catch (err) {
      await sock.sendMessage(from, {
        text: finalMessage
      });
    }
  },

  // ========================================
  // MENU DE AJUDA (PÚBLICO)
  // ========================================
  menu: async (sock, from, args, msg, number, addLog, updateStats) => {
    const isAdmin = isOwner(number);

    const menuText = `
╔═══════════════════════════════╗
║    🤖 MUTANOX-BOT 🤖           ║
║    Sistema Premium v2.0       ║
║    ${isAdmin ? '👑 ADMIN MODE' : '👤 USUÁRIO'}                  ║
╚═══════════════════════════════╝

📚 **COMANDOS DISPONÍVEIS:**

🤖 **INTELIGÊNCIA ARTIFICIAL**
━━━━━━━━━━━━━━━━━━━━━━━━━
/ai [pergunta] - Chat AI (Gemini)
/perplexity [pergunta] - Perplexity AI
/cici [pergunta] - Cici AI
/felo [pergunta] - Felo AI
/jeeves [pergunta] - Jeeves AI

🔧 **FERRAMENTAS**
━━━━━━━━━━━━━━━━━━━━━━━━━
/bypass [url] - Bypass Cloudflare
/stalkdiscord [id] - Stalk Discord
/github [usuario] - Pesquisar GitHub
/googleimg [query] - Buscar Imagens
/cep [cep] - Consultar CEP

🎮 **GAMES**
━━━━━━━━━━━━━━━━━━━━━━━━━
/infoff [id] - Info Free Fire

🔍 **CONSULTAS**
━━━━━━━━━━━━━━━━━━━━━━━━━
/telefone [numero] - Consultar telefone
/nome [nome completo] - Consultar nome
/cpf [cpf] - Consultar CPF
/cnpj [cnpj] - Consultar CNPJ

📚 **BUSCA E PESQUISA**
━━━━━━━━━━━━━━━━━━━━━━━━━
/brainly [query] - Buscar Brainly
/douyin [query] - Buscar Douyin
/wikipedia [query] - Wikipedia

🎉 **ENTRETENIMENTO**
━━━━━━━━━━━━━━━━━━━━━━━━━
/piada - Piada aleatória
/meme - Meme aleatório
/frase - Frase motivacional
/clima [cidade] - Clima da cidade

${isAdmin ? `
👑 **COMANDOS ADMIN**
━━━━━━━━━━━━━━━━━━━━━━━━━
/protect [tipo] [valor] - Proteger usuário
/unprotect [tipo] [valor] - Remover proteção
/listprotect [tipo] - Listar protegidos
/broadcast [msg] - Enviar broadcast
/block [numero] - Bloquear número
/unblock [numero] - Desbloquear número
/cleargroup - Limpar chat do grupo
/kick [menção] - Remover participante
/add [numero] - Adicionar participante
/setstatus [texto] - Definir status
/leave - Sair do grupo
/restart - Reiniciar bot
/shutdown - Desligar bot
` : ''}

📊 **SISTEMA**
━━━━━━━━━━━━━━━━━━━━━━━━━
/menu - Exibir este menu
/ping - Testar conexão
/status - Status do bot
/help - Ajuda detalhada

━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Todos os comandos usam prefixo /
${isAdmin ? '🔑 Você tem acesso ADMIN' : '🔒 Modo Usuário'}
    `;

    const finalMessage = addCredits(menuText);

    const imagePath = path.join(__dirname, '../../public/images/menu.svg');

    try {
      if (fs.existsSync(imagePath)) {
        await sock.sendMessage(from, {
          image: fs.readFileSync(imagePath),
          caption: finalMessage
        });
      } else {
        await sock.sendMessage(from, {
          text: finalMessage
        });
      }
    } catch (err) {
      await sock.sendMessage(from, {
        text: finalMessage
      });
    }
  },

  // ========================================
  // COMANDOS DE SISTEMA
  // ========================================
  ping: async (sock, from, args, msg, number, addLog) => {
    const start = Date.now();
    const tempMsg = await sock.sendMessage(from, { text: '🏓 Pong!' });
    const end = Date.now();

    const message = formatMessage('LATÊNCIA', `⚡ Tempo de resposta: ${end - start}ms\n📡 Status: Conectado`, { emoji: '📊' });

    await sock.sendMessage(from, {
      text: message
    });
  },

  help: async (sock, from, args, msg, number, addLog) => {
    const isAdmin = isOwner(number);
    const helpText = `
📖 **AJUDA DETALHADA - MUTANOX-BOT**

━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 **INTELIGÊNCIA ARTIFICIAL**
/ai [pergunta] - Chat com Gemini AI
  Ex: /ai Qual o sentido da vida?

/perplexity [pergunta] - Perplexity AI
  Ex: /perplexity Clima hoje em SP

/cici [pergunta] - Cici AI
  Ex: /cici Explique física quântica

/felo [pergunta] - Felo AI
  Ex: /felo História do Brasil

/jeeves [pergunta] - Jeeves AI
  Ex: /jeeves Receita de bolo

━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 **FERRAMENTAS**
/bypass [url] [type] - Bypass Cloudflare
  Ex: /bypass https://site.com turnstile-min

/stalkdiscord [id] - Stalk Discord
  Ex: /stalkdiscord 123456789

/github [username] - GitHub Profile
  Ex: /github MutanoXX

/googleimg [query] - Google Images
  Ex: /googleimg gato fofo

/cep [cep] - Consultar CEP
  Ex: /cep 01310-100

━━━━━━━━━━━━━━━━━━━━━━━━━

🎮 **GAMES**
/infoff [id] - Free Fire Info
  Ex: /infoff 8082446244

━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 **CONSULTAS**
/telefone [numero] - Consultar telefone
  Ex: /telefone 11999999999

/nome [nome] - Consultar nome
  Ex: /nome João Silva

/cpf [cpf] - Consultar CPF
  Ex: /cpf 12345678900

/cnpj [cnpj] - Consultar CNPJ
  Ex: /cnpj 12345678000190

━━━━━━━━━━━━━━━━━━━━━━━━━

📚 **BUSCA**
/brainly [query] - Brainly Search
  Ex: /brainly matemática

/douyin [query] - Douyin Search
  Ex: /douyin música viral

/wikipedia [query] - Wikipedia
  Ex: /wikipedia Brasil

━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 **ENTRETENIMENTO**
/piada - Piada aleatória

/meme - Meme aleatório

/frase - Frase motivacional

/clima [cidade] - Clima
  Ex: /clima São Paulo

${isAdmin ? `
━━━━━━━━━━━━━━━━━━━━━━━━━

👑 **COMANDOS ADMIN**
/protect [cpf|nome|telefone] [valor] - Proteger
  Ex: /protect cpf 12345678900

/unprotect [cpf|nome|telefone] [valor] - Desproteger
  Ex: /unprotect cpf 12345678900

/listprotect [cpf|nome|telefone|all] - Listar
  Ex: /listprotect cpf

/broadcast [mensagem] - Enviar para todos
  Ex: /broadcast Olá a todos!

/block [numero] - Bloquear número
  Ex: /block 11999999999

/unblock [numero] - Desbloquear
  Ex: /unblock 11999999999

/cleargroup - Limpar mensagens do grupo

/kick @usuario - Remover participante
  Ex: /kick @11999999999

/add [numero] - Adicionar ao grupo
  Ex: /add 11999999999

/setstatus [texto] - Definir status do bot

/leave - Sair do grupo atual

/restart - Reiniciar bot

/shutdown - Desligar bot
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━

💡 **DICA:** Use o prefixo / em todos comandos
${isAdmin ? '🔑 Acesso Admin: Ativo' : '🔒 Acesso Admin: Inativo'}
    `;

    const finalMessage = addCredits(helpText);
    await sock.sendMessage(from, { text: finalMessage });
  },

  status: async (sock, from, args, msg, number, addLog, updateStats) => {
    const stats = {
      uptime: Math.floor(process.uptime()),
      memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      nodeVersion: process.version,
      platform: process.platform
    };

    const uptimeFormatted = formatUptime(stats.uptime);

    const statusText = formatMessage(
      'STATUS DO SISTEMA',
      `🤖 **Nome:** MutanoX-Bot
🔥 **Versão:** 2.0.0
📦 **Tipo:** Premium
⏱️ **Uptime:** ${uptimeFormatted}
💾 **Memória:** ${stats.memory} MB
💻 **Node.js:** ${stats.nodeVersion}
🖥️ **Plataforma:** ${stats.platform}

━━━━━━━━━━━━━━━━━━━━━━━━━

✅ **Sistemas Ativos:**
📱 Conexão WhatsApp
🌐 Interface Web
📡 Socket.io Real-time
🔌 API Integration
🛡️ Sistema de Proteção
👑 Sistema Admin
📊 Sistema de Logs
⚡ Sistema de Comandos`,
      { emoji: '📊', showCredits: true }
    );

    await sock.sendMessage(from, { text: statusText });
  },

  // ========================================
  // COMANDOS ADMIN
  // ========================================
  protect: async (sock, from, args, msg, number, addLog) => {
    // Verificar se é admin
    if (!isOwner(number)) {
      await sock.sendMessage(from, { text: '❌ Este comando só pode ser usado pelo dono do bot! 👑\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX' });
      return;
    }

    if (args.length < 2) {
      const message = formatMessage(
        'PROTEGER USUÁRIO',
        'Uso: /protect [tipo] [valor]\n\nTipos aceitos:\n• cpf\n• nome\n• telefone\n\nExemplos:\n/protect cpf 12345678900\n/protect nome João Silva\n/protect telefone 11999999999',
        { emoji: '🛡️' }
      );
      await sock.sendMessage(from, { text: message });
      return;
    }

    const type = args[0].toLowerCase();
    const value = args.slice(1).join(' ');

    if (!['cpf', 'nome', 'telefone'].includes(type)) {
      await sock.sendMessage(from, {
        text: '❌ Tipo inválido! Use: cpf, nome ou telefone\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX'
      });
      return;
    }

    try {
      const added = addToProtection(type, value);

      if (added) {
        const message = formatMessage(
          'PROTEÇÃO ADICIONADA',
          `✅ Usuário adicionado à lista de proteção!\n\n📋 **Tipo:** ${type.toUpperCase()}\n💎 **Valor:** ${value}\n\n🔒 Agora consultas para este valor serão bloqueadas.`,
          { emoji: '🛡️' }
        );
        await sock.sendMessage(from, { text: message });
        addLog(`🛡️ Proteção adicionada: ${type} - ${value}`);
      } else {
        await sock.sendMessage(from, {
          text: '⚠️ Este valor já está na lista de proteção!\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX'
        });
      }
    } catch (error) {
      await sock.sendMessage(from, {
        text: `❌ Erro ao adicionar proteção: ${error.message}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX`
      });
    }
  },

  unprotect: async (sock, from, args, msg, number, addLog) => {
    // Verificar se é admin
    if (!isOwner(number)) {
      await sock.sendMessage(from, { text: '❌ Este comando só pode ser usado pelo dono do bot! 👑\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX' });
      return;
    }

    if (args.length < 2) {
      const message = formatMessage(
        'REMOVER PROTEÇÃO',
        'Uso: /unprotect [tipo] [valor]\n\nTipos aceitos:\n• cpf\n• nome\n• telefone\n\nExemplos:\n/unprotect cpf 12345678900\n/unprotect nome João Silva\n/unprotect telefone 11999999999',
        { emoji: '🔓' }
      );
      await sock.sendMessage(from, { text: message });
      return;
    }

    const type = args[0].toLowerCase();
    const value = args.slice(1).join(' ');

    if (!['cpf', 'nome', 'telefone'].includes(type)) {
      await sock.sendMessage(from, {
        text: '❌ Tipo inválido! Use: cpf, nome ou telefone\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX'
      });
      return;
    }

    try {
      const removed = removeFromProtection(type, value);

      if (removed) {
        const message = formatMessage(
          'PROTEÇÃO REMOVIDA',
          `✅ Usuário removido da lista de proteção!\n\n📋 **Tipo:** ${type.toUpperCase()}\n💎 **Valor:** ${value}\n\n🔓 Agora consultas para este valor serão permitidas.`,
          { emoji: '🔓' }
        );
        await sock.sendMessage(from, { text: message });
        addLog(`🔓 Proteção removida: ${type} - ${value}`);
      } else {
        await sock.sendMessage(from, {
          text: '⚠️ Este valor não está na lista de proteção!\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX'
        });
      }
    } catch (error) {
      await sock.sendMessage(from, {
        text: `❌ Erro ao remover proteção: ${error.message}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX`
      });
    }
  },

  listprotect: async (sock, from, args, msg, number, addLog) => {
    // Verificar se é admin
    if (!isOwner(number)) {
      await sock.sendMessage(from, { text: '❌ Este comando só pode ser usado pelo dono do bot! 👑\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX' });
      return;
    }

    const type = args[0]?.toLowerCase() || 'all';

    if (!['cpf', 'nome', 'telefone', 'all'].includes(type)) {
      await sock.sendMessage(from, {
        text: '❌ Tipo inválido! Use: cpf, nome, telefone ou all\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX'
      });
      return;
    }

    try {
      const protected = listProtected(type);

      let message = formatMessage('LISTA DE PROTEÇÃO', '', { emoji: '📋' });

      if (type === 'all') {
        message += '\n🔒 **CPF:**\n';
        message += protected.cpf?.length ? protected.cpf.map(cpf => `• ${formatNumber(cpf, 'cpf')}`).join('\n') : 'Nenhum';

        message += '\n\n👤 **NOME:**\n';
        message += protected.nome?.length ? protected.nome.map(nome => `• ${nome}`).join('\n') : 'Nenhum';

        message += '\n\n📞 **TELEFONE:**\n';
        message += protected.telefone?.length ? protected.telefone.map(tel => `• ${formatNumber(tel, 'telefone')}`).join('\n') : 'Nenhum';
      } else {
        const typeEmoji = { cpf: '🔒', nome: '👤', telefone: '📞' };
        const typeLabel = { cpf: 'CPF', nome: 'NOME', telefone: 'TELEFONE' };
        message += `\n${typeEmoji[type]} **${typeLabel[type]}:**\n`;
        message += Array.isArray(protected) && protected.length
          ? protected.map(item => type === 'cpf' || type === 'telefone' ? `• ${formatNumber(item, type)}` : `• ${item}`).join('\n')
          : 'Nenhum';
      }

      message += '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX';

      await sock.sendMessage(from, { text: message });
    } catch (error) {
      await sock.sendMessage(from, {
        text: `❌ Erro ao listar proteções: ${error.message}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX`
      });
    }
  },

  broadcast: async (sock, from, args, msg, number, addLog) => {
    // Verificar se é admin
    if (!isOwner(number)) {
      await sock.sendMessage(from, { text: '❌ Este comando só pode ser usado pelo dono do bot! 👑\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX' });
      return;
    }

    if (args.length === 0) {
      const message = formatMessage(
        'BROADCAST',
        'Uso: /broadcast [mensagem]\n\n⚠️ Este comando envia a mensagem para TODOS os chats onde o bot está.\n\nExemplo:\n/broadcast Olá a todos! Nova atualização disponível!',
        { emoji: '📢' }
      );
      await sock.sendMessage(from, { text: message });
      return;
    }

    const message = args.join(' ');

    try {
      // Obter todos os chats
      const chats = await sock.groupFetchAllParticipating();
      const groups = Object.values(chats);

      let successCount = 0;
      let failCount = 0;

      for (const group of groups) {
        try {
          await sock.sendMessage(group.id, {
            text: `📢 **BROADCAST**\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${message}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX`
          });
          successCount++;
          await new Promise(resolve => setTimeout(resolve, 500)); // Delay para evitar spam
        } catch (err) {
          failCount++;
        }
      }

      const resultMessage = formatMessage(
        'BROADCAST ENVIADO',
        `✅ Mensagem enviada com sucesso!\n\n📊 **Estatísticas:**\n• Grupos enviados: ${successCount}\n• Falhas: ${failCount}\n\n📝 **Mensagem:**\n${message}`,
        { emoji: '📢' }
      );

      await sock.sendMessage(from, { text: resultMessage });
      addLog(`📢 Broadcast enviado: ${successCount} grupos`);

    } catch (error) {
      await sock.sendMessage(from, {
        text: `❌ Erro ao enviar broadcast: ${error.message}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX`
      });
    }
  },

  block: async (sock, from, args, msg, number, addLog) => {
    // Verificar se é admin
    if (!isOwner(number)) {
      await sock.sendMessage(from, { text: '❌ Este comando só pode ser usado pelo dono do bot! 👑\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX' });
      return;
    }

    if (args.length === 0) {
      const message = formatMessage(
        'BLOQUEAR NÚMERO',
        'Uso: /block [número]\n\nExemplo:\n/block 11999999999\n\n⚠️ O número não poderá mais usar o bot.',
        { emoji: '🚫' }
      );
      await sock.sendMessage(from, { text: message });
      return;
    }

    const targetNumber = args[0] + '@s.whatsapp.net';

    try {
      await sock.updateBlockStatus(targetNumber, 'block');

      const message = formatMessage(
        'NÚMERO BLOQUEADO',
        `✅ Número bloqueado com sucesso!\n\n📱 **Número:** ${args[0]}\n\n⚠️ Este usuário não poderá mais usar o bot.`,
        { emoji: '🚫' }
      );

      await sock.sendMessage(from, { text: message });
      addLog(`🚫 Número bloqueado: ${args[0]}`);

    } catch (error) {
      await sock.sendMessage(from, {
        text: `❌ Erro ao bloquear número: ${error.message}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX`
      });
    }
  },

  unblock: async (sock, from, args, msg, number, addLog) => {
    // Verificar se é admin
    if (!isOwner(number)) {
      await sock.sendMessage(from, { text: '❌ Este comando só pode ser usado pelo dono do bot! 👑\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX' });
      return;
    }

    if (args.length === 0) {
      const message = formatMessage(
        'DESBLOQUEAR NÚMERO',
        'Uso: /unblock [número]\n\nExemplo:\n/unblock 11999999999\n\n✅ O número poderá usar o bot novamente.',
        { emoji: '✅' }
      );
      await sock.sendMessage(from, { text: message });
      return;
    }

    const targetNumber = args[0] + '@s.whatsapp.net';

    try {
      await sock.updateBlockStatus(targetNumber, 'unblock');

      const message = formatMessage(
        'NÚMERO DESBLOQUEADO',
        `✅ Número desbloqueado com sucesso!\n\n📱 **Número:** ${args[0]}\n\n✅ Este usuário poderá usar o bot novamente.`,
        { emoji: '✅' }
      );

      await sock.sendMessage(from, { text: message });
      addLog(`✅ Número desbloqueado: ${args[0]}`);

    } catch (error) {
      await sock.sendMessage(from, {
        text: `❌ Erro ao desbloquear número: ${error.message}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX`
      });
    }
  },

  cleargroup: async (sock, from, args, msg, number, addLog) => {
    // Verificar se é admin
    if (!isOwner(number)) {
      await sock.sendMessage(from, { text: '❌ Este comando só pode ser usado pelo dono do bot! 👑\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX' });
      return;
    }

    // Verificar se é um grupo
    if (!from.endsWith('@g.us')) {
      await sock.sendMessage(from, {
        text: '❌ Este comando só funciona em grupos!\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX'
      });
      return;
    }

    try {
      await sock.chatModify({ clear: { messages: [] } }, from, []);

      const message = formatMessage(
        'GRUPO LIMPO',
        '✅ Mensagens do grupo limpas com sucesso!\n\n🧹 Todas as mensagens do bot foram removidas.',
        { emoji: '🧹' }
      );

      await sock.sendMessage(from, { text: message });
      addLog(`🧹 Grupo limpo: ${from}`);

    } catch (error) {
      await sock.sendMessage(from, {
        text: `❌ Erro ao limpar grupo: ${error.message}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX`
      });
    }
  },

  kick: async (sock, from, args, msg, number, addLog) => {
    // Verificar se é admin
    if (!isOwner(number)) {
      await sock.sendMessage(from, { text: '❌ Este comando só pode ser usado pelo dono do bot! 👑\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX' });
      return;
    }

    // Verificar se é um grupo
    if (!from.endsWith('@g.us')) {
      await sock.sendMessage(from, {
        text: '❌ Este comando só funciona em grupos!\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX'
      });
      return;
    }

    if (args.length === 0) {
      const message = formatMessage(
        'REMOVER PARTICIPANTE',
        'Uso: /kick @número\n\nExemplo:\n/kick @11999999999\n\n⚠️ Marque a pessoa que deseja remover.',
        { emoji: '👋' }
      );
      await sock.sendMessage(from, { text: message });
      return;
    }

    const target = args[0];

    try {
      const metadata = await sock.groupMetadata(from);
      const participants = metadata.participants;

      // Encontrar o participante
      const participant = participants.find(p =>
        p.id === target ||
        p.id === target.replace('@s.whatsapp.net', '') + '@s.whatsapp.net'
      );

      if (!participant) {
        await sock.sendMessage(from, {
          text: '❌ Participante não encontrado no grupo!\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX'
        });
        return;
      }

      await sock.groupParticipantsUpdate(from, [participant.id], 'remove');

      const message = formatMessage(
        'PARTICIPANTE REMOVIDO',
        `✅ Participante removido com sucesso!\n\n👤 **ID:** ${participant.id}\n\n👋 Ele foi removido do grupo.`,
        { emoji: '👋' }
      );

      await sock.sendMessage(from, { text: message });
      addLog(`👋 Participante removido: ${participant.id}`);

    } catch (error) {
      await sock.sendMessage(from, {
        text: `❌ Erro ao remover participante: ${error.message}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX`
      });
    }
  },

  add: async (sock, from, args, msg, number, addLog) => {
    // Verificar se é admin
    if (!isOwner(number)) {
      await sock.sendMessage(from, { text: '❌ Este comando só pode ser usado pelo dono do bot! 👑\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX' });
      return;
    }

    // Verificar se é um grupo
    if (!from.endsWith('@g.us')) {
      await sock.sendMessage(from, {
        text: '❌ Este comando só funciona em grupos!\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX'
      });
      return;
    }

    if (args.length === 0) {
      const message = formatMessage(
        'ADICIONAR PARTICIPANTE',
        'Uso: /add [número]\n\nExemplo:\n/add 11999999999\n\n✅ O número será adicionado ao grupo.',
        { emoji: '➕' }
      );
      await sock.sendMessage(from, { text: message });
      return;
    }

    const targetNumber = args[0] + '@s.whatsapp.net';

    try {
      await sock.groupParticipantsUpdate(from, [targetNumber], 'add');

      const message = formatMessage(
        'PARTICIPANTE ADICIONADO',
        `✅ Participante adicionado com sucesso!\n\n📱 **Número:** ${args[0]}\n\n✅ Ele foi adicionado ao grupo.`,
        { emoji: '➕' }
      );

      await sock.sendMessage(from, { text: message });
      addLog(`➕ Participante adicionado: ${args[0]}`);

    } catch (error) {
      await sock.sendMessage(from, {
        text: `❌ Erro ao adicionar participante: ${error.message}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX`
      });
    }
  },

  setstatus: async (sock, from, args, msg, number, addLog) => {
    // Verificar se é admin
    if (!isOwner(number)) {
      await sock.sendMessage(from, { text: '❌ Este comando só pode ser usado pelo dono do bot! 👑\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX' });
      return;
    }

    if (args.length === 0) {
      const message = formatMessage(
        'DEFINIR STATUS',
        'Uso: /setstatus [texto]\n\nExemplo:\n/setstatus Online e pronto para ajudar! 🤖\n\n✅ Define o status do bot.',
        { emoji: '📝' }
      );
      await sock.sendMessage(from, { text: message });
      return;
    }

    const status = args.join(' ');

    try {
      await sock.updateProfileStatus(status);

      const message = formatMessage(
        'STATUS ATUALIZADO',
        `✅ Status do bot atualizado com sucesso!\n\n📝 **Novo Status:**\n${status}\n\n✨ Status visível para todos!`,
        { emoji: '📝' }
      );

      await sock.sendMessage(from, { text: message });
      addLog(`📝 Status atualizado: ${status}`);

    } catch (error) {
      await sock.sendMessage(from, {
        text: `❌ Erro ao atualizar status: ${error.message}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX`
      });
    }
  },

  leave: async (sock, from, args, msg, number, addLog) => {
    // Verificar se é admin
    if (!isOwner(number)) {
      await sock.sendMessage(from, { text: '❌ Este comando só pode ser usado pelo dono do bot! 👑\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX' });
      return;
    }

    // Verificar se é um grupo
    if (!from.endsWith('@g.us')) {
      await sock.sendMessage(from, {
        text: '❌ Este comando só funciona em grupos!\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX'
      });
      return;
    }

    try {
      const message = formatMessage(
        'SAINDO DO GRUPO',
        '👋 O bot está saindo do grupo...\n\n✓ Obrigado por usar MutanoX-Bot!\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX',
        { emoji: '👋',
          showCredits: false }
      );

      await sock.sendMessage(from, { text: message });

      // Delay de 3 segundos antes de sair
      await new Promise(resolve => setTimeout(resolve, 3000));

      await sock.groupLeave(from);
      addLog(`👋 Saiu do grupo: ${from}`);

    } catch (error) {
      await sock.sendMessage(from, {
        text: `❌ Erro ao sair do grupo: ${error.message}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX`
      });
    }
  },

  restart: async (sock, from, args, msg, number, addLog) => {
    // Verificar se é admin
    if (!isOwner(number)) {
      await sock.sendMessage(from, { text: '❌ Este comando só pode ser usado pelo dono do bot! 👑\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX' });
      return;
    }

    try {
      const message = formatMessage(
        'REINICIANDO BOT',
        '🔄 O bot está sendo reiniciado...\n\n⏱️ Aguarde alguns segundos.\n✅ O bot estará disponível em breve.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX',
        { emoji: '🔄',
          showCredits: false }
      );

      await sock.sendMessage(from, { text: message });
      addLog('🔄 Reiniciando bot...');

      // Reiniciar o processo
      setTimeout(() => {
        process.exit(1);
      }, 3000);

    } catch (error) {
      await sock.sendMessage(from, {
        text: 'Erro ao reiniciar bot: ' + error.message
      });
    }
  },

  shutdown: async (sock, from, args, msg, number, addLog) => {
    // Verificar se e admin
    if (!isOwner(number)) {
      await sock.sendMessage(from, {
        text: 'Este comando so pode ser usado pelo dono do bot!'
      });
      return;
    }

    try {
      const message = formatMessage(
        'DESLIGANDO BOT',
        'O bot esta sendo desligado...',
        { emoji: '👋',
          showCredits: false }
      );

      await sock.sendMessage(from, { text: message });
      addLog('Desligando bot...');

      // Desligar o processo
      setTimeout(() => {
        process.exit(0);
      }, 3000);

    } catch (error) {
      await sock.sendMessage(from, {
        text: 'Erro ao desligar bot: ' + error.message
      });
    }
  }
};
