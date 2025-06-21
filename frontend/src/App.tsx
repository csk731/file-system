import React from 'react'
import { useQuery } from 'react-query'
import { UploadZone } from './components/UploadZone'
import { FileList } from './components/FileList'
import { Stats } from './components/Stats'
import { api } from './lib/api'
import { FileIcon, Upload, BarChart3 } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = React.useState<'upload' | 'files' | 'stats'>('upload')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <FileIcon className="h-8 w-8 text-primary-600" />
              <h1 className="text-xl font-semibold text-gray-900">
                File Upload/Download System
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'upload'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'files'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileIcon className="h-4 w-4" />
              <span>Files</span>
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'stats'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Stats</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'upload' && <UploadZone />}
        {activeTab === 'files' && <FileList />}
        {activeTab === 'stats' && <Stats />}
      </main>
    </div>
  )
}

export default App 