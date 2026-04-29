# mail-and-appointments

A multi-provider email and calendar middleware for organizing emails and appointments across Microsoft 365 and Google accounts. Built for use with AI agents and personal productivity workflows.

## Architecture

```
mail-and-appointments/
├── api/          # Azure Functions middleware (TypeScript)
└── web/          # React frontend
```

## What It Does

- Authenticates with Microsoft 365 and Google via OAuth
- Aggregates emails from selected inboxes (Gmail labels, Outlook folders)
- Aggregates calendar events from selected calendars
- Exposes a unified REST API for AI agents and front-end apps

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/email` | Store an email from any selected inbox |
| GET | `/calendar?date=YYYY-MM-DD` | Retrieve events for a given date |

## Data Storage

Azure Table Storage with two tables:
- **EmailCalendarData** — email and calendar records
- **AccountConfig** — provider metadata, selected inboxes, selected calendars

## Getting Started

### Prerequisites
- Node.js 18+
- Azure Functions Core Tools v4
- Azure Storage account (or Azurite for local dev)
- Microsoft Entra app registration (for MS365 OAuth)
- Google Cloud OAuth 2.0 credentials

### API Setup

```bash
cd api
npm install
cp local.settings.json.example local.settings.json
# Fill in your secrets in local.settings.json
npm start
```

### Web Setup

```bash
cd web
npm install
npm run dev
```

## Environment Variables (API)

| Variable | Description |
|----------|-------------|
| `AZURE_STORAGE_CONNECTION_STRING` | Azure Table Storage connection string |
| `MS_CLIENT_ID` | Microsoft Entra app client ID |
| `MS_CLIENT_SECRET` | Microsoft Entra app client secret |
| `MS_TENANT_ID` | Microsoft Entra tenant ID |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |

## Roadmap

- [x] Project scaffold
- [ ] OAuth token validation middleware
- [ ] POST /email — store email to Azure Table Storage
- [ ] GET /calendar — fetch events from MS Graph & Google Calendar APIs
- [ ] React frontend — account connection & inbox/calendar selection
- [ ] AI agent integration hooks
