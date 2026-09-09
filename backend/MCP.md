# Schedulr MCP server

The backend exposes a Model Context Protocol server over stdio. It gives an MCP client safe access to the booking database through three tools:

- `list_clients`: search clients by name, email, service, or status.
- `list_appointments`: read appointments in an ISO date range.
- `create_appointment`: check conflicts and create a pending appointment.

Start it with:

```bash
pnpm run mcp
```

Example MCP client configuration:

```json
{
  "mcpServers": {
    "schedulr": {
      "command": "pnpm",
      "args": ["--dir", "D:/complete project/job-project/mern-ainative/backend", "run", "mcp"]
    }
  }
}
```

The normal Express API remains available with `pnpm run dev`. Gemini dashboard insights use the backend data directly; an MCP client can use the same booking data through the tools above.
