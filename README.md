# Evolution API MCP Server - Guia de Uso

## Configuração Atual

- **URL do Servidor MCP:** `http://localhost:{MCP_SERVER_PORT}` (ou sua URL de produção)
- **URL do Evolution API:** (sua URL do Evolution API)
- **API Key:** (sua API Key)
- **Instância:** (nome da sua instância)
- **Número de teste:** (número de teste em formato E.164)

## Endpoints Disponíveis

### 1. Informações do Servidor

```bash
curl http://localhost:{MCP_SERVER_PORT}/
```

### 2. Verificação de Saúde

```bash
curl http://localhost:{MCP_SERVER_PORT}/api/health \
  -H "X-API-Key: {SUA_API_KEY}"
```

### 3. Listar Instâncias

```bash
curl http://localhost:{MCP_SERVER_PORT}/api/instances \
  -H "X-API-Key: {SUA_API_KEY}"
```

### 4. Status de uma Instância

```bash
curl http://localhost:{MCP_SERVER_PORT}/api/instances/{NOME_DA_INSTANCIA}/status \
  -H "X-API-Key: {SUA_API_KEY}"
```

### 5. Enviar Mensagem de Texto

```bash
curl -X POST http://localhost:{MCP_SERVER_PORT}/api/send/text \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {SUA_API_KEY}" \
  -d '{
    "instanceName": "{NOME_DA_INSTANCIA}",
    "number": "{NUMERO_DESTINO}",
    "text": "Olá! Esta é uma mensagem de teste"
  }'
```

### 6. Verificar Números de WhatsApp

```bash
curl -X POST http://localhost:{MCP_SERVER_PORT}/api/chat/check-numbers \
  -H "Content-Type: application/json" \
  -H "X-API-Key: {SUA_API_KEY}" \
  -d '{
    "instanceName": "{NOME_DA_INSTANCIA}",
    "numbers": ["{NUMERO_1}", "{NUMERO_2}"]
  }'
```

### 7. Listar Contatos

```bash
curl http://localhost:{MCP_SERVER_PORT}/api/chat/{NOME_DA_INSTANCIA}/contacts \
  -H "X-API-Key: {SUA_API_KEY}"
```

### 8. Listar Grupos

```bash
curl http://localhost:{MCP_SERVER_PORT}/api/groups/{NOME_DA_INSTANCIA} \
  -H "X-API-Key: {SUA_API_KEY}"
```

### 9. Listar Chats

```bash
curl http://localhost:{MCP_SERVER_PORT}/api/chat/{NOME_DA_INSTANCIA}/chats \
  -H "X-API-Key: {SUA_API_KEY}"
```

## Solução de Problemas

### A mensagem não chega ao WhatsApp

1. **Verificar que a instância está conectada:**
   - A instância deve ter estado "open" ou "connected"
   - Se não estiver conectada, você precisa escanear o QR code novamente

2. **Formato do número:**
   - Brasil: 55 + código de área + número (exemplo: 554198908495)
   - Sem espaços, traços ou símbolos
   - Sem o símbolo + no início

3. **Verificar se o número tem WhatsApp:**
   - Use o endpoint `/api/chat/check-numbers` para verificar

### Erro "Access denied"

- Verifique que você está enviando o cabeçalho `X-API-Key` com o valor correto

### Erro de conexão

1. Verifique que o Evolution API está funcionando:

   ```bash
   curl {SUA_URL_EVOLUTION_API}/instance/fetchInstances \
     -H "apikey: {SUA_API_KEY}"
   ```

2. Se o Evolution API não responder, o problema está no Easypanel/Coolify

## Scripts de Teste

Há dois scripts de teste disponíveis:

1. **test-mcp.sh** - Testa o servidor MCP
2. **test-evolution-direct.sh** - Testa diretamente o Evolution API

Para executá-los no Windows, use Git Bash:

```bash
bash test-mcp.sh
bash test-evolution-direct.sh
```

## Deploy com Docker

Você pode fazer deploy usando o Dockerfile incluído:

```bash
docker build -t evolution-api-mcp .
docker run -p 3000:3000 --env-file .env evolution-api-mcp
```

Ou usando Docker Compose:

```bash
docker-compose up -d
```

## Atualização do Código

Quando fizer alterações no código:

1. Commit e push para GitHub:

   ```bash
   git add .
   git commit -m "Descrição da alteração"
   git push origin master
   ```

2. Railway detectará automaticamente as alterações e redeployará

3. Verifique o status do deploy no Railway:
   - Acesse https://railway.app
   - Entre no projeto "MCP Servers"
   - Revise o status do deploy

## Estrutura do Projeto

```
evolution-api-mcp-server/
├── src/
│   ├── index.ts           # Arquivo principal
│   ├── routes/            # Rotas organizadas por categoria
│   │   ├── api.ts         # Roteador principal
│   │   ├── instance/      # Instâncias
│   │   ├── message/       # Mensagens
│   │   ├── chat/          # Chat
│   │   ├── group/         # Grupos
│   │   ├── business/      # Business
│   │   ├── settings/      # Configurações
│   │   ├── label/         # Etiquetas
│   │   ├── call/          # Chamadas
│   │   └── template/      # Templates
│   ├── services/
│   │   ├── evolution-api.ts  # Cliente de Evolution API
│   │   ├── instance-manager.ts # Gerenciador de instâncias
│   │   └── template-service.ts # Serviço de templates
│   ├── utils/
│   │   └── logger.ts      # Logger
│   └── types/
│       └── evolution.ts   # Tipos TypeScript
├── package.json
├── tsconfig.json
├── Dockerfile
└── .env                   # Variáveis de ambiente (local)
```

## Variáveis de Ambiente

As seguintes variáveis precisam ser configuradas no seu `.env` ou na plataforma de deploy:

- `EVOLUTION_API_URL`: URL base do Evolution API
- `EVOLUTION_API_KEY`: Chave da Evolution API
- `MCP_SERVER_PORT`: Porta do servidor MCP (padrão: 3000)
- `NODE_ENV`: Ambiente (production ou development)

## Notas Importantes

1. **Segurança:** Nunca exponha a API Key em código público
2. **Limites de taxa:** Evolution API pode ter limites de taxa
3. **Sessão do WhatsApp:** A sessão pode expirar e exigir novo escaneamento de QR
4. **Números bloqueados:** WhatsApp pode bloquear números que enviam muitos mensagens

## Contato e Suporte

Para problemas com:

- **Evolution API:** Revise a documentação em https://docs.evolutionfoundation.com.br/evolution-api/
- **Railway:** https://railway.app/support
- **Coolify/Easypanel:** Painel de controle da sua instância

---

Última atualização: 29 de Junho de 2026
