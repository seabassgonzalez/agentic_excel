'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { FileSpreadsheet, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react'

export function JobsList() {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: api.jobs.list,
    refetchInterval: 2000,
  })

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!jobs || jobs.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No processing jobs yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {jobs.map((job: any) => (
        <Card key={job.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">
                {job.operation.charAt(0).toUpperCase() + job.operation.slice(1)} Operation
              </CardTitle>
              <Badge variant={getStatusVariant(job.status)}>
                {job.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-2 h-4 w-4" />
                {new Date(job.createdAt).toLocaleString()}
              </div>
              
              {job.status === 'processing' && (
                <Progress value={33} className="h-2" />
              )}
              
              {job.status === 'completed' && job.result && (
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium mb-1">Result:</p>
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(job.result, null, 2)}
                  </pre>
                </div>
              )}
              
              {job.status === 'failed' && job.error && (
                <div className="mt-2 p-3 bg-destructive/10 rounded-md">
                  <p className="text-sm text-destructive">{job.error}</p>
                </div>
              )}
              
              <div className="flex justify-end mt-2">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function getStatusVariant(status: string) {
  switch (status) {
    case 'completed':
      return 'default'
    case 'processing':
      return 'secondary'
    case 'failed':
      return 'destructive'
    default:
      return 'outline'
  }
}