import { FileUpload } from '@/components/file-upload'
import { JobsList } from '@/components/jobs-list'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Agentic Excel</h1>
          <p className="text-muted-foreground">AI-powered Excel processing platform</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xl font-semibold">Upload Excel File</h2>
            <FileUpload />
          </div>
          
          <div>
            <h2 className="mb-4 text-xl font-semibold">Processing Jobs</h2>
            <JobsList />
          </div>
        </div>
      </main>
    </div>
  )
}