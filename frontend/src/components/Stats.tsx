import React from 'react'
import { useQuery } from 'react-query'
import { BarChart3, HardDrive, FileText, Upload, Download } from 'lucide-react'
import { fileApi } from '../lib/api'
import { formatFileSize } from '../lib/utils'

export function Stats() {
  const { data: stats, isLoading, error } = useQuery(
    ['stats'],
    () => fileApi.getStats(),
    {
      refetchInterval: 30000, // Refresh every 30 seconds
    }
  )

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600">Loading statistics...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <p className="text-red-600">Failed to load statistics. Please try again.</p>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Files',
      value: stats?.total_files || 0,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Storage Used',
      value: stats?.total_size_formatted || '0 B',
      icon: HardDrive,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Max File Size',
      value: formatFileSize(stats?.max_file_size || 0),
      icon: Upload,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <BarChart3 className="h-6 w-6 text-primary-600" />
          <h2 className="text-lg font-semibold">System Statistics</h2>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Allowed File Types */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Allowed File Types</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {stats?.allowed_extensions?.map((ext: string, index: number) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center"
              >
                <span className="text-sm font-mono text-gray-700">{ext}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Storage Details</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Total Files:</span>
                <span className="font-mono">{stats?.total_files || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Size (Bytes):</span>
                <span className="font-mono">{stats?.total_size_bytes || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Size (Formatted):</span>
                <span className="font-mono">{stats?.total_size_formatted || '0 B'}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Upload Limits</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Max File Size (Bytes):</span>
                <span className="font-mono">{stats?.max_file_size || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Max File Size (Formatted):</span>
                <span className="font-mono">{formatFileSize(stats?.max_file_size || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Allowed Extensions:</span>
                <span className="font-mono">{stats?.allowed_extensions?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Tips */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Usage Tips</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
            <p>Drag and drop files directly onto the upload zone for quick uploads</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
            <p>Add descriptions to your files to make them easier to find later</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
            <p>Use the search function to quickly find specific files</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
            <p>Files are automatically organized by upload date</p>
          </div>
        </div>
      </div>
    </div>
  )
} 