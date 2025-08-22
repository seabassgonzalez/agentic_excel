# Agentic Excel

AI-powered Excel processing platform built with TypeScript, featuring intelligent agents for complex Excel operations.

## Tech Stack

### Frontend
- Next.js
- Shadcn UI
- TanStack Query
- Tailwind CSS
- Zustand
- TypeScript

### Backend
- Node.js
- Hono
- Drizzle ORM
- PostgreSQL (Neon)
- AI SDK
- Railway (deployment)

## Features

- **File Upload**: Drag-and-drop Excel file upload
- **AI Agents**: Specialized agents for different Excel operations
  - Data Analyzer: Analyzes Excel structure and content
  - Data Transformer: Applies transformation rules
  - Data Validator: Validates against schemas
  - Data Extractor: Extracts patterns and specific data
- **Real-time Processing**: Track job progress with live updates
- **Agent Logs**: Detailed logging of agent actions

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended)
- OpenAI API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/agentic-excel.git
cd agentic-excel
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Backend (.env):
```
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
```

Frontend (.env.local):
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. Run database migrations
```bash
cd apps/backend
npm run db:push
```

5. Start development servers
```bash
npm run dev
```

## Architecture

The project uses a monorepo structure with Turborepo:

```
.
├── apps/
│   ├── backend/     # Hono API server
│   └── frontend/    # Next.js application
├── packages/
│   └── shared/      # Shared utilities (if needed)
└── turbo.json       # Turborepo configuration
```

## Deployment

The application is configured for deployment on Railway:

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy both frontend and backend services

## API Endpoints

- `POST /api/files/upload` - Upload Excel file
- `GET /api/files` - List uploaded files
- `POST /api/jobs` - Create processing job
- `GET /api/jobs/:id` - Get job details with logs
- `GET /api/agents/agents` - List available agents

## License

MIT