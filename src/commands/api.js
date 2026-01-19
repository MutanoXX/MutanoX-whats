const axios = require('axios');
const path = require('path');
const fs = require('fs');
const {
  isProtected,
  addCredits,
  formatMessage
} = require('../utils/helpers');

// Configuração de API key padrão
const DEFAULT_API_KEY = 'freeApikey';

module.exports = {
  // ========================================
  // ENDPOINT 1: BYPASS CLOUDFLARE
  // ========================================
  bypass: async (sock, from, args, msg, number, addLog) => {
    if (args.length === 0) {
      await sock.sendMessage(from, {
        text: '❌ Uso: /bypass [url]\n\nExemplo: /bypass https://lunaai.video/app\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX'
      });
      return;
    }

    const url = args[0];
    const siteKey = args[1] || '0x4AAAAAAAdJZmNxW54o-Gvd';
    const type = args[2] || 'turnstile-min';
    const proxy = args[3] || '';
    const apikey = args[4] || DEFAULT_API_KEY;

    try {
      await sock.sendMessage(from, {
        text: '⏳ Bypassando Cloudflare...'
      });

      const response = await axios.get(
        `https://anabot.my.id/api/tools/bypass?url=${encodeURIComponent(url)}&siteKey=${encodeURIComponent(siteKey)}&type=${encodeURIComponent(type)}&proxy=${encodeURIComponent(proxy)}&apikey=${encodeURIComponent(apikey)}`
      );

      const result = response.data;

      // Formatando resposta com ASCII art
      let formattedData = '';
      formattedData += `┌─────────────────────────┐\n`;
      formattedData += `│  🔓 Status: ${result.status || 'N/A'}\n`;
      formattedData += `│  🌐 URL: ${url}\n`;
      formattedData += `│  🔑 SiteKey: ${siteKey}\n`;
      formattedData += `│  📦 Type: ${type}\n`;
      if (result.token) {
        formattedData += `│  🎫 Token: ${result.token.substring(0, 30)}...\n`;
      }
      formattedData += `└─────────────────────────┘\n`;

      let message = formatMessage(
        'BYPASS CLOUDFLARE',
        formattedData,
        { emoji: '🔓' }
      );

      const imagePath = path.join(__dirname, '../../public/images/bypass.svg');
      if (fs.existsSync(imagePath)) {
        await sock.sendMessage(from, {
          image: fs.readFileSync(imagePath),
          caption: message
        });
      } else {
        await sock.sendMessage(from, { text: message });
      }

    } catch (error) {
      await sock.sendMessage(from, {
        text: `❌ Erro ao fazer bypass: ${error.message}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX`
      });
    }
  },

  // ========================================
  // ENDPOINT 2: INFO FF
  // ========================================
  infoff: async (sock, from, args, msg, number, addLog) => {
    if (args.length === 0) {
      await sock.sendMessage(from, {
        text: '❌ Uso: /infoff [id do jogador]\n\nExemplo: /infoff 8082446244\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX'
      });
      return;
    }

    const playerId = args[0];

    try {
      await sock.sendMessage(from, {
        text: '🎮 Buscando informações do jogador...'
      });

      const response = await axios.get(
        `https://world-ecletix.onrender.com/api/infoff?id=${playerId}`
      );

      const data = response.data;

      let message = formatMessage(
        'FREE FIRE - INFORMAÇÕES',
        `👤 **Dados Básicos:**
• Nickname: ${data.basicInfo?.nickname || 'N/A'}
• ID: ${data.basicInfo?.accountId || 'N/A'}
• Level: ${data.basicInfo?.level || 'N/A'}
• XP: ${data.basicInfo?.exp || 'N/A'}
• Region: ${data.basicInfo?.region || 'N/A'}

🏆 **Rankings:**
• Rank: ${data.basicInfo?.rank || 'N/A'}
• CS Rank: ${data.basicInfo?.csRank || 'N/A'}
• Likes: ${data.basicInfo?.liked || 'N/A'}

👥 **Clã:**
• Nome: ${data.clanBasicInfo?.clanName || 'N/A'}
• Membros: ${data.clanBasicInfo?.memberNum || 'N/A'}`,
        { emoji: '🎮' }
      );

      const imagePath = path.join(__dirname, '../../public/images/freefire.svg');
      if (fs.existsSync(imagePath)) {
        await sock.sendMessage(from, {
          image: fs.readFileSync(imagePath),
          caption: message
        });
      } else {
        await sock.sendMessage(from, { text: message });
      }

    } catch (error) {
      await sock.sendMessage(from, {
        text: `❌ Erro ao buscar informações: ${error.message}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX`
      });
    }
  },

  // ========================================
  // ENDPOINT 3: STALK DISCORD
  // ========================================
  stalkdiscord: async (sock, from, args, msg, number, addLog) => {
    if (args.length === 0) {
      await sock.sendMessage(from, {
        text: '❌ Uso: /stalkdiscord [id do usuário]\n\nExemplo: /stalkdiscord 123456789\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX'
      });
      return;
    }

    const userId = args[0];
    const apikey = args[1] || 'MutanoX';

    try {
      await sock.sendMessage(from, {
        text: '🔍 Buscando informações do Discord...'
      });

      const response = await axios.get(
        `https://anabot.my.id/api/tools/stalkDiscord?id=${encodeURIComponent(userId)}&apikey=${encodeURIComponent(apikey)}`
      );

      const result = response.data;

      // Formatando resposta com ASCII art
      let formattedData = '';

      // Informações básicas
      formattedData += `💜 **DADOS DO DISCORD**\n`;
      formattedData += `┌─────────────────────────┐\n`;
      if (result.username) {
        formattedData += `│  👤 Username: ${result.username}\n`;
      }
      if (result.globalName) {
        formattedData += `│  📛 Nome Global: ${result.globalName}\n`;
      }
      if (result.id) {
        formattedData += `│  🆔 ID: ${result.id}\n`;
      }
      formattedData += `└─────────────────────────┘\n\n`;

      // Informações adicionais
      if (result.createdAt) {
        formattedData += `📅 **DATA DE CRIAÇÃO**\n`;
        formattedData += `┌─────────────────────────┐\n`;
        formattedData += `│  📅 Criado em: ${result.createdAt}\n`;
        formattedData += `└─────────────────────────┘\n\n`;
      }

      if (result.avatar) {
        formattedData += `🖼️ **AVATAR**\n`;
        formattedData += `┌─────────────────────────┐\n`;
        formattedData += `│  🖼️ Avatar disponível\n`;
        formattedData += `└─────────────────────────┘\n\n`;
      }

      let message = formatMessage(
        'DISCORD - INFORMAÇÕES',
        formattedData,
        { emoji: '💜' }
      );

      const imagePath = path.join(__dirname, '../../public/images/discord.svg');
      if (fs.existsSync(imagePath)) {
        await sock.sendMessage(from, {
          image: fs.readFileSync(imagePath),
          caption: message
        });
      } else {
        await sock.sendMessage(from, { text: message });
      }

    } catch (error) {
      await sock.sendMessage(from, {
        text: `❌ Erro ao buscar informações: ${error.message}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX`
      });
    }
  },

  // ========================================
  // ENDPOINT 4: CHAT AI
  // ========================================
  ai: async (sock, from, args, msg, number, addLog) => {
    if (args.length === 0) {
      await sock.sendMessage(from, {
        text: '❌ Uso: /ai [sua pergunta]\n\nExemplo: /ai Qual o sentido da vida?\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX'
      });
      return;
    }

    const question = args.join(' ');
    const apikey = DEFAULT_API_KEY;

    try {
      await sock.sendMessage(from, {
        text: '🤖 Processando sua pergunta...'
      });

      const response = await axios.get(
        `https://anabot.my.id/api/ai/chat?question=${encodeURIComponent(question)}&apikey=${encodeURIComponent(apikey)}`
      );

      const result = response.data;

      let message = formatMessage(
        'MUTANOX AI',
        `❓ **Pergunta:** ${question}\n\n✨ **Resposta:**\n\n${result.response || result.message || JSON.stringify(result, null, 2)}`,
        { emoji: '🤖' }
      );

      const imagePath = path.join(__dirname, '../../public/images/ai.svg');
      if (fs.existsSync(imagePath)) {
        await sock.sendMessage(from, {
          image: fs.readFileSync(imagePath),
          caption: message
        });
      } else {
        await sock.sendMessage(from, { text: message });
      }

    } catch (error) {
      await sock.sendMessage(from, {
        text: `❌ Erro ao processar pergunta: ${error.message}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX`
      });
    }
  },

  // ========================================
  // ENDPOINT 5: PERPLEXITY AI
  // ========================================
  perplexity: async (sock, from, args, msg, number, addLog) => {
    if (args.length === 0) {
      await sock.sendMessage(from, {
        text: '❌ Uso: /perplexity [prompt]\n\nExemplo: /perplexity Clima hoje em São Paulo\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX'
      });
      return;
    }

    const prompt = args.join(' ');
    const apikey = DEFAULT_API_KEY;

    try {
      await sock.sendMessage(from, {
        text: '🔍 Buscando com Perplexity...'
      });

      const response = await axios.get(
        `https://anabot.my.id/api/ai/perplexity?prompt=${encodeURIComponent(prompt)}&apikey=${encodeURIComponent(apikey)}`
      );

      const result = response.data;

      let message = formatMessage(
        'PERPLEXITY AI',
        `❓ **Pesquisa:** ${prompt}\n\n📄 **Resultado:**\n\n${result.response || result.message || JSON.stringify(result, null, 2)}`,
        { emoji: '🔍' }
      );

      const imagePath = path.join(__dirname, '../../public/images/perplexity.svg');
      if (fs.existsSync(imagePath)) {
        await sock.sendMessage(from, {
          image: fs.readFileSync(imagePath),
          caption: message
        });
      } else {
        await sock.sendMessage(from, { text: message });
      }

    } catch (error) {
      await sock.sendMessage(from, {
        text: `❌ Erro na busca: ${error.message}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX`
      });
    }
  },

  // ========================================
  // ENDPOINT 6: BRAINLY
  // ========================================
  brainly: async (sock, from, args, msg, number, addLog) => {
    if (args.length === 0) {
      await sock.sendMessage(from, {
        text: '❌ Uso: /brainly [query]\n\nExemplo: /brainly matemática básica\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX'
      });
      return;
    }

    const query = args.join(' ');
    const apikey = DEFAULT_API_KEY;

    try {
      await sock.sendMessage(from, {
        text: '📚 Buscando no Brainly...'
      });

      const response = await axios.get(
        `https://anabot.my.id/api/search/brainly?query=${encodeURIComponent(query)}&apikey=${encodeURIComponent(apikey)}`
      );

      const result = response.data;

      // Formatando resposta com ASCII art
      let formattedData = '';
      formattedData += `📚 **RESULTADO BRAINLY**\n`;
      formattedData += `┌─────────────────────────┐\n`;
      formattedData += `│  ❓ Pesquisa: ${query}\n`;
      formattedData += `└─────────────────────────┘\n\n`;

      if (result.data && Array.isArray(result.data) && result.data.length > 0) {
        result.data.slice(0, 3).forEach((item, index) => {
          formattedData += `📝 **PERGUNTA ${index + 1}**\n`;
          formattedData += `┌─────────────────────────┐\n`;
          if (item.question) {
            formattedData += `│  ❓ Pergunta: ${item.question.substring(0, 100)}...\n`;
          }
          if (item.answers && item.answers.length > 0) {
            formattedData += `│  ✅ Respostas: ${item.answers.length}\n`;
          }
          formattedData += `└─────────────────────────┘\n\n`;
        });
      } else if (result.question) {
        formattedData += `📝 **PERGUNTA**\n`;
        formattedData += `┌─────────────────────────┐\n`;
        formattedData += `│  ❓ Pergunta: ${result.question.substring(0, 100)}...\n`;
        if (result.answers) {
          formattedData += `│  ✅ Respostas: ${result.answers.length || 'N/A'}\n`;
        }
        formattedData += `└─────────────────────────┘\n\n`;
      } else {
        formattedData += `❌ Nenhum resultado encontrado para a pesquisa.\n`;
      }

      let message = formatMessage(
        'BRAINLY',
        formattedData,
        { emoji: '📚' }
      );

      const imagePath = path.join(__dirname, '../../public/images/brainly.svg');
      if (fs.existsSync(imagePath)) {
        await sock.sendMessage(from, {
          image: fs.readFileSync(imagePath),
          caption: message
        });
      } else {
        await sock.sendMessage(from, { text: message });
      }

    } catch (error) {
      await sock.sendMessage(from, {
        text: `❌ Erro na busca: ${error.message}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX`
      });
    }
  },

  // ========================================
  // ENDPOINT 7: DOUYIN
  // ========================================
  douyin: async (sock, from, args, msg, number, addLog) => {
    if (args.length === 0) {
      await sock.sendMessage(from, {
        text: '❌ Uso: /douyin [query]\n\nExemplo: /douyin música viral\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX'
      });
      return;
    }

    const query = args.join(' ');
    const apikey = DEFAULT_API_KEY;

    try {
      await sock.sendMessage(from, {
        text: '🎬 Buscando vídeos Douyin...'
      });

      const response = await axios.get(
        `https://anabot.my.id/api/search/douyin?query=${encodeURIComponent(query)}&apikey=${encodeURIComponent(apikey)}`
      );

      const result = response.data;

      // Formatando resposta com ASCII art
      let formattedData = '';
      formattedData += `🎬 **VÍDEOS DOUYIN**\n`;
      formattedData += `┌─────────────────────────┐\n`;
      formattedData += `│  🔎 Busca: ${query}\n`;
      formattedData += `└─────────────────────────┘\n\n`;

      if (result.data && Array.isArray(result.data) && result.data.length > 0) {
        result.data.slice(0, 3).forEach((video, index) => {
          formattedData += `🎬 **VÍDEO ${index + 1}**\n`;
          formattedData += `┌─────────────────────────┐\n`;
          if (video.desc) {
            formattedData += `│  📝 Descrição: ${video.desc.substring(0, 80)}...\n`;
          }
          if (video.author) {
            formattedData += `│  👤 Autor: ${video.author.nickname || 'N/A'}\n`;
          }
          if (video.stats) {
            formattedData += `│  ❤️ Likes: ${video.stats.digg_count || 'N/A'}\n`;
            formattedData += `│  ▶️ Plays: ${video.stats.play_count || 'N/A'}\n`;
          }
          formattedData += `└─────────────────────────┘\n\n`;
        });
      } else if (result.title || result.desc) {
        formattedData += `🎬 **VÍDEO**\n`;
        formattedData += `┌─────────────────────────┐\n`;
        if (result.desc) {
          formattedData += `│  📝 Descrição: ${result.desc.substring(0, 80)}...\n`;
        }
        if (result.author && result.author.nickname) {
          formattedData += `│  👤 Autor: ${result.author.nickname}\n`;
        }
        if (result.stats) {
          formattedData += `│  ❤️ Likes: ${result.stats.digg_count || 'N/A'}\n`;
        }
        formattedData += `└─────────────────────────┘\n\n`;
      } else {
        formattedData += `❌ Nenhum vídeo encontrado para a busca.\n`;
      }

      let message = formatMessage(
        'DOUYIN',
        formattedData,
        { emoji: '🎬' }
      );

      const imagePath = path.join(__dirname, '../../public/images/douyin.svg');
      if (fs.existsSync(imagePath)) {
        await sock.sendMessage(from, {
          image: fs.readFileSync(imagePath),
          caption: message
        });
      } else {
        await sock.sendMessage(from, { text: message });
      }

    } catch (error) {
      await sock.sendMessage(from, {
        text: `❌ Erro na busca: ${error.message}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX`
      });
    }
  },

  // ========================================
  // ENDPOINT 8: CICI AI
  // ========================================
  cici: async (sock, from, args, msg, number, addLog) => {
    if (args.length === 0) {
      await sock.sendMessage(from, {
        text: '❌ Uso: /cici [prompt]\n\nExemplo: /cici Explique física quântica\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX'
      });
      return;
    }

    const prompt = args.join(' ');
    const apikey = DEFAULT_API_KEY;

    try {
      await sock.sendMessage(from, {
        text: '🤖 Cici AI processando...'
      });

      const response = await axios.get(
        `https://anabot.my.id/api/ai/cici?prompt=${encodeURIComponent(prompt)}&apikey=${encodeURIComponent(apikey)}`
      );

      const result = response.data;

      let message = formatMessage(
        'CICI AI',
        `❓ **Prompt:** ${prompt}\n\n✨ **Resposta:**\n\n${result.response || result.message || JSON.stringify(result, null, 2)}`,
        { emoji: '🤖' }
      );

      const imagePath = path.join(__dirname, '../../public/images/cici.svg');
      if (fs.existsSync(imagePath)) {
        await sock.sendMessage(from, {
          image: fs.readFileSync(imagePath),
          caption: message
        });
      } else {
        await sock.sendMessage(from, { text: message });
      }

    } catch (error) {
      await sock.sendMessage(from, {
        text: `❌ Erro ao processar: ${error.message}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX`
      });
    }
  },

  // ========================================
  // ENDPOINT 9: GITHUB SEARCH
  // ========================================
  github: async (sock, from, args, msg, number, addLog) => {
    if (args.length === 0) {
      await sock.sendMessage(from, {
        text: '❌ Uso: /github [username]\n\nExemplo: /github MutanoXX\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX'
      });
      return;
    }

    const username = args[0];
    const apikey = DEFAULT_API_KEY;

    try {
      await sock.sendMessage(from, {
        text: '💻 Buscando perfil GitHub...'
      });

      const response = await axios.get(
        `https://anabot.my.id/api/search/githubSearch?username=${encodeURIComponent(username)}&apikey=${encodeURIComponent(apikey)}`
      );

      const result = response.data;

      // Formatando resposta com ASCII art
      let formattedData = '';
      formattedData += `💻 **PERFIL GITHUB**\n`;
      formattedData += `┌─────────────────────────┐\n`;
      formattedData += `│  👤 Usuário: ${username}\n`;
      formattedData += `└─────────────────────────┘\n\n`;

      if (result.login) {
        formattedData += `👤 **DADOS BÁSICOS**\n`;
        formattedData += `┌─────────────────────────┐\n`;
        formattedData += `│  📛 Username: ${result.login}\n`;
        if (result.name) {
          formattedData += `│  ✍️ Nome: ${result.name}\n`;
        }
        if (result.bio) {
          formattedData += `│  📝 Bio: ${result.bio.substring(0, 60)}...\n`;
        }
        formattedData += `└─────────────────────────┘\n\n`;
      }

      if (result.public_repos !== undefined || result.followers !== undefined) {
        formattedData += `📊 **ESTATÍSTICAS**\n`;
        formattedData += `┌─────────────────────────┐\n`;
        if (result.public_repos !== undefined) {
          formattedData += `│  📦 Repos: ${result.public_repos}\n`;
        }
        if (result.followers !== undefined) {
          formattedData += `│  👥 Seguidores: ${result.followers}\n`;
        }
        if (result.following !== undefined) {
          formattedData += `│  ➕ Seguindo: ${result.following}\n`;
        }
        formattedData += `└─────────────────────────┘\n\n`;
      }

      if (result.created_at) {
        formattedData += `📅 **CONTAS**\n`;
        formattedData += `┌─────────────────────────┐\n`;
        const createdDate = new Date(result.created_at).toLocaleDateString('pt-BR');
        formattedData += `│  📅 Desde: ${createdDate}\n`;
        if (result.location) {
          formattedData += `│  📍 Localização: ${result.location}\n`;
        }
        formattedData += `└─────────────────────────┘\n\n`;
      }

      let message = formatMessage(
        'GITHUB',
        formattedData,
        { emoji: '💻' }
      );

      const imagePath = path.join(__dirname, '../../public/images/github.svg');
      if (fs.existsSync(imagePath)) {
        await sock.sendMessage(from, {
          image: fs.readFileSync(imagePath),
          caption: message
        });
      } else {
        await sock.sendMessage(from, { text: message });
      }

    } catch (error) {
      await sock.sendMessage(from, {
        text: `❌ Erro na busca: ${error.message}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX`
      });
    }
  },

  // ========================================
  // ENDPOINT 9 (ALT): FELO AI
  // ========================================
  felo: async (sock, from, args, msg, number, addLog) => {
    if (args.length === 0) {
      await sock.sendMessage(from, {
        text: '❌ Uso: /felo [prompt]\n\nExemplo: /felo História do Brasil\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX'
      });
      return;
    }

    const prompt = args.join(' ');
    const apikey = DEFAULT_API_KEY;

    try {
      await sock.sendMessage(from, {
        text: '🤖 Felo AI processando...'
      });

      const response = await axios.get(
        `https://anabot.my.id/api/ai/felo?prompt=${encodeURIComponent(prompt)}&apikey=${encodeURIComponent(apikey)}`
      );

      const result = response.data;

      let message = formatMessage(
        'FELO AI',
        `❓ **Prompt:** ${prompt}\n\n✨ **Resposta:**\n\n${result.response || result.message || JSON.stringify(result, null, 2)}`,
        { emoji: '🤖' }
      );

      const imagePath = path.join(__dirname, '../../public/images/felo.svg');
      if (fs.existsSync(imagePath)) {
        await sock.sendMessage(from, {
          image: fs.readFileSync(imagePath),
          caption: message
        });
      } else {
        await sock.sendMessage(from, { text: message });
      }

    } catch (error) {
      await sock.sendMessage(from, {
        text: `❌ Erro ao processar: ${error.message}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX`
      });
    }
  },

  // ========================================
  // ENDPOINT 10: JEEVES AI
  // ========================================
  jeeves: async (sock, from, args, msg, number, addLog) => {
    if (args.length === 0) {
      await sock.sendMessage(from, {
        text: '❌ Uso: /jeeves [prompt]\n\nExemplo: /jeeves Receita de bolo\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX'
      });
      return;
    }

    const prompt = args.join(' ');
    const apikey = DEFAULT_API_KEY;

    try {
      await sock.sendMessage(from, {
        text: '🤖 Jeeves AI processando...'
      });

      const response = await axios.get(
        `https://anabot.my.id/api/ai/chatJeeves?prompt=${encodeURIComponent(prompt)}&apikey=${encodeURIComponent(apikey)}`
      );

      const result = response.data;

      let message = formatMessage(
        'JEEVES AI',
        `❓ **Prompt:** ${prompt}\n\n✨ **Resposta:**\n\n${result.response || result.message || JSON.stringify(result, null, 2)}`,
        { emoji: '🤖' }
      );

      const imagePath = path.join(__dirname, '../../public/images/jeeves.svg');
      if (fs.existsSync(imagePath)) {
        await sock.sendMessage(from, {
          image: fs.readFileSync(imagePath),
          caption: message
        });
      } else {
        await sock.sendMessage(from, { text: message });
      }

    } catch (error) {
      await sock.sendMessage(from, {
        text: `❌ Erro ao processar: ${error.message}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX`
      });
    }
  },

  // ========================================
  // ENDPOINT 11: GOOGLE IMAGES
  // ========================================
  googleimg: async (sock, from, args, msg, number, addLog) => {
    if (args.length === 0) {
      await sock.sendMessage(from, {
        text: '❌ Uso: /googleimg [query]\n\nExemplo: /googleimg gato fofo\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX'
      });
      return;
    }

    const query = args.join(' ');
    const apikey = DEFAULT_API_KEY;

    try {
      await sock.sendMessage(from, {
        text: '🖼️ Buscando imagens...'
      });

      const response = await axios.get(
        `https://anabot.my.id/api/search/gimage?query=${encodeURIComponent(query)}&apikey=${encodeURIComponent(apikey)}`
      );

      const result = response.data;

      // Formatando resposta com ASCII art
      let formattedData = '';
      formattedData += `🖼️ **IMAGENS GOOGLE**\n`;
      formattedData += `┌─────────────────────────┐\n`;
      formattedData += `│  🔍 Busca: ${query}\n`;
      formattedData += `└─────────────────────────┘\n\n`;

      if (result.data && Array.isArray(result.data) && result.data.length > 0) {
        result.data.slice(0, 3).forEach((img, index) => {
          formattedData += `🖼️ **IMAGEM ${index + 1}**\n`;
          formattedData += `┌─────────────────────────┐\n`;
          if (img.title) {
            formattedData += `│  📝 Título: ${img.title.substring(0, 60)}...\n`;
          }
          if (img.url) {
            formattedData += `│  🔗 Link: ${img.url.substring(0, 50)}...\n`;
          }
          if (img.width || img.height) {
            formattedData += `│  📐 Tamanho: ${img.width || 'N/A'}x${img.height || 'N/A'}\n`;
          }
          formattedData += `└─────────────────────────┘\n\n`;
        });
      } else if (result.title || result.url) {
        formattedData += `🖼️ **IMAGEM**\n`;
        formattedData += `┌─────────────────────────┐\n`;
        if (result.title) {
          formattedData += `│  📝 Título: ${result.title.substring(0, 60)}...\n`;
        }
        if (result.url) {
          formattedData += `│  🔗 Link: ${result.url.substring(0, 50)}...\n`;
        }
        formattedData += `└─────────────────────────┘\n\n`;
      } else {
        formattedData += `❌ Nenhuma imagem encontrada para a busca.\n`;
      }

      let message = formatMessage(
        'GOOGLE IMAGES',
        formattedData,
        { emoji: '🖼️' }
      );

      const imagePath = path.join(__dirname, '../../public/images/google.svg');
      if (fs.existsSync(imagePath)) {
        await sock.sendMessage(from, {
          image: fs.readFileSync(imagePath),
          caption: message
        });
      } else {
        await sock.sendMessage(from, { text: message });
      }

    } catch (error) {
      await sock.sendMessage(from, {
        text: `❌ Erro na busca: ${error.message}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX`
      });
    }
  }
};
