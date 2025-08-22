'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/lib/api'

interface ProcessingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fileId: string
}

export function ProcessingDialog({ open, onOpenChange, fileId }: ProcessingDialogProps) {
  const [operation, setOperation] = useState<string>('')
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: agents } = useQuery({
    queryKey: ['agents'],
    queryFn: api.agents.list,
  })

  const createJobMutation = useMutation({
    mutationFn: api.jobs.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      toast({
        title: 'Processing started',
        description: 'Your Excel file is being processed',
      })
      onOpenChange(false)
    },
    onError: (error) => {
      toast({
        title: 'Failed to start processing',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const handleStartProcessing = () => {
    if (operation) {
      createJobMutation.mutate({
        fileId,
        operation,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Process Excel File</DialogTitle>
          <DialogDescription>
            Select an operation to perform on your Excel file
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="operation">Operation</Label>
            <Select value={operation} onValueChange={setOperation}>
              <SelectTrigger id="operation">
                <SelectValue placeholder="Select an operation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="analyze">Analyze Data</SelectItem>
                <SelectItem value="transform">Transform Data</SelectItem>
                <SelectItem value="validate">Validate Data</SelectItem>
                <SelectItem value="extract">Extract Data</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {operation && agents && (
            <div className="rounded-lg border p-4">
              <h4 className="font-medium mb-2">
                {agents.find((a: any) => a.name.toLowerCase().includes(operation))?.name}
              </h4>
              <p className="text-sm text-muted-foreground">
                {agents.find((a: any) => a.name.toLowerCase().includes(operation))?.description}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleStartProcessing}
            disabled={!operation || createJobMutation.isPending}
          >
            {createJobMutation.isPending ? 'Starting...' : 'Start Processing'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}