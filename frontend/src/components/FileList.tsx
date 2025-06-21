import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'
import { 
  Download, 
  Trash2, 
  FileText, 
  ChevronLeft, 
  ChevronRight,
  Search,
  Filter
} from 'lucide-react'
import { fileApi } from '../lib/api'
import { formatFileSize, formatDate, getFileIcon } from '../lib/utils'

export function FileList() {
  const [page, setPage] = useState(1)
  const [perPage] = useState(20)
  const [searchTerm, setSearchTerm] = useState('')
  const queryClient = useQueryClient()

  const { data: filesData, isLoading, error } = useQuery(
    ['files', page, perPage],
    () => fileApi.getFiles(page, perPage),
    {
      keepPreviousData: true,
    }
  )

  const deleteMutation = useMutation(
    (fileId: string) => fileApi.delete(fileId),
    {
      onSuccess: (data) => {
        toast.success('File deleted successfully!')
        queryClient.invalidateQueries(['files'])
        queryClient.invalidateQueries(['stats'])
      },
      onError: (error: any) => {
        toast.error(`Failed to delete file: ${error.message}`)
      },
    }
  )

  const downloadMutation = useMutation(
    ({ fileId, filename }: { fileId: string; filename: string }) =>
      fileApi.download(fileId).then((blob) => ({ blob, filename })),
    {
      onSuccess: ({ blob, filename }) => {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        toast.success('File downloaded successfully!')
      },
      onError: (error: any) => {
        toast.error(`Failed to download file: ${error.message}`)
      },
    }
  )

  const handleDelete = (fileId: string, filename: string) => {
    if (window.confirm(`Are you sure you want to delete "${filename}"?`)) {
      deleteMutation.mutate(fileId)
    }
  }

  const handleDownload = (fileId: string, filename: string) => {
    downloadMutation.mutate({ fileId, filename })
  }

  const filteredFiles = filesData?.files?.filter(file =>
    file.original_filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600">Loading files...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <p className="text-red-600">Failed to load files. Please try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Files</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Files List */}
        {filteredFiles.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">
              {searchTerm ? 'No files match your search.' : 'No files uploaded yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFiles.map((file) => (
              <div
                key={file.file_id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{getFileIcon(file.file_extension)}</div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{file.original_filename}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>{formatFileSize(file.file_size)}</span>
                        <span>•</span>
                        <span>{formatDate(file.upload_date)}</span>
                        {file.description && (
                          <>
                            <span>•</span>
                            <span className="italic">{file.description}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDownload(file.file_id, file.original_filename)}
                      disabled={downloadMutation.isLoading}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Download file"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(file.file_id, file.original_filename)}
                      disabled={deleteMutation.isLoading}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete file"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filesData && filesData.total_pages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, filesData.total)} of {filesData.total} files
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <span className="text-sm text-gray-600">
                Page {page} of {filesData.total_pages}
              </span>
              
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === filesData.total_pages}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 