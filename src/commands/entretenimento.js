const axios = require('axios');
const path = require('path');
const fs = require('fs');
const {
  addCredits,
  formatMessage
} = require('../utils/helpers');

module.exports = {
  // ========================================
  // WIKIPEDIA SEARCH
  // ========================================
  wikipedia: async (sock, from, args, msg, number, addLog) => {
    if (args.length === 0) {
      await sock.sendMessage(from, {
        text: '❌ Uso: /wikipedia [termo]\n\nExemplo: /wikipedia Brasil\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX'
      });
      return;
    }

    const query = args.join(' ');

    try {
      await sock.sendMessage(from, {
        text: '📚 Buscando na Wikipedia...'
      });

      const searchResponse = await axios.get(
        `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
      );

      const data = searchResponse.data;

      if (data.type === 'https://api.wikimedia.org/core/v1/wiki/missing/title') {
        await sock.sendMessage(from, {
          text: `❌ Artigo não encontrado na Wikipedia!\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX`
        });
        return;
      }

      let message = formatMessage(
        'WIKIPEDIA',
        `📖 **Título:** ${data.title}\n\n📝 **Resumo:**\n${data.extract || 'N/A'}\n\n🔗 **Link:** ${data.content_urls?.desktop?.page || 'N/A'}`,
        { emoji: '📚' }
      );

      const imagePath = path.join(__dirname, '../../public/images/wikipedia.svg');
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
  // PIADA ALEATÓRIA
  // ========================================
  piada: async (sock, from, args, msg, number, addLog) => {
    try {
      const piadas = [
        'Por que o computador foi ao médico? Porque estava com vírus! 🤣',
        'Qual é o cúmulo do cumulo? É o cumulo de dar! 😂',
        'O que o zero disse para o oito? Belo cinto! 🎀',
        'Por que o Batman não vai pescar? Porque Robin é um pássaro! 🐦',
        'Qual é o contrário de volátil? Vem lá tátil! 🤣',
        'Para onde vai o cão quando perde o rabo? Para o dono-tólogo! 🐕',
        'O que um feijão disse para o outro? Tô cheio de graça! 🫘',
        'Por que o robô foi prestar contas? Porque devia aos sensores! 🤖',
        'Qual é o colírio que o chinês usa? Olho de peca! 👀',
        'O que o tijolo disse para o outro? Tá um tijolo aqui! 🧱'
      ];

      const piada = piadas[Math.floor(Math.random() * piadas.length)];

      const message = formatMessage(
        'PIADA ALEATÓRIA',
        `${piada}\n\n😂 Espero que tenha gostado!`,
        { emoji: '😂' }
      );

      const imagePath = path.join(__dirname, '../../public/images/piada.svg');
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
        text: `❌ Erro ao carregar piada: ${error.message}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX`
      });
    }
  },

  // ========================================
  // MEME ALEATÓRIO
  // ========================================
  meme: async (sock, from, args, msg, number, addLog) => {
    try {
      await sock.sendMessage(from, {
        text: '🎭 Buscando meme...'
      });

      const response = await axios.get('https://meme-api.herokuapp.com/gimme/wholesomememes');

      if (response.data && response.data.url) {
        const message = formatMessage(
          'MEME ALEATÓRIO',
          '😂 Aqui está um meme para você!\n\n🎭 Divirta-se!',
          { emoji: '🎭' }
        );

        await sock.sendMessage(from, {
          image: { url: response.data.url },
          caption: message
        });
      } else {
        await sock.sendMessage(from, {
          text: '❌ Não foi possível carregar um meme. Tente novamente!\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX'
        });
      }

    } catch (error) {
      await sock.sendMessage(from, {
        text: `❌ Erro ao carregar meme: ${error.message}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX`
      });
    }
  },

  // ========================================
  // FRASE MOTIVACIONAL
  // ========================================
  frase: async (sock, from, args, msg, number, addLog) => {
    try {
      await sock.sendMessage(from, {
        text: '💭 Carregando frase...'
      });

      const response = await axios.get('https://api.quotable.io/random');

      const quote = response.data;

      const message = formatMessage(
        'FRASE DO DIA',
        `💭 "${quote.content}"\n\n✍️ - ${quote.author || 'Desconhecido'}`,
        { emoji: '💭' }
      );

      const imagePath = path.join(__dirname, '../../public/images/frase.svg');
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
        text: `❌ Erro ao carregar frase: ${error.message}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX`
      });
    }
  },

  // ========================================
  // CLIMA
  // ========================================
  clima: async (sock, from, args, msg, number, addLog) => {
    if (args.length === 0) {
      await sock.sendMessage(from, {
        text: '❌ Uso: /clima [cidade]\n\nExemplo: /clima São Paulo\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX'
      });
      return;
    }

    const cidade = args.join(' ');

    try {
      await sock.sendMessage(from, {
        text: '🌤️ Buscando clima...'
      });

      // Usando API wttr.in que aceita nome da cidade
      const response = await axios.get(
        'https://wttr.in/' + encodeURIComponent(cidade) + '?format=j1'
      );

      const data = response.data;

      // Verificar se a cidade existe
      if (!data.current_condition) {
        await sock.sendMessage(from, {
          text: `❌ Cidade não encontrada!\n\nVerifique o nome e tente novamente.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX`
        });
        return;
      }

      const current = data.current_condition[0];
      const area = data.nearest_area[0];

      const temp = Math.round(current.temp_C);
      const vento = Math.round(current.windspeedKmph);
      const umidade = current.humidity;
      const sensacao = Math.round(current.FeelsLikeC);
      const descricao = current.weatherDesc[0]?.value || 'N/A';

      let formattedData = '';
      formattedData += `🌍 **LOCALIZAÇÃO**\n`;
      formattedData += `┌─────────────────────────┐\n`;
      formattedData += `│  📍 Cidade: ${area.areaName[0]?.value || cidade}\n`;
      formattedData += `│  🗺 Estado: ${area.region[0]?.value || 'N/A'}\n`;
      formattedData += `│  🌐 País: ${area.country[0]?.value || 'N/A'}\n`;
      formattedData += `└─────────────────────────┘\n\n`;

      formattedData += `🌡️ **CLIMA ATUAL**\n`;
      formattedData += `┌─────────────────────────┐\n`;
      formattedData += `│  🌡️ Temperatura: ${temp}°C\n`;
      formattedData += `│  🌡️ Sensação: ${sensacao}°C\n`;
      formattedData += `│  📝 Descrição: ${descricao}\n`;
      formattedData += `└─────────────────────────┘\n\n`;

      formattedData += `📊 **DETALHES**\n`;
      formattedData += `┌─────────────────────────┐\n`;
      formattedData += `│  💧 Umidade: ${umidade}%\n`;
      formattedData += `│  💨 Vento: ${vento} km/h\n`;
      formattedData += `│  🌅 UV: ${current.uvIndex || 'N/A'}\n`;
      formattedData += `└─────────────────────────┘\n`;

      let message = formatMessage(
        'CLIMA',
        formattedData,
        { emoji: '🌤️' }
      );

      const imagePath = path.join(__dirname, '../../public/images/clima.svg');
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
        text: `❌ Erro ao buscar clima: ${error.message}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Bot por @MutanoX`
      });
    }
  }
};

function getWeatherDescription(temp) {
  if (temp < 10) return '🥶 Muito frio';
  if (temp < 20) return '🧥 Frio';
  if (temp < 25) return '😌 Agradável';
  if (temp < 30) return '😎 Quente';
  if (temp < 35) return '🥵 Muito quente';
  return '🔥 Escaldante';
}
