# Evolution API MCP Server — AGENTS.md

## Overview

This document describes the available tools (endpoints) exposed by the Evolution API MCP Server, along with configuration, usage patterns, and troubleshooting guidance for AI agents.

**Authentication:** All requests (except `/`) require the header:

```
X-API-Key: <MCP_API_KEY>
```

> The server runs on `http://localhost:{MCP_SERVER_PORT}`. Set `MCP_SERVER_PORT` in your `.env`.

---

## Available Tools

### `GET /` — Server Info

Returns basic information about the MCP server.

```bash
curl http://localhost:{MCP_SERVER_PORT}/
```

---

### `GET /api/health` — Health Check

Returns the health status of the MCP server.

```bash
curl http://localhost:{MCP_SERVER_PORT}/api/health \
  -H "X-API-Key: <MCP_API_KEY>"
```

---

### `GET /api/instances` — List Instances

Lists all available WhatsApp instances.

```bash
curl http://localhost:{MCP_SERVER_PORT}/api/instances \
  -H "X-API-Key: <MCP_API_KEY>"
```

---

### `GET /api/instances/{instanceName}/status` — Instance Status

Returns the connection status of a specific instance. The instance must be in `open` or `connected` state to send messages.

```bash
curl http://localhost:{MCP_SERVER_PORT}/api/instances/Luis2/status \
  -H "X-API-Key: <MCP_API_KEY>"
```

---

### `POST /api/send/text` — Send Text Message

Sends a WhatsApp text message to a given number.

**Parameters:**
| Field | Type | Description |
|---|---|---|
| `instanceName` | string | Name of the WhatsApp instance |
| `number` | string | Recipient number in E.164 format (digits only, no `+`) |
| `text` | string | Message content |

```bash
curl -X POST http://localhost:{MCP_SERVER_PORT}/api/send/text \
  -H "Content-Type: application/json" \
  -H "X-API-Key: <MCP_API_KEY>" \
  -d '{
    "instanceName": "Luis2",
    "number": "554198908495",
    "text": "Hola! Este es un mensaje de prueba"
  }'
```

> **Number format:** `{country_code}{area_code}{number}` — no spaces, dashes, or leading `+`.
> Example for Brazil: `554198908495`

---

### `POST /api/check-numbers` — Check WhatsApp Numbers

Verifies whether one or more phone numbers have an active WhatsApp account.

```bash
curl -X POST http://localhost:{MCP_SERVER_PORT}/api/check-numbers \
  -H "Content-Type: application/json" \
  -H "X-API-Key: <MCP_API_KEY>" \
  -d '{
    "instanceName": "Luis2",
    "numbers": ["554198908495", "5541999999999"]
  }'
```

---

### `GET /api/instances/{instanceName}/contacts` — List Contacts

Returns the contact list for a given instance.

```bash
curl http://localhost:{MCP_SERVER_PORT}/api/instances/Luis2/contacts \
  -H "X-API-Key: <MCP_API_KEY>"
```

---

### `GET /api/instances/{instanceName}/groups` — List Groups

Returns the WhatsApp groups for a given instance.

```bash
curl http://localhost:{MCP_SERVER_PORT}/api/instances/Luis2/groups \
  -H "X-API-Key: <MCP_API_KEY>"
```

---

### `GET /api/instances/{instanceName}/chats` — List Chats

Returns the recent chat list for a given instance.

```bash
curl http://localhost:{MCP_SERVER_PORT}/api/instances/Luis2/chats \
  -H "X-API-Key: <MCP_API_KEY>"
```

---

## Error Reference

| Error                 | Cause                    | Fix                                                        |
| --------------------- | ------------------------ | ---------------------------------------------------------- |
| Message not delivered | Instance not connected   | Check instance status; re-scan QR code if needed           |
| `Access denied`       | Missing or wrong API key | Ensure `X-API-Key` header is present and correct           |
| Connection error      | Evolution API is down    | Check Easypanel; verify Evolution API directly (see below) |

**Verify Evolution API directly:**

```bash
curl https://evolution-api-evolution-api.dqyvuv.easypanel.host/instance/fetchInstances \
  -H "apikey: <MCP_API_KEY>"
```

---

## Agent Notes

- **Always check instance status** before sending messages. Proceed only if status is `open` or `connected`.
- **Use `check-numbers` before sending** to avoid errors on invalid or non-WhatsApp numbers.
- **WhatsApp sessions can expire** — if status is not `open`, a new QR code scan is required (human intervention needed).
- **Rate limits apply** — Evolution API may throttle high-volume sends; do not batch large sends without delays.
- **Never expose the API key** in public code or logs.

---

## Environment Variables

```dotenv
EVOLUTION_API_URL=        # Base URL of your Evolution API instance
EVOLUTION_API_KEY=        # Evolution API key
MCP_SERVER_PORT=          # Port the MCP server listens on (e.g. 3000)
NODE_ENV=                 # production | development
```

---

## Project Structure

```
evolution-api-mcp-server/
├── src/
│   ├── index.ts                      # Entry point
│   ├── routes/
│   │   └── api.ts                    # HTTP API routes
│   ├── services/
│   │   ├── evolution-api.ts          # Evolution API client
│   │   └── template-service.ts       # Template service
│   └── types/
│       └── evolution.ts              # TypeScript types
├── package.json
├── tsconfig.json
├── Dockerfile
└── .env                              # Local environment variables
```

---

## References

- Evolution API docs: https://doc.evolution-api.com
- Railway dashboard: https://railway.app
- Easypanel: your instance control panel
