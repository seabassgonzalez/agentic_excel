import { Hono } from 'hono'
import { z } from 'zod'
import { db } from '../db'
import { files, insertFileSchema } from '../db/schema'
import { eq } from 'drizzle-orm'

export const filesRoute = new Hono()

filesRoute.get('/', async (c) => {
  const allFiles = await db.select().from(files).orderBy(files.uploadedAt)
  return c.json(allFiles)
})

filesRoute.get('/:id', async (c) => {
  const id = c.req.param('id')
  const file = await db.select().from(files).where(eq(files.id, id)).limit(1)
  
  if (file.length === 0) {
    return c.json({ error: 'File not found' }, 404)
  }
  
  return c.json(file[0])
})

filesRoute.post('/upload', async (c) => {
  const body = await c.req.parseBody()
  const file = body['file'] as File
  
  if (!file) {
    return c.json({ error: 'No file provided' }, 400)
  }
  
  const buffer = await file.arrayBuffer()
  const bytes = new Uint8Array(buffer)
  
  const newFile = await db.insert(files).values({
    filename: crypto.randomUUID() + '-' + file.name,
    originalName: file.name,
    mimeType: file.type,
    size: bytes.length,
  }).returning()
  
  return c.json(newFile[0])
})

filesRoute.delete('/:id', async (c) => {
  const id = c.req.param('id')
  const deleted = await db.delete(files).where(eq(files.id, id)).returning()
  
  if (deleted.length === 0) {
    return c.json({ error: 'File not found' }, 404)
  }
  
  return c.json({ message: 'File deleted successfully' })
})