# MutanoX-Bot Premium v2.2.0 🤖

Bot WhatsApp Premium com interface web avançada, múltiplos comandos, sistema de proteção, comandos admin e integração com APIs públicas de IA.

![MutanoX-Bot](https://img.shields.io/badge/Version-2.2.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 Novidades na v2.2.0

### ✨ MELHORIAS PRINCIPAIS

#### 🛡️ Sistema de Proteção com Bloqueio de Teste
- **Proteção de credenciais**: Sistema não exibe dados de teste para usuários
- **Credenciais ocultas**:
  - CPF: 743.020.511-91
  - Nome: ALAN FILIPY FIDELIS COELHO
  - Telefone: 65999701064
- **Mensagens personalizadas**: "Esse usuário é protegido pelo sistema MutanoX"
- **Logs de tentativas**: Auditoria completa de acessos

#### 📇 Consultas Totalmente Reformuladas
- **Respostas decoradas**: Formatadas em ASCII art premium
- **Sem JSON cru**: Dados organizados em boxes estruturados
- **Formatação inteligente**: CPF, CNPJ, telefone, CEP
- **Mensagens de erro**melhoradas e informativas
- **Organização visual**: Emojis e divisores elegantes

#### 👑 Novo Comando: /menu-adm
- **Comando exclusivo admin**: Só dono pode executar
- **Menu organizado**: Todos os comandos admin listados
- **Decoração premium**: Design profissional

#### 💳 Créditos Automáticos
- **@MutanoX em todas as respostas**: Footer padrão implementado
- **Divisor visual**: `━━━━━━━━━━━━━━━━━━━━━━━━━`
- **Função addCredits()**: Automática em todos comandos

---

## 🌟 Características Completas

### ✨ Interface Web Premium
- Painel de controle em tempo real
- QR Code dinâmico para conexão
- Dashboard com estatísticas avançadas
- Design moderno com gradientes e animações
- Sistema de logs em tempo real
- Totalmente responsivo

### 🤖 Múltiplas IAs Integradas
- **Gemini AI** - Chat avançado
- **Perplexity AI** - Pesquisa web
- **Cici AI** - Assistente virtual
- **Felo AI** - Busca inteligente
- **Jeeves AI** - Mordomo digital

### 🛡️ Sistema de Proteção Completo
- Proteção para CPF, nome e telefone
- Bloqueio automático de credenciais de teste
- Logs de tentativas de acesso
- Contador de protegidos no dashboard
- Mensagens personalizadas de bloqueio

### 👑 Sistema Admin Exclusivo
- **Comando /menu-adm**: Lista comandos admin
- **Gerenciamento de proteção**: Adicionar, remover, listar
- **Controle de grupos**: Broadcast, kick, add, leave
- **Bloqueio**: Bloquear/desbloquear usuários
- **Sistema**: Restart, shutdown, set status

### 🔍 Consultas Avançadas
- **CPF** - Com proteção e validação
- **CNPJ** - Dados completos da empresa
- **Telefone** - Com proteção
- **Nome** - Com proteção
- **CEP** - Endereço completo
- **Wikipedia** - Artigos enciclopédicos

### 🎮 Games Info
- **Free Fire** - Estatísticas completas do jogador
- Nickname, level, XP, rankings
- Informações de clã

### 🔧 Ferramentas
- **Bypass Cloudflare** - Contorna proteção
- **Stalk Discord** - Informações de usuário
- **GitHub Profile** - Dados do desenvolvedor
- **Google Images** - Busca de imagens

### 🎉 Entretenimento
- **Piadas** - Piadas aleatórias
- **Memes** - Memes da internet
- **Frases** - Frases motivacionais
- **Clima** - Dados climáticos

### 📚 Busca e Pesquisa
- **Brainly** - Q&A educacional
- **Douyin** - Vídeos virais

### 📊 Sistema
- **Dashboard**: Estatísticas em tempo real
- **Logs**: Sistema completo de logs
- **Status**: Monitoramento do sistema
- **Ping**: Teste de latência

---

## 📋 Requisitos

- Node.js 18+ ou Bun
- NPM ou Yarn
- Conexão com internet

## 🚀 Instalação

```bash
# Clonar repositório
git clone https://github.com/MutanoXX/MutanoX-whats.git
cd MutanoX-whats

# Instalar dependências
npm install

# Configurar o bot
# Edite o arquivo config.js e adicione seu número como dono

# Iniciar o bot
npm start
```

## ⚙️ Configuração

### Número do Dono

Edite `config.js` e configure o número do dono:

```javascript
owner: {
  numbers: ['5511999999999'],  // Seu número com código do país
  name: 'MutanoX',
  nickname: '👑 MutanoX'
}
```

### Porta
Por padrão, o bot usa a porta `8080`. Para alterar:

```bash
PORT=3000 npm start
```

### Ambiente de Produção (Discloud)

O arquivo `discloud.config` já está configurado:

```
ID=mutano-x-99
TYPE=site
MAIN=index.js
NAME=MutanoX-Premium
RAM=512
VERSION=latest
AUTORESTART=true
APT=tools
START=node index.js
```

## 🌐 Acesso Web

Após iniciar o bot, acesse:

```
http://localhost:8080
```

O painel web mostrará:
- QR Code para conectar o WhatsApp
- Status do bot em tempo real
- Estatísticas detalhadas
- Usuários protegidos
- Logs do sistema em tempo real

---

## 📚 Comandos Disponíveis

Todos os comandos usam o prefixo `/`

### 👑 COMANDOS ADMIN

#### `/menu-adm` ⭐ NOVO!
Lista todos os comandos admin (só dono)

#### `/protect [cpf|nome|telefone] [valor]`
Protege um usuário de consultas

```
Exemplo: /protect cpf 12345678900
```

#### `/unprotect [cpf|nome|telefone] [valor]`
Remove proteção de um usuário

```
Exemplo: /unprotect cpf 12345678900
```

#### `/listprotect [cpf|nome|telefone|all]`
Lista todos os usuários protegidos

```
Exemplo: /listprotect cpf
```

#### `/broadcast [mensagem]`
Envia mensagem para todos os grupos

#### `/block [número]`
Bloqueia um número

#### `/unblock [número]`
Desbloqueia um número

#### `/cleargroup`
Limpa mensagens do bot no grupo

#### `/kick @usuario`
Remove um participante

#### `/add [número]`
Adiciona um participante

#### `/setstatus [texto]`
Define o status do bot

#### `/leave`
Sai do grupo atual

#### `/restart`
Reinicia o bot

#### `/shutdown`
Desliga o bot

---

### 🤖 INTELIGÊNCIA ARTIFICIAL

#### `/ai [pergunta]`
Chat com Gemini AI

```
Exemplo: /ai Qual o sentido da vida?
```

#### `/perplexity [pergunta]`
Pesquisa com Perplexity AI

```
Exemplo: /perplexity Clima hoje em São Paulo
```

#### `/cici [pergunta]`
Chat com Cici AI

```
Exemplo: /cici Explique física quântica
```

#### `/felo [pergunta]`
Chat com Felo AI

```
Exemplo: /felo História do Brasil
```

#### `/jeeves [pergunta]`
Chat com Jeeves AI

```
Exemplo: /jeeves Receita de bolo
```

---

### 🔍 CONSULTAS (COM PROTEÇÃO)

#### `/cpf [cpf]`
Consulta dados de CPF (formatado, sem JSON)

```
Exemplo: /cpf 12345678900
```

⚠️ **Credenciais de teste são bloqueadas:**
- CPF: 743.020.511-91
- Nome: ALAN FILIPY FIDELIS COELHO
- Telefone: 65999701064

#### `/telefone [número]`
Consulta informações de telefone (formatado)

```
Exemplo: /telefone 11999999999
```

#### `/nome [nome completo]`
Consulta por nome completo (formatado)

```
Exemplo: /nome João Silva
```

#### `/cnpj [cnpj]`
Consulta dados de CNPJ (formatado)

```
Exemplo: /cnpj 12345678000190
```

#### `/cep [cep]`
Consulta endereço pelo CEP (formatado)

```
Exemplo: /cep 01310-100
```

#### `/wikipedia [termo]`
Busca na Wikipedia

```
Exemplo: /wikipedia Brasil
```

---

### 🎮 GAMES

#### `/infoff [id]`
Informações de jogador Free Fire

```
Exemplo: /infoff 8082446244
```

---

### 🔧 FERRAMENTAS

#### `/bypass [url] [type]`
Contorna proteção Cloudflare

```
Exemplo: /bypass https://site.com turnstile-min
```

#### `/stalkdiscord [id]`
Stalk Discord

```
Exemplo: /stalkdiscord 123456789
```

#### `/github [username]`
Pesquisa perfil no GitHub

```
Exemplo: /github MutanoXX
```

#### `/googleimg [query]`
Busca imagens no Google

```
Exemplo: /googleimg gato fofo
```

---

### 🎉 ENTRETENIMENTO

#### `/piada`
Piada aleatória

#### `/meme`
Meme aleatório

#### `/frase`
Frase motivacional

#### `/clima [cidade]`
Clima da cidade

---

### 📚 BUSCA E PESQUISA

#### `/brainly [query]`
Buscar perguntas no Brainly

#### `/douyin [query]`
Buscar vídeos Douyin

---

### 📊 SISTEMA

#### `/menu`
Exibe o menu de comandos (admin vê comandos admin)

#### `/help`
Ajuda detalhada de todos os comandos

#### `/ping`
Testa a latência do bot

#### `/status`
Mostra o status atual do bot

---

## 🏗️ Estrutura do Projeto

```
MutanoX-whats/
├── config.js                    ⚙️ Configurações (DONO)
├── index.js                     🚀 Ponto de entrada
├── discloud.config              📦 Config Deploy
├── data/
│   └── protection.json          🛡️ Usuários protegidos
├── src/
│   ├── commands/
│   │   ├── index.js            👑 Admin + Sistema
│   │   ├── api.js              🔌 APIs externas
│   │   ├── consultas.js        🔍 Consultas (com proteção)
│   │   └── entretenimento.js   🎉 Entretenimento
│   └── utils/
│       ├── filterLogs.js
│       ├── waitMessage.js
│       ├── auditEvents.js
│       └── helpers.js          🛠️ Funções auxiliares
├── public/
│   ├── index.html               🌐 Dashboard premium
│   ├── js/dashboard.js          📊 JavaScript
│   └── images/                 🎨 21 imagens SVG
├── sessions/                   📱 Sessões WhatsApp
└── logs/                       📋 Logs do sistema
```

## 🛡️ Sistema de Proteção

O sistema de proteção permite bloquear consultas para CPFs, nomes e telefones específicos.

### Proteger um Usuário

```
/protect cpf 12345678900
/protect nome João Silva
/protect telefone 11999999999
```

### Listar Protegidos

```
/listprotect cpf
/listprotect nome
/listprotect telefone
/listprotect all
```

### Remover Proteção

```
/unprotect cpf 12345678900
/unprotect nome João Silva
/unprotect telefone 11999999999
```

### Como Funciona

1. O dono adiciona um CPF, nome ou telefone à lista de proteção
2. Quando alguém tenta consultar um valor protegido
3. O bot retorna: "❌ Esse usuário é protegido pelo sistema MutanoX 🛡️"
4. A tentativa é logada para auditoria

### Bloqueio de Testes

As seguintes credenciais são usadas para testes internos e **não são exibidas**:
- **CPF**: 743.020.511-91
- **Nome**: ALAN FILIPY FIDELIS COELHO
- **Telefone**: 65999701064

Ao tentar consultar essas credenciais, o sistema retorna:
```
❌ Este número é usado para testes internos do sistema.

Por favor, utilize outros dados para testar as consultas.
```

---

## 🔧 Configuração

### Porta
Por padrão, o bot usa a porta `8080`. Para alterar:

```bash
PORT=3000 npm start
```

### Número do Dono
Edite `config.js` e adicione seu número:

```javascript
owner: {
  numbers: ['5511999999999'],  // Seu número
  name: 'MutanoX',
  nickname: '👑 MutanoX'
}
```

### Ambiente de Produção (Discloud)

O arquivo `discloud.config` já está configurado:

```
ID=mutano-x-99
TYPE=site
MAIN=index.js
NAME=MutanoX-Premium
RAM=512
VERSION=latest
AUTORESTART=true
APT=tools
START=node index.js
```

## 📡 APIs Integradas

O bot integra com as seguintes APIs públicas:

1. **Anabot API** - Múltiplas ferramentas e IAs
2. **World-Ecletix API** - Consultas brasileiras
3. **ViaCEP** - Consulta de CEP
4. **CNPJ.ws** - Consulta de CNPJ
5. **Google Search** - Busca de imagens
6. **GitHub API** - Perfis de desenvolvedores
7. **Wikipedia API** - Artigos da Wikipedia
8. **Quotable API** - Frases motivacionais
9. **Meme API** - Memes aleatórios
10. **Open-Meteo** - Dados climáticos
11. **Multiple AI Services** - Gemini, Perplexity, Cici, Felo, Jeeves

## 🎨 Dashboard

O dashboard web foi totalmente aprimorado com:

✨ **Novos Recursos:**
- Design premium com gradientes e animações
- Estatísticas em tempo real
- Contador de usuários protegidos
- Logs em tempo real
- Status badges animados
- Interface responsiva
- Auto-scroll nos logs
- Animações suaves
- Cards com hover effects

📊 **Informações Exibidas:**
- Status do bot
- Conexão WhatsApp
- Tempo online
- Mensagens processadas
- Comandos usados
- **Usuários protegidos**
- Início da sessão
- QR Code em tempo real

## 💳 Créditos

Todas as respostas do bot incluem automaticamente:

```
━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Bot por @MutanoX
```

Isso é aplicado em todos os comandos, garantindo que @MutanoX seja creditado.

## 🛠️ Desenvolvimento

### Adicionar Novo Comando

1. Escolha o arquivo apropriado:
   - `commands/index.js` - Comandos admin e sistema
   - `commands/api.js` - Comandos de APIs externas
   - `commands/consultas.js` - Comandos de consultas (com proteção)
   - `commands/entretenimento.js` - Comandos de entretenimento

2. Adicione uma nova função exportada:

```javascript
module.exports = {
  // Comandos existentes...

  novocomando: async (sock, from, args, msg, number, addLog, updateStats) => {
    // Sua lógica aqui
    const message = formatMessage(
      'TÍTULO',
      'Conteúdo da mensagem',
      { emoji: '🎉' }
    );
    await sock.sendMessage(from, { text: message });
  }
};
```

3. Use o comando com `/novocomando`

### Sistema de Eventos

Os eventos são gerenciados em `src/events.js`:

- `messages.upsert` - Novas mensagens
- `connection.update` - Atualizações de conexão
- `creds.update` - Atualizações de credenciais

## 🐛 Troubleshooting

### Bot não conecta

1. Verifique se a pasta `sessions` existe
2. Delete a pasta `sessions/mutanox-bot`
3. Reinicie o bot e escaneie o QR Code novamente

### QR Code não aparece

1. Acesse http://localhost:8080
2. Aguarde o QR Code aparecer no painel
3. Escaneie com o WhatsApp

### Comandos não funcionam

- Certifique-se de usar o prefixo `/`
- Verifique se o nome do comando está correto
- Use `/menu` para ver comandos disponíveis

### Comandos Admin não funcionam

- Verifique se seu número está configurado em `config.js`
- Use o número completo com código do país (ex: 5511999999999)
- Reinicie o bot após alterar `config.js`

## 📝 Logs

Os logs são salvos em `bot/logs/bot.log` e podem ser visualizados:

- No painel web (aba Logs)
- No arquivo de log
- No console do terminal

## 🔒 Segurança

- As credenciais do WhatsApp são salvas localmente
- Não há compartilhamento de dados com terceiros
- As APIs usadas são públicas e gratuitas
- Sistema de proteção para bloquear consultas indesejadas
- Logs de tentativas de consultas bloqueadas
- Bloqueio de credenciais de teste

## 📄 Licença

MIT License - Veja o arquivo LICENSE para detalhes

## 👥 Autores

- **MutanoX Team** - Desenvolvimento principal

## 🙏 Agradecimentos

- Baileys Framework
- Anabot API
- World-Ecletix API
- Todas as APIs de IA integradas
- APIs públicas utilizadas

## 📞 Suporte

Para suporte e dúvidas:

- GitHub Issues
- Documentação oficial

## 🔄 Histórico de Atualizações

### Versão 2.2.0
- ✨ Comando `/menu-adm` exclusivo para admin
- 🛡️ Sistema de proteção com bloqueio de credenciais de teste
- 📇 Consultas reformuladas com formatação em ASCII art
- 📊 Respostas sem JSON cru - dados organizados
- 💳 Créditos @MutanoX automáticos em todas as respostas
- 🎨 Dashboard premium mantido
- 🔒 Bloqueio de credenciais de teste (CPF, nome, telefone)
- 🛠️ Funções auxiliares melhoradas

### Versão 2.1.0
- ✨ Sistema de proteção para CPF, nome, telefone
- 👑 Sistema admin com múltiplos comandos
- 🎮 Novos comandos de entretenimento
- 🔍 Novas consultas (CNPJ, CEP, Wikipedia)
- 📊 Dashboard aprimorado com contador de protegidos
- 💳 Créditos @MutanoX em todas as respostas
- 🎨 Novas imagens e ícones SVG
- 🎨 Interface web premium com animações

### Versão 2.0.0
- ✨ Interface web completa
- Integração com Socket.io
- 5+ serviços de IA
- Sistema de logs em tempo real
- Dashboard com estatísticas
- Múltiplos comandos de consulta
- Suporte a Discloud

---

**🔥 MutanoX-Bot Premium v2.2.0 - O bot mais completo do Brasil!**

💡 **Criado com ❤️ por @MutanoX**
