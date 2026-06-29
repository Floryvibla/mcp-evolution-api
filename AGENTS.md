# Evolution API MCP Server — AGENTS.md

## Visão Geral

Este documento descreve as ferramentas (endpoints) disponíveis expostos pelo Evolution API MCP Server, juntamente com configuração, padrões de uso e orientações de resolução de problemas para agentes AI.

**Autenticação:** Todas as requisições (exceto `/`) exigem o cabeçalho:

```
X-API-Key: <MCP_API_KEY>
```

> O servidor roda em `http://localhost:{MCP_SERVER_PORT}`. Configure `MCP_SERVER_PORT` no seu `.env`.

---

## Ferramentas Disponíveis

### `GET /` — Informações do Servidor

Retorna informações básicas sobre o servidor MCP.

```bash
curl http://localhost:{MCP_SERVER_PORT}/
```

---

### `GET /api/health` — Verificação de Saúde

Retorna o status de saúde do servidor MCP.

```bash
curl http://localhost:{MCP_SERVER_PORT}/api/health \
  -H "X-API-Key: <MCP_API_KEY>"
```

---

### Instâncias (`/api/instances`)
- `GET /` — Listar instâncias
- `GET /{instanceName}` — Detalhes de uma instância
- `POST /` — Criar nova instância
- `POST /{instanceName}/connect` — Conectar instância
- `POST /{instanceName}/disconnect` — Desconectar instância
- `DELETE /{instanceName}` — Excluir instância
- `POST /{instanceName}/refresh` — Atualizar status
- `GET /{instanceName}/status` — Status de conexão
- `POST /{instanceName}/restart` — Reiniciar instância
- `POST /{instanceName}/logout` — Fazer logout da instância
- `POST /{instanceName}/presence` — Configurar presença

---

### Mensagens (`/api/send`)
- `POST /text` — Enviar mensagem de texto
- `POST /media` — Enviar mídia (imagem, vídeo, áudio, documento)
- `POST /buttons` — Enviar botões
- `POST /list` — Enviar lista
- `POST /location` — Enviar localização
- `POST /contact` — Enviar contato
- `POST /reaction` — Enviar reação

---

### Chat (`/api/chat`)
- `GET /{instanceName}/contacts` — Listar contatos
- `GET /{instanceName}/chats` — Listar chats
- `GET /{instanceName}/messages` — Listar mensagens
- `GET /{instanceName}/status-messages` — Listar status
- `POST /check-numbers` — Verificar números WhatsApp
- `POST /{instanceName}/read` — Marcar mensagem como lida
- `POST /{instanceName}/archive` — Arquivar chat
- `DELETE /{instanceName}/message` — Excluir mensagem
- `GET /{instanceName}/profile-picture` — Obter foto de perfil
- `GET /{instanceName}/business-profile` — Obter perfil empresarial
- `POST /{instanceName}/base64` — Obter base64 de mídia

---

### Grupos (`/api/groups`)
- `GET /{instanceName}` — Listar grupos
- `POST /create` — Criar grupo
- `GET /{instanceName}/participants` — Obter participantes
- `PUT /{instanceName}/subject` — Atualizar assunto
- `PUT /{instanceName}/description` — Atualizar descrição
- `POST /{instanceName}/add-participants` — Adicionar participantes
- `POST /{instanceName}/remove-participants` — Remover participantes
- `POST /{instanceName}/promote-participants` — Promover participantes
- `POST /{instanceName}/demote-participants` — Despromover participantes
- `POST /{instanceName}/leave` — Sair do grupo
- `GET /{instanceName}/invite-code` — Obter código de convite
- `POST /{instanceName}/revoke-invite` — Revogar convite
- `POST /{instanceName}/accept-invite` — Aceitar convite

---

### Business (`/api/business`)
- `GET /{instanceName}/profile` — Obter perfil empresarial
- `PUT /{instanceName}/profile` — Atualizar perfil empresarial
- `GET /{instanceName}/hours` — Obter horários comerciais
- `PUT /{instanceName}/hours` — Atualizar horários comerciais
- `GET /{instanceName}/catalog` — Obter catálogo
- `POST /{instanceName}/catalog` — Adicionar produto ao catálogo
- `PUT /{instanceName}/catalog/{productId}` — Atualizar produto
- `DELETE /{instanceName}/catalog/{productId}` — Excluir produto

---

### Configurações (`/api/settings`)
- `GET /{instanceName}` — Obter configurações
- `PUT /{instanceName}` — Atualizar configurações
- `PUT /{instanceName}/privacy` — Configurar privacidade
- `POST /{instanceName}/profile/name` — Atualizar nome de perfil
- `POST /{instanceName}/profile/picture` — Atualizar foto de perfil
- `POST /{instanceName}/profile/status` — Atualizar status de perfil

---

### Etiquetas (`/api/labels`)
- `GET /{instanceName}` — Listar etiquetas
- `POST /{instanceName}` — Criar etiqueta
- `PUT /{instanceName}/{labelId}` — Atualizar etiqueta
- `DELETE /{instanceName}/{labelId}` — Excluir etiqueta
- `POST /{instanceName}/add-to-chat` — Adicionar etiqueta ao chat
- `DELETE /{instanceName}/remove-from-chat` — Remover etiqueta do chat

---

### Chamadas (`/api/calls`)
- `GET /{instanceName}/history` — Obter histórico de chamadas
- `POST /{instanceName}/voice` — Fazer chamada de voz
- `POST /{instanceName}/video` — Fazer chamada de vídeo
- `POST /{instanceName}/accept` — Aceitar chamada
- `POST /{instanceName}/end` — Encerrar chamada

---

### Templates (`/api/templates`)
- `GET /{instanceName}` — Listar templates
- `POST /{instanceName}` — Criar template
- `PUT /{instanceName}/{templateId}` — Atualizar template
- `DELETE /{instanceName}/{templateId}` — Excluir template
- `POST /{instanceName}/send` — Enviar template

---

## Referência de Erros

| Erro                  | Causa                    | Solução                                                    |
| --------------------- | ------------------------ | ---------------------------------------------------------- |
| Mensagem não entregue | Instância não conectada  | Verificar status da instância; re-escanear QR se necessário|
| `Access denied`       | API Key ausente ou errada| Garantir que o cabeçalho `X-API-Key` esteja correto       |
| Erro de conexão       | Evolution API fora do ar | Verificar Coolify/Easypanel; validar Evolution API diretamente |

**Verificar Evolution API diretamente:**

```bash
curl https://evolution-api-evolution-api.dqyvuv.easypanel.host/instance/fetchInstances \
  -H "apikey: <MCP_API_KEY>"
```

---

## Notas para Agentes

- **Sempre verifique o status da instância** antes de enviar mensagens. Prossiga apenas se o status for `open` ou `connected`.
- **Use `check-numbers` antes de enviar** para evitar erros com números inválidos ou sem WhatsApp.
- **Sessões do WhatsApp podem expirar** — se o status não for `open`, um novo scan de QR é necessário (intervenção humana).
- **Limites de taxa aplicáveis** — Evolution API pode limitar envios em alta velocidade; não faça lotes grandes sem atrasos.
- **Nunca exponha a API key** em código público ou logs.

---

## Variáveis de Ambiente

```dotenv
EVOLUTION_API_URL=        # URL base da sua instância Evolution API
EVOLUTION_API_KEY=        # Chave da Evolution API
MCP_SERVER_PORT=          # Porta onde o servidor MCP escuta (ex: 3000)
NODE_ENV=                 # production | development
```

---

## Estrutura do Projeto

```
evolution-api-mcp-server/
├── src/
│   ├── index.ts                      # Ponto de entrada
│   ├── routes/                      # Rotas organizadas por categoria
│   │   ├── instance/                # Endpoints de instâncias
│   │   ├── message/                 # Endpoints de mensagens
│   │   ├── chat/                    # Endpoints de chat
│   │   ├── group/                   # Endpoints de grupos
│   │   ├── business/                # Endpoints empresariais
│   │   ├── settings/                # Endpoints de configurações
│   │   ├── label/                   # Endpoints de etiquetas
│   │   ├── call/                    # Endpoints de chamadas
│   │   └── template/                # Endpoints de templates
│   ├── services/
│   │   ├── evolution-api.ts          # Cliente Evolution API
│   │   ├── instance-manager.ts       # Gerenciador de instâncias
│   │   └── template-service.ts       # Serviço de templates
│   ├── utils/
│   │   └── logger.ts                 # Logger
│   └── types/
│       └── evolution.ts              # Tipos TypeScript
├── package.json
├── tsconfig.json
├── Dockerfile
└── .env                              # Variáveis de ambiente locais
```

---

## Referências

- Documentação Evolution API: https://docs.evolutionfoundation.com.br/evolution-api/
- Railway: https://railway.app
- Coolify: Painel de controle da sua instância
