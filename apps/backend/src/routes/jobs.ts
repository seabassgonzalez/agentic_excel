import { Hono } from 'hono'
import { z } from 'zod'
import { db } from '../db'
import { processingJobs, agentLogs } from '../db/schema'
import { eq } from 'drizzle-orm'
import { processExcelFile } from '../services/excel-processor'

const createJobSchema = z.object({
  fileId: z.string().uuid(),
  operation: z.enum(['analyze', 'transform', 'validate', 'extract']),
  parameters: z.any().optional(),
})

export const jobsRoute = new Hono()

jobsRoute.get('/', async (c) => {
  const jobs = await db.select().from(processingJobs).orderBy(processingJobs.createdAt)
  return c.json(jobs)
})

jobsRoute.get('/:id', async (c) => {
  const id = c.req.param('id')
  const job = await db.select().from(processingJobs).where(eq(processingJobs.id, id)).limit(1)
  
  if (job.length === 0) {
    return c.json({ error: 'Job not found' }, 404)
  }
  
  const logs = await db.select().from(agentLogs).where(eq(agentLogs.jobId, id)).orderBy(agentLogs.timestamp)
  
  return c.json({ ...job[0], logs })
})

jobsRoute.post('/', async (c) => {
  const body = await c.req.json()
  const parsed = createJobSchema.safeParse(body)
  
  if (!parsed.success) {
    return c.json({ error: 'Invalid request body', details: parsed.error }, 400)
  }
  
  const newJob = await db.insert(processingJobs).values({
    fileId: parsed.data.fileId,
    operation: parsed.data.operation,
    parameters: parsed.data.parameters,
    status: 'pending',
  }).returning()
  
  processExcelFile(newJob[0].id).catch(console.error)
  
  return c.json(newJob[0])
})

jobsRoute.post('/:id/cancel', async (c) => {
  const id = c.req.param('id')
  
  const updated = await db.update(processingJobs)
    .set({ status: 'failed', error: 'Job cancelled by user' })
    .where(eq(processingJobs.id, id))
    .returning()
  
  if (updated.length === 0) {
    return c.json({ error: 'Job not found' }, 404)
  }
  
  return c.json(updated[0])
})