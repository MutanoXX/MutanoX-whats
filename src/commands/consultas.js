const axios = require('axios');
const path = require('path');
const fs = require('fs');
const {
  isProtected,
  addCredits,
  formatMessage,
  formatNumber,
  validateCPF,
  formatCPF,
  formatCNPJ,
  formatTelefone,
  isTestCredential
} = require('../utils/helpers');

// Configuração de API key padrão
const DEFAULT_API_KEY = 'freeApikey';

// Credenciais de teste para ocultar
const TEST_CREDENTIALS = {
  cpf: '74302051191',
  nome: 'ALAN FILIPY FIDELIS COELHO',
  telefone: '65999701064'
};

// Funções auxiliares de formatação
function formatCPFResponse(data, cpf) {
  if (!data || !data.resultado) {
    return '📭 Dados não disponíveis para este CPF.';
  }

  const resultado = data.resultado;
  let message = '';

  // Dados básicos
  if (resultado.basicInfo) {
    message += `👤 **DADOS PESSOAIS**\n`;
    message += `┌─────────────────────────┐\n`;
    message += `│  👤 Nome: ${resultado.basicInfo.nome || 'Não informado'}\n`;
    message += `│  🆔 CPF: ${formatCPF(cpf)}\n`;
    if (resultado.basicInfo.dataNascimento) {
      message += `│  🎂 Nasc: ${resultado.basicInfo.dataNascimento}\n`;
    }
    if (resultado.basicInfo.sexo) {
      message += `│  ⚧ Sexo: ${resultado.basicInfo.sexo}\n`;
    }
    message += `└─────────────────────────┘\n\n`;
  }

  // Endereço
  if (resultado.enderecos && resultado.enderecos.length > 0) {
    message += `📍 **ENDEREÇO**\n`;
    const endereco = resultado.enderecos[0];
    message += `┌─────────────────────────┐\n`;
    message += `│  🏠 Logradouro: ${endereco.logradouro || 'Não informado'}\n`;
    message += `│  🔢 Número: ${endereco.numero || 'Não informado'}\n`;
    message += `│  🏘 Bairro: ${endereco.bairro || 'Não informado'}\n`;
    message += `│  🏙 Cidade: ${endereco.cidade || 'Não informado'}\n`;
    message += `│  🗺 Estado: ${endereco.uf || 'Não informado'}\n`;
    message += `│  📮 CEP: ${endereco.cep || 'Não informado'}\n`;
    message += `└─────────────────────────┘\n\n`;
  }

  // Status cadastral
  if (resultado.basicInfo && resultado.basicInfo.situacaoCadastral) {
    message += `📋 **SITUAÇÃO CADASTRAL**\n`;
    message += `┌─────────────────────────┐\n`;
    message += `│  ✓ Status: ${resultado.basicInfo.situacaoCadastral}\n`;
    message += `└─────────────────────────┘\n\n`;
  }

  return message;
}

function formatNomeResponse(data, nome) {
  if (!data || !data.resultado) {
    return '📭 Dados não disponíveis para este nome.';
  }

  const resultado = data.resultado;
  let message = '';

  // Dados básicos
  message += `👤 **DADOS PESSOAIS**\n`;
  message += `┌─────────────────────────┐\n`;
  message += `│  👤 Nome: ${nome}\n`;
  if (resultado.cpf) {
    message += `│  🆔 CPF: ${formatCPF(resultado.cpf)}\n`;
  }
  if (resultado.dataNascimento) {
    message += `│  🎂 Nasc: ${resultado.dataNascimento}\n`;
  }
  if (resultado.sexo) {
    message += `│  ⚧ Sexo: ${resultado.sexo}\n`;
  }
  message += `└─────────────────────────┘\n\n`;

  // Endereço
  if (resultado.endereco) {
    message += `📍 **ENDEREÇO**\n`;
    message += `┌─────────────────────────┐\n`;
    message += `│  🏠 ${resultado.endereco.logradouro || ''}\n`;
    message += `│  ${resultado.endereco.numero || ''}\n`;
    message += `│  ${resultado.endereco.bairro || ''}\n`;
    message += `│  ${resultado.endereco.cidade || ''}-${resultado.endereco.uf || ''}\n`;
    message += `│  ${resultado.endereco.cep || ''}\n`;
    message += `└─────────────────────────┘\n\n`;
  }

  return message;
}

function formatTelefoneResponse(data, telefone) {
  if (!data || !data.resultado) {
    return '📭 Dados não disponíveis para este telefone.';
  }

  const resultado = data.resultado;
  let message = '';

  // Dados básicos
  message += `📞 **DADOS TELEFÔNICOS**\n`;
  message += `┌─────────────────────────┐\n`;
  message += `│  📞 Telefone: ${formatTelefone(telefone)}\n`;
  if (resultado.nome) {
    message += `│  👤 Nome: ${resultado.nome}\n`;
  }
  if (resultado.cpf) {
    message += `│  🆔 CPF: ${formatCPF(resultado.cpf)}\n`;
  }
  if (resultado.dataNascimento) {
    message += `│  🎂 Nasc: ${resultado.dataNascimento}\n`;
  }
  message += `└─────────────────────────┘\n\n`;

  // Endereço
  if (resultado.endereco) {
    message += `📍 **ENDEREÇO**\n`;
    message += `┌─────────────────────────┐\n`;
    message += `│  🏠 ${resultado.endereco.logradouro || ''} ${resultado.endereco.numero || ''}\n`;
    message += `│  🏘 ${resultado.endereco.bairro || ''}\n`;
    message += `│  🏙 ${resultado.endereco.cidade || ''}-${resultado.endereco.uf || ''}\n`;
    message += `│  📮 ${resultado.endereco.cep || ''}\n`;
    message += `└─────────────────────────┘\n\n`;
  }

  return message;
}

function formatCNPJResponse(data, cnpj) {
  if (!data) {
    return '📭 Dados não disponíveis para este CNPJ.';
  }

  let message = `🏢 **DADOS CNPJ**\n`;
  message += `┌─────────────────────────┐\n`;
  message += `│  🏢 CNPJ: ${formatCNPJ(cnpj)}\n`;
  message += `└─────────────────────────┘\n\n`;

  message += `👤 **DADOS BÁSICOS**\n`;
  message += `┌─────────────────────────┐\n`;
  message += `│  🏢 Razão Social: ${data.razao_social || 'Não informado'}\n`;
  message += `│  📋 Nome Fantasia: ${data.nome_fantasia || 'Não informado'}\n`;
  message += `│  📊 Situação: ${data.situacao || 'Não informado'}\n`;
  message += `│  📅 Abertura: ${data.data_inicio_atividade || 'Não informado'}\n`;
  message += `│  📏 Porte: ${data.porte || 'Não informado'}\n`;
  message += `└─────────────────────────┘\n\n`;

  message += `📍 **ENDEREÇO**\n`;
  message += `┌─────────────────────────┐\n`;
  message += `│  🏠 ${data.logradouro || 'Não informado'}\n`;
  message += `│  🔢 ${data.numero || 'Não informado'}\n`;
  message += `│  🏘 ${data.bairro || 'Não informado'}\n`;
  message += `│  🏙 ${data.municipio || 'Não informado'}/${data.uf || 'Não informado'}\n`;
  message += `│  📮 ${data.cep || 'Não informado'}\n`;
  message += `└─────────────────────────┘\n\n`;

  message += `📞 **CONTATO**\n`;
  message += `┌─────────────────────────┐\n`;
  message += `│  📱 Telefone: ${data.ddd_telefone_1 ? `(${data.ddd_telefone_1}) ${data.telefone_1}` : 'Não informado'}\n`;
  message += `│  📧 Email: ${data.email || 'Não informado'}\n`;
  message += `└─────────────────────────┘\n\n`;

  return message;
}

function formatCEPResponse(data, cep) {
  if (!data || data.erro) {
    return '❌ CEP não encontrado!\n\nVerifique o número e tente novamente.';
  }

  let message = `📍 **DADOS DO CEP**\n`;
  message += `┌─────────────────────────┐\n`;
  message += `│  📮 CEP: ${data.cep}\n`;
  message += `└─────────────────────────┘\n\n`;

  message += `🏠 **ENDEREÇO**\n`;
  message += `┌─────────────────────────┐\n`;
  message += `│  🏠 Logradouro: ${data.logradouro || 'Não informado'}\n`;
  message += `│  🔢 Número: ${data.numero || 'S/N'}\n`;
  message += `│  🏘 Bairro: ${data.bairro || 'Não informado'}\n`;
  message += `│  🏙 Cidade/UF: ${data.localidade}/${data.uf}\n`;
  message += `│  🌐 IBGE: ${data.ibge || 'Não informado'}\n`;
  message += `│  📞 DDD: ${data.ddd || 'Não informado'}\n`;
  message += `└─────────────────────────┘\n\n`;

  return message;
}

module.exports = {
  // ========================================
  // ENDPOINT 12: CONSULTA TELEFONE
  // ========================================
  telefone: async (sock, from, args, msg, number, addLog) => {
    if (args.length === 0) {
      const message = formatMessage(
        'CONSULTA TELEFONE',
        'Uso: /telefone [número]\n\nExemplo: /telefone 11999999999',
        { emoji: '📞' }
      );
      await sock.sendMessage(from, { text: message });
      return;
    }

    const telefone = args[0].replace(/\D/g, '');

    // Verificar se é credencial de teste
    if (isTestCredential('telefone', telefone)) {
      const message = formatMessage(
        'ACESSO BLOQUEADO',
        '❌ Este número é usado para testes internos do sistema.\n\nPor favor, utilize outros dados para testar as consultas.',
        { emoji: '🔒' }
      );
      await sock.sendMessage(from, { text: message });
      addLog(`🔒 Tentativa de teste bloqueada - TELEFONE: ${telefone} por ${number}`);
      return;
    }

    // Verificar se está protegido
    if (isProtected('telefone', telefone)) {
      const message = formatMessage(
        'ACESSO BLOQUEADO',
        '❌ Esse usuário é protegido pelo sistema MutanoX 🛡️\n\n🔒 A consulta não pode ser realizada.\n\n⚠️ Entre em contato com o administrador para mais informações.',
        { emoji: '🚫' }
      );
      await sock.sendMessage(from, { text: message });
      addLog(`🛡️ Tentativa de consulta bloqueada - TELEFONE: ${telefone} por ${number}`);
      return;
    }

    try {
      await sock.sendMessage(from, { text: '📞 Consultando telefone...' });

      const response = await axios.get(
        `https://world-ecletix.onrender.com/api/numero?q=${telefone}`
      );

      const data = response.data;
      const formattedData = formatTelefoneResponse(data, telefone);

      const message = formatMessage(
        'CONSULTA TELEFONE',
        formattedData,
        { emoji: '📞' }
      );

      const imagePath = path.join(__dirname, '../../public/images/telefone.svg');
      if (fs.existsSync(imagePath)) {
        await sock.sendMessage(from, {
          image: fs.readFileSync(imagePath),
          caption: message
        });
      } else {
        await sock.sendMessage(from, { text: message });
      }

    } catch (error) {
      const message = formatMessage(
        'ERRO NA CONSULTA',
        `❌ Não foi possível realizar a consulta.\n\nMotivo: ${error.message}\n\nTente novamente mais tarde.`,
        { emoji: '⚠️' }
      );
      await sock.sendMessage(from, { text: message });
    }
  },

  // ========================================
  // ENDPOINT 13: CONSULTA NOME
  // ========================================
  nome: async (sock, from, args, msg, number, addLog) => {
    if (args.length === 0) {
      const message = formatMessage(
        'CONSULTA POR NOME',
        'Uso: /nome [nome completo]\n\nExemplo: /nome João Silva',
        { emoji: '👤' }
      );
      await sock.sendMessage(from, { text: message });
      return;
    }

    const nomeCompleto = args.join(' ');

    // Verificar se é credencial de teste
    if (isTestCredential('nome', nomeCompleto)) {
      const message = formatMessage(
        'ACESSO BLOQUEADO',
        '❌ Este nome é usado para testes internos do sistema.\n\nPor favor, utilize outros dados para testar as consultas.',
        { emoji: '🔒' }
      );
      await sock.sendMessage(from, { text: message });
      addLog(`🔒 Tentativa de teste bloqueada - NOME: ${nomeCompleto} por ${number}`);
      return;
    }

    // Verificar se está protegido
    if (isProtected('nome', nomeCompleto)) {
      const message = formatMessage(
        'ACESSO BLOQUEADO',
        '❌ Esse usuário é protegido pelo sistema MutanoX 🛡️\n\n🔒 A consulta não pode ser realizada.\n\n⚠️ Entre em contato com o administrador para mais informações.',
        { emoji: '🚫' }
      );
      await sock.sendMessage(from, { text: message });
      addLog(`🛡️ Tentativa de consulta bloqueada - NOME: ${nomeCompleto} por ${number}`);
      return;
    }

    try {
      await sock.sendMessage(from, { text: '👤 Consultando nome...' });

      const response = await axios.get(
        `https://world-ecletix.onrender.com/api/nome-completo?q=${encodeURIComponent(nomeCompleto)}`
      );

      const data = response.data;
      const formattedData = formatNomeResponse(data, nomeCompleto);

      const message = formatMessage(
        'CONSULTA POR NOME',
        formattedData,
        { emoji: '👤' }
      );

      const imagePath = path.join(__dirname, '../../public/images/nome.svg');
      if (fs.existsSync(imagePath)) {
        await sock.sendMessage(from, {
          image: fs.readFileSync(imagePath),
          caption: message
        });
      } else {
        await sock.sendMessage(from, { text: message });
      }

    } catch (error) {
      const message = formatMessage(
        'ERRO NA CONSULTA',
        `❌ Não foi possível realizar a consulta.\n\nMotivo: ${error.message}\n\nTente novamente mais tarde.`,
        { emoji: '⚠️' }
      );
      await sock.sendMessage(from, { text: message });
    }
  },

  // ========================================
  // ENDPOINT 14: CONSULTA CPF
  // ========================================
  cpf: async (sock, from, args, msg, number, addLog) => {
    if (args.length === 0) {
      const message = formatMessage(
        'CONSULTA CPF',
        'Uso: /cpf [cpf]\n\nExemplo: /cpf 12345678900',
        { emoji: '🆔' }
      );
      await sock.sendMessage(from, { text: message });
      return;
    }

    const cpf = args[0].replace(/\D/g, '');

    // Validar CPF
    if (!validateCPF(cpf)) {
      const message = formatMessage(
        'CPF INVÁLIDO',
        '❌ O CPF informado é inválido!\n\nVerifique o número e tente novamente.\n\nO CPF deve conter 11 dígitos numéricos.',
        { emoji: '❌' }
      );
      await sock.sendMessage(from, { text: message });
      return;
    }

    // Verificar se é credencial de teste
    if (isTestCredential('cpf', cpf)) {
      const message = formatMessage(
        'ACESSO BLOQUEADO',
        '❌ Este CPF é usado para testes internos do sistema.\n\nPor favor, utilize outros dados para testar as consultas.',
        { emoji: '🔒' }
      );
      await sock.sendMessage(from, { text: message });
      addLog(`🔒 Tentativa de teste bloqueada - CPF: ${cpf} por ${number}`);
      return;
    }

    // Verificar se está protegido
    if (isProtected('cpf', cpf)) {
      const message = formatMessage(
        'ACESSO BLOQUEADO',
        '❌ Esse usuário é protegido pelo sistema MutanoX 🛡️\n\n🔒 A consulta não pode ser realizada.\n\n⚠️ Entre em contato com o administrador para mais informações.',
        { emoji: '🚫' }
      );
      await sock.sendMessage(from, { text: message });
      addLog(`🛡️ Tentativa de consulta bloqueada - CPF: ${cpf} por ${number}`);
      return;
    }

    try {
      await sock.sendMessage(from, { text: '🆔 Consultando CPF...' });

      const response = await axios.get(
        `https://world-ecletix.onrender.com/api/consultarcpf?cpf=${cpf}`
      );

      const data = response.data;
      const formattedData = formatCPFResponse(data, cpf);

      const message = formatMessage(
        'CONSULTA CPF',
        formattedData,
        { emoji: '🆔' }
      );

      const imagePath = path.join(__dirname, '../../public/images/cpf.svg');
      if (fs.existsSync(imagePath)) {
        await sock.sendMessage(from, {
          image: fs.readFileSync(imagePath),
          caption: message
        });
      } else {
        await sock.sendMessage(from, { text: message });
      }

    } catch (error) {
      const message = formatMessage(
        'ERRO NA CONSULTA',
        `❌ Não foi possível realizar a consulta.\n\nMotivo: ${error.message}\n\nTente novamente mais tarde.`,
        { emoji: '⚠️' }
      );
      await sock.sendMessage(from, { text: message });
    }
  },

  // ========================================
  // CONSULTA CNPJ
  // ========================================
  cnpj: async (sock, from, args, msg, number, addLog) => {
    if (args.length === 0) {
      const message = formatMessage(
        'CONSULTA CNPJ',
        'Uso: /cnpj [cnpj]\n\nExemplo: /cnpj 12345678000190',
        { emoji: '🏢' }
      );
      await sock.sendMessage(from, { text: message });
      return;
    }

    const cnpj = args[0].replace(/\D/g, '');

    if (cnpj.length !== 14) {
      const message = formatMessage(
        'CNPJ INVÁLIDO',
        '❌ O CNPJ informado é inválido!\n\nO CNPJ deve conter 14 dígitos numéricos.',
        { emoji: '❌' }
      );
      await sock.sendMessage(from, { text: message });
      return;
    }

    try {
      await sock.sendMessage(from, { text: '🏢 Consultando CNPJ...' });

      const response = await axios.get(
        `https://publica.cnpj.ws/${cnpj}`
      );

      const data = response.data;
      const formattedData = formatCNPJResponse(data, cnpj);

      const message = formatMessage(
        'CONSULTA CNPJ',
        formattedData,
        { emoji: '🏢' }
      );

      const imagePath = path.join(__dirname, '../../public/images/cnpj.svg');
      if (fs.existsSync(imagePath)) {
        await sock.sendMessage(from, {
          image: fs.readFileSync(imagePath),
          caption: message
        });
      } else {
        await sock.sendMessage(from, { text: message });
      }

    } catch (error) {
      const message = formatMessage(
        'ERRO NA CONSULTA',
        `❌ Não foi possível realizar a consulta.\n\nMotivo: ${error.message}\n\nTente novamente mais tarde.`,
        { emoji: '⚠️' }
      );
      await sock.sendMessage(from, { text: message });
    }
  },

  // ========================================
  // CONSULTA CEP
  // ========================================
  cep: async (sock, from, args, msg, number, addLog) => {
    if (args.length === 0) {
      const message = formatMessage(
        'CONSULTA CEP',
        'Uso: /cep [cep]\n\nExemplo: /cep 01310-100',
        { emoji: '📍' }
      );
      await sock.sendMessage(from, { text: message });
      return;
    }

    const cep = args[0].replace(/\D/g, '');

    if (cep.length !== 8) {
      const message = formatMessage(
        'CEP INVÁLIDO',
        '❌ O CEP informado é inválido!\n\nO CEP deve conter 8 dígitos numéricos.',
        { emoji: '❌' }
      );
      await sock.sendMessage(from, { text: message });
      return;
    }

    try {
      await sock.sendMessage(from, { text: '📍 Consultando CEP...' });

      const response = await axios.get(
        `https://viacep.com.br/ws/${cep}/json/`
      );

      const data = response.data;

      if (data.erro) {
        const message = formatMessage(
          'CEP NÃO ENCONTRADO',
          '❌ O CEP informado não foi encontrado.\n\nVerifique o número e tente novamente.',
          { emoji: '📭' }
        );
        await sock.sendMessage(from, { text: message });
        return;
      }

      const formattedData = formatCEPResponse(data, cep);

      const message = formatMessage(
        'CONSULTA CEP',
        formattedData,
        { emoji: '📍' }
      );

      const imagePath = path.join(__dirname, '../../public/images/cep.svg');
      if (fs.existsSync(imagePath)) {
        await sock.sendMessage(from, {
          image: fs.readFileSync(imagePath),
          caption: message
        });
      } else {
        await sock.sendMessage(from, { text: message });
      }

    } catch (error) {
      const message = formatMessage(
        'ERRO NA CONSULTA',
        `❌ Não foi possível realizar a consulta.\n\nMotivo: ${error.message}\n\nTente novamente mais tarde.`,
        { emoji: '⚠️' }
      );
      await sock.sendMessage(from, { text: message });
    }
  }
};
