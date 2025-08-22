const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export const api = {
  files: {
    upload: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      
      const res = await fetch(`${API_URL}/files/upload`, {
        method: 'POST',
        body: formData,
      })
      
      if (!res.ok) throw new Error('Failed to upload file')
      return res.json()
    },
    
    list: async () => {
      const res = await fetch(`${API_URL}/files`)
      if (!res.ok) throw new Error('Failed to fetch files')
      return res.json()
    },
    
    get: async (id: string) => {
      const res = await fetch(`${API_URL}/files/${id}`)
      if (!res.ok) throw new Error('Failed to fetch file')
      return res.json()
    },
    
    delete: async (id: string) => {
      const res = await fetch(`${API_URL}/files/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete file')
      return res.json()
    },
  },
  
  jobs: {
    create: async (data: { fileId: string; operation: string; parameters?: any }) => {
      const res = await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create job')
      return res.json()
    },
    
    list: async () => {
      const res = await fetch(`${API_URL}/jobs`)
      if (!res.ok) throw new Error('Failed to fetch jobs')
      return res.json()
    },
    
    get: async (id: string) => {
      const res = await fetch(`${API_URL}/jobs/${id}`)
      if (!res.ok) throw new Error('Failed to fetch job')
      return res.json()
    },
    
    cancel: async (id: string) => {
      const res = await fetch(`${API_URL}/jobs/${id}/cancel`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed to cancel job')
      return res.json()
    },
  },
  
  agents: {
    list: async () => {
      const res = await fetch(`${API_URL}/agents/agents`)
      if (!res.ok) throw new Error('Failed to fetch agents')
      return res.json()
    },
    
    logs: async (jobId: string) => {
      const res = await fetch(`${API_URL}/agents/logs?jobId=${jobId}`)
      if (!res.ok) throw new Error('Failed to fetch logs')
      return res.json()
    },
  },
}