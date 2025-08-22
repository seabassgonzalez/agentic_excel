import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { filesRoute } from './routes/files'
import { jobsRoute } from './routes/jobs'
import { agentsRoute } from './routes/agents'

const app = new Hono()

app.use('*', logger())
app.use('*', cors())

app.get('/', (c) => {
  return c.json({ message: 'Agentic Excel API' })
})

app.route('/api/files', filesRoute)
app.route('/api/jobs', jobsRoute)
app.route('/api/agents', agentsRoute)

const port = process.env.PORT || 3001
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})