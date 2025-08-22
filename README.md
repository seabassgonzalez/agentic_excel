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

 This system essentially turns Excel files into intelligent, queryable data sources that can be automatically analyzed, cleaned, validated, and mined for specific information using AI assistance. 
  
  This project enables four main types of AI-powered operations on Excel worksheets:

  1. Analyze Operation

  The AI agent analyzes the Excel file structure and content, providing:
  - Sheet inventory: List of all sheets in the workbook
  - Data dimensions: Total rows and columns
  - Data type detection: Counts of numeric, text, and date columns
  - AI-generated summary: Natural language description of what the data contains
  - Recommendations: AI-suggested next steps for processing the data
  - Insights: Patterns and observations about the data structure

  2. Transform Operation

  Applies data transformation rules to modify the Excel data:
  - Text transformations:
    - Convert to uppercase
    - Convert to lowercase
    - Trim whitespace
    - Find and replace text
  - Column-specific operations: Apply transformations to specific columns
  - Batch processing: Apply multiple transformation rules in sequence
  - Preview generation: Shows sample of transformed data

  3. Validate Operation

  Validates Excel data against defined schemas:
  - Required field checking: Ensures mandatory columns have values
  - Data type validation:
    - Number validation
    - Email format validation
    - String validation
    - Date validation (schema supports it)
  - Pattern matching: Validate against regex patterns
  - Error reporting: Detailed list of validation errors with row/column locations
  - Statistics: Total records, valid records, invalid records count

  4. Extract Operation

  Extracts specific data patterns from Excel files:
  - Pattern-based extraction:
    - Email addresses (using regex)
    - Phone numbers (using regex)
    - URLs (using regex)
    - Custom regex patterns
  - Text search: Find cells containing specific text (case-insensitive)
  - Match reporting: Shows where patterns were found (row/column)
  - Sample results: Provides examples of extracted data
  - Match counting: Total number of matches per pattern

  Additional Capabilities

  File Processing Features:

  - Multi-sheet support: Processes all sheets in a workbook
  - Large file handling: Can process files with thousands of rows
  - Real-time progress tracking: Monitor processing status
  - Detailed logging: Every agent action is logged for transparency

  AI-Powered Intelligence:

  - Uses OpenAI GPT-4 for intelligent analysis
  - Generates natural language summaries
  - Provides actionable recommendations
  - Understands context and data relationships

  Output Options:

  - JSON-formatted results
  - Structured data ready for further processing
  - Preview of processed data
  - Detailed error and validation reports

  Limitations (based on current implementation):

  - No direct Excel file generation (only analysis/processing)
  - No complex formula evaluation
  - No chart/visualization generation
  - No pivot table operations
  - Mock data is currently used (actual file processing not fully implemented)

 

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