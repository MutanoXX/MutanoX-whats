# Guia de Configuração - MutanoX-Bot

## 📋 Índice

- [Configurar Número do Dono](#configurar-número-do-dono)
- [Comandos Admin Disponíveis](#comandos-admin-disponíveis)
- [Teste do Bot](#teste-do-bot)

---

## 🔑 Configurar Número do Dono

### ⚠️ IMPORTANTE!

O número do dono atual está configurado como **placeholder** e precisa ser atualizado para que os comandos admin funcionem!

### Passo a Passo:

1. **Abra o arquivo de configuração:**
   ```bash
   nano bot/config.js
   ```

2. **Encontre a seção `owner`:** (linha 21-33)
   ```javascript
   owner: {
     // Número(s) do dono do bot (com código do país, sem @)
     // Exemplo: '5511999999999' para Brasil
     numbers: [
       '5511999999999',  // ← ATUALIZE AQUI!
     ],

     // Nome exibido
     name: 'MutanoX',

     // Avatar/nick do dono
     nickname: '👑 MutanoX'
   },
   ```

3. **Substitua o número placeholder pelo seu número:**
   - Formato: Código do país + DDD + Número
   - Exemplos:
     - Brasil: `5511999999999` (55 = Brasil, 11 = DDD SP)
     - Portugal: `3519199999999` (351 = Portugal)
     - EUA: `12025551234` (1 = EUA)

4. **Salve o arquivo:**
   - No nano: Pressione `Ctrl+X`, depois `Y`, depois `Enter`
   - No VS Code: `Ctrl+S`

5. **Reinicie o bot:**
   ```bash
   cd bot
   bun run dev
   ```

### Verificar se funcionou:

Após reiniciar, envie o comando `/menu-adm` no WhatsApp. Se funcionar, você verá o menu admin. Se não funcionar, verifique:
- O número está no formato correto
- Não há caracteres especiais ou espaços
- O bot está conectado com seu número

---

## 👑 Comandos Admin Disponíveis

Depois de configurar seu número, você terá acesso a estes comandos:

### 🛡️ Sistema de Proteção
```
/protect [cpf|nome|telefone] [valor]
  Ex: /protect cpf 12345678900
  Ex: /protect nome João Silva
  Ex: /protect telefone 11999999999

/unprotect [cpf|nome|telefone] [valor]
  Ex: /unprotect cpf 12345678900

/listprotect [cpf|nome|telefone|all]
  Ex: /listprotect cpf
  Ex: /listprotect all
```

### 📢 Gerenciamento de Grupos
```
/broadcast [mensagem]
  Envia mensagem para todos os grupos

/cleargroup
  Limpa mensagens do bot no grupo

/kick @usuario
  Remove participante do grupo

/add [número]
  Adiciona participante ao grupo
```

### 🚫 Bloqueio de Usuários
```
/block [número]
  Bloqueia número de usar o bot

/unblock [número]
  Desbloqueia número
```

### ⚙️ Configurações
```
/setstatus [texto]
  Define o status do bot
```

### 🔄 Controle do Sistema
```
/leave
  Sai do grupo atual

/restart
  Reinicia o bot

/shutdown
  Desliga o bot
```

---

## ✅ Teste do Bot

Após configurar seu número, faça este teste simples:

1. **Conecte-se ao dashboard:**
   - Acesse: http://localhost:8080
   - Escaneie o QR Code no WhatsApp

2. **Teste comando básico:**
   ```
   /menu
   ```
   Deve aparecer o menu de comandos

3. **Teste comando admin:**
   ```
   /menu-adm
   ```
   Deve aparecer o menu admin (só funciona para seu número)

4. **Teste proteção:**
   ```
   /protect cpf 12345678900
   ```
   Deve adicionar o CPF à lista de proteção

---

## 📞 Suporte

Se tiver problemas:

1. Verifique o log do bot no dashboard
2. Confirme que o número está no formato correto
3. Reinicie o bot após alterações
4. Verifique se há erros no console

---

## 📝 Notas Importantes

- ✅ O número deve ter **apenas dígitos** (sem pontos, traços ou espaços)
- ✅ O código do país é **obrigatório**
- ✅ Você pode adicionar **múltiplos números** como dono
- ✅ Os comandos admin só funcionam para números configurados como owner

---

**Versão:** 2.0.0
**Última atualização:** 2024
**Criado por:** @MutanoX
