import { db } from '../db'
import { processingJobs, agentLogs, files } from '../db/schema'
import { eq } from 'drizzle-orm'
import { ExcelAgent } from './excel-agent'
import * as XLSX from 'xlsx'

export async function processExcelFile(jobId: string) {
  try {
    await db.update(processingJobs)
      .set({ status: 'processing', updatedAt: new Date() })
      .where(eq(processingJobs.id, jobId))
    
    const [job] = await db.select().from(processingJobs).where(eq(processingJobs.id, jobId))
    const [file] = await db.select().from(files).where(eq(files.id, job.fileId))
    
    const agent = new ExcelAgent(job.operation)
    
    await db.insert(agentLogs).values({
      jobId,
      agentName: agent.name,
      action: 'start',
      input: { operation: job.operation, parameters: job.parameters },
    })
    
    const result = await agent.process(file, job.parameters)
    
    await db.insert(agentLogs).values({
      jobId,
      agentName: agent.name,
      action: 'complete',
      output: result,
    })
    
    await db.update(processingJobs)
      .set({ 
        status: 'completed', 
        result,
        updatedAt: new Date() 
      })
      .where(eq(processingJobs.id, jobId))
    
  } catch (error) {
    await db.insert(agentLogs).values({
      jobId,
      agentName: 'system',
      action: 'error',
      output: { error: error instanceof Error ? error.message : 'Unknown error' },
    })
    
    await db.update(processingJobs)
      .set({ 
        status: 'failed', 
        error: error instanceof Error ? error.message : 'Unknown error',
        updatedAt: new Date() 
      })
      .where(eq(processingJobs.id, jobId))
  }
}