import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'
import { Upload, X, FileText } from 'lucide-react'
import { fileApi } from '../lib/api'
import { formatFileSize } from '../lib/utils'

interface UploadingFile {
  file: File
  progress: number
  status: 'uploading' | 'completed' | 'error'
  error?: string
}

export function UploadZone() {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [description, setDescription] = useState('')
  const queryClient = useQueryClient()

  const uploadMutation = useMutation(
    ({ file, description }: { file: File; description?: string }) =>
      fileApi.upload(file, description),
    {
      onSuccess: (data, variables) => {
        toast.success(`File "${variables.file.name}" uploaded successfully!`)
        setUploadingFiles(prev => 
          prev.map(f => 
            f.file === variables.file 
              ? { ...f, status: 'completed' as const, progress: 100 }
              : f
          )
        )
        // Refresh file list
        queryClient.invalidateQueries(['files'])
        queryClient.invalidateQueries(['stats'])
      },
      onError: (error: any, variables) => {
        toast.error(`Failed to upload "${variables.file.name}": ${error.message}`)
        setUploadingFiles(prev => 
          prev.map(f => 
            f.file === variables.file 
              ? { ...f, status: 'error' as const, error: error.message }
              : f
          )
        )
      },
    }
  )

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadingFile[] = acceptedFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const,
    }))

    setUploadingFiles(prev => [...prev, ...newFiles])

    // Upload each file
    acceptedFiles.forEach(file => {
      uploadMutation.mutate({ file, description: description || undefined })
    })
  }, [uploadMutation, description])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: 100 * 1024 * 1024, // 100MB
  })

  const removeFile = (file: File) => {
    setUploadingFiles(prev => prev.filter(f => f.file !== file))
  }

  const clearCompleted = () => {
    setUploadingFiles(prev => prev.filter(f => f.status === 'uploading'))
  }

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Upload Files</h2>
        
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          {isDragActive ? (
            <p className="text-primary-600 font-medium">Drop the files here...</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">
                Drag & drop files here, or click to select files
              </p>
              <p className="text-sm text-gray-500">
                Maximum file size: 100MB
              </p>
            </div>
          )}
        </div>

        {/* Description Input */}
        <div className="mt-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description (optional)
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description for your files..."
            className="input"
          />
        </div>
      </div>

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Upload Progress</h3>
            <button
              onClick={clearCompleted}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear completed
            </button>
          </div>
          
          <div className="space-y-3">
            {uploadingFiles.map((uploadingFile, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-sm">{uploadingFile.file.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(uploadingFile.file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(uploadingFile.file)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {uploadingFile.status === 'uploading' && 'Uploading...'}
                      {uploadingFile.status === 'completed' && 'Completed'}
                      {uploadingFile.status === 'error' && 'Error'}
                    </span>
                    <span className="text-gray-600">{uploadingFile.progress}%</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        uploadingFile.status === 'completed'
                          ? 'bg-green-500'
                          : uploadingFile.status === 'error'
                          ? 'bg-red-500'
                          : 'bg-primary-500'
                      }`}
                      style={{ width: `${uploadingFile.progress}%` }}
                    />
                  </div>
                  
                  {uploadingFile.error && (
                    <p className="text-sm text-red-600">{uploadingFile.error}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 