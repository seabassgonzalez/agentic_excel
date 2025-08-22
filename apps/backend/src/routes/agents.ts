import { Hono } from 'hono'
import { db } from '../db'
import { agentLogs } from '../db/schema'
import { eq } from 'drizzle-orm'

export const agentsRoute = new Hono()

agentsRoute.get('/logs', async (c) => {
  const jobId = c.req.query('jobId')
  
  if (!jobId) {
    return c.json({ error: 'jobId query parameter is required' }, 400)
  }
  
  const logs = await db.select().from(agentLogs)
    .where(eq(agentLogs.jobId, jobId))
    .orderBy(agentLogs.timestamp)
  
  return c.json(logs)
})

agentsRoute.get('/agents', async (c) => {
  return c.json([
    {
      name: 'DataAnalyzer',
      description: 'Analyzes Excel data structure and content',
      capabilities: ['schema detection', 'data profiling', 'statistics generation']
    },
    {
      name: 'DataTransformer',
      description: 'Transforms Excel data based on rules',
      capabilities: ['data cleaning', 'format conversion', 'aggregation']
    },
    {
      name: 'DataValidator',
      description: 'Validates Excel data against schemas',
      capabilities: ['schema validation', 'data quality checks', 'error reporting']
    },
    {
      name: 'DataExtractor',
      description: 'Extracts specific data from Excel files',
      capabilities: ['pattern matching', 'data extraction', 'structured output']
    }
  ])
})