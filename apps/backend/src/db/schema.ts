import { pgTable, serial, text, timestamp, jsonb, uuid, integer } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const files = pgTable('files', {
  id: uuid('id').defaultRandom().primaryKey(),
  filename: text('filename').notNull(),
  originalName: text('original_name').notNull(),
  mimeType: text('mime_type').notNull(),
  size: integer('size').notNull(),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
})

export const processingJobs = pgTable('processing_jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  fileId: uuid('file_id').references(() => files.id).notNull(),
  status: text('status', { enum: ['pending', 'processing', 'completed', 'failed'] }).notNull().default('pending'),
  operation: text('operation').notNull(),
  parameters: jsonb('parameters'),
  result: jsonb('result'),
  error: text('error'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const agentLogs = pgTable('agent_logs', {
  id: serial('id').primaryKey(),
  jobId: uuid('job_id').references(() => processingJobs.id).notNull(),
  agentName: text('agent_name').notNull(),
  action: text('action').notNull(),
  input: jsonb('input'),
  output: jsonb('output'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
})

export type File = typeof files.$inferSelect
export type NewFile = typeof files.$inferInsert
export type ProcessingJob = typeof processingJobs.$inferSelect
export type NewProcessingJob = typeof processingJobs.$inferInsert
export type AgentLog = typeof agentLogs.$inferSelect
export type NewAgentLog = typeof agentLogs.$inferInsert

export const insertFileSchema = createInsertSchema(files)
export const selectFileSchema = createSelectSchema(files)
export const insertProcessingJobSchema = createInsertSchema(processingJobs)
export const selectProcessingJobSchema = createSelectSchema(processingJobs)
export const insertAgentLogSchema = createInsertSchema(agentLogs)
export const selectAgentLogSchema = createSelectSchema(agentLogs)