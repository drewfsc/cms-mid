/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Grid3x3, 
  List, 
  Filter, 
  X, 
  Check, 
  Eye, 
  Download, 
  Edit, 
  Trash2,
  Folder,
  Upload,
  Image as ImageIcon,
  Video,
  FileText,
  Music
} from 'lucide-react';
import { MediaLibraryManager, MediaFile, MediaFolder } from '@/lib/media-library';
import FileUpload from './FileUpload';
import ImageViewerModal from './ImageViewerModal';

interface MediaBrowserProps {
  onSelect?: (file: MediaFile) => void;
  onSelectMultiple?: (files: MediaFile[]) => void;
  multiple?: boolean;
  acceptedTypes?: ('image' | 'video' | 'document' | 'audio')[];
  showUpload?: boolean;
  className?: string;
}

type ViewMode = 'grid' | 'list';
type SortBy = 'name' | 'date' | 'size' | 'type';

const MediaBrowser: React.FC<MediaBrowserProps> = ({
  onSelect,
  onSelectMultiple,
  multiple = false,
  acceptedTypes = ['image'],
  showUpload = true,
  className = ''
}) => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImage, setSelectedImage] = useState<MediaFile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = useCallback(() => {
    setIsLoading(true);
    try {
      const mediaFiles = MediaLibraryManager.getMediaFiles(selectedFolder || undefined);
      const filteredFiles = filterFiles(mediaFiles);
      setFiles(filteredFiles);
      
      const mediaFolders = MediaLibraryManager.getFolders();
      setFolders(mediaFolders);
    } catch (error) {
      console.error('Failed to load media:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedFolder]);

  const filterFiles = useCallback((mediaFiles: MediaFile[]) => {
    let filtered = mediaFiles;

    // Filter by accepted types
    if (acceptedTypes.length > 0) {
      filtered = filtered.filter(file => acceptedTypes.includes(file.type));
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(file =>
        file.name.toLowerCase().includes(query) ||
        file.originalName.toLowerCase().includes(query) ||
        file.alt?.toLowerCase().includes(query) ||
        file.caption?.toLowerCase().includes(query) ||
        file.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort files
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
        case 'size':
          return b.size - a.size;
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return filtered;
  }, [acceptedTypes, searchQuery, sortBy]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  const handleFileSelect = (file: MediaFile) => {
    if (multiple) {
      const newSelected = new Set(selectedFiles);
      if (newSelected.has(file.id)) {
        newSelected.delete(file.id);
      } else {
        newSelected.add(file.id);
      }
      setSelectedFiles(newSelected);
    } else {
      onSelect?.(file);
    }
  };

  const handleConfirmSelection = () => {
    if (multiple && selectedFiles.size > 0) {
      const selectedMediaFiles = files.filter(file => selectedFiles.has(file.id));
      onSelectMultiple?.(selectedMediaFiles);
    }
  };

  const handleUploadComplete = (uploadedFiles: MediaFile[]) => {
    setShowUploadModal(false);
    loadMedia();
  };

  const getFileIcon = (file: MediaFile) => {
    switch (file.type) {
      case 'image':
        return <ImageIcon className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'audio':
        return <Music className="w-5 h-5" />;
      case 'document':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading media...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Media Library
          </h3>
          
          <div className="flex items-center space-x-2">
            {showUpload && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </button>
            )}
            
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="size">Sort by Size</option>
            <option value="type">Sort by Type</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {files.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No media found
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery ? 'Try adjusting your search terms' : 'Upload some files to get started'}
            </p>
            {showUpload && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upload Files
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      selectedFiles.has(file.id)
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => handleFileSelect(file)}
                  >
                    {/* Selection Indicator */}
                    {multiple && (
                      <div className="absolute top-2 left-2 z-10">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedFiles.has(file.id)
                            ? 'bg-blue-500 border-blue-500'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                        }`}>
                          {selectedFiles.has(file.id) && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                    )}

                    {/* File Preview */}
                    <div className="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      {file.type === 'image' ? (
                        <img
                          src={file.url}
                          alt={file.alt || file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          {getFileIcon(file)}
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {file.type}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="p-2 bg-white dark:bg-gray-800">
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (file.type === 'image') {
                              setSelectedImage(file);
                              setShowImageViewer(true);
                            } else {
                              // For non-image files, try to open in new tab
                              try {
                                window.open(file.url, '_blank');
                              } catch (error) {
                                console.warn('Cannot open file in new tab:', error);
                              }
                            }
                          }}
                          className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const link = document.createElement('a');
                            link.href = file.url;
                            link.download = file.name;
                            link.click();
                          }}
                          className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <Download className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center p-3 rounded-lg border transition-all cursor-pointer ${
                      selectedFiles.has(file.id)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => handleFileSelect(file)}
                  >
                    {/* Selection Checkbox */}
                    {multiple && (
                      <div className="mr-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          selectedFiles.has(file.id)
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {selectedFiles.has(file.id) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>
                    )}

                    {/* File Icon */}
                    <div className="mr-3">
                      {getFileIcon(file)}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (file.type === 'image') {
                            setSelectedImage(file);
                            setShowImageViewer(true);
                          } else {
                            // For non-image files, try to open in new tab
                            try {
                              window.open(file.url, '_blank');
                            } catch (error) {
                              console.warn('Cannot open file in new tab:', error);
                            }
                          }
                        }}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const link = document.createElement('a');
                          link.href = file.url;
                          link.download = file.name;
                          link.click();
                        }}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                      >
                        <Download className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Selection Actions */}
      {multiple && selectedFiles.size > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {selectedFiles.size} file{selectedFiles.size !== 1 ? 's' : ''} selected
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedFiles(new Set())}
                className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Clear
              </button>
              <button
                onClick={handleConfirmSelection}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Select Files
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Upload Files
                </h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <FileUpload
                onUploadComplete={handleUploadComplete}
                multiple={true}
                folder={selectedFolder || 'uploads'}
                acceptedTypes={acceptedTypes.flatMap(type => {
                  switch (type) {
                    case 'image':
                      return ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                    case 'video':
                      return ['video/mp4', 'video/webm', 'video/ogg'];
                    case 'audio':
                      return ['audio/mp3', 'audio/wav', 'audio/ogg'];
                    case 'document':
                      return ['application/pdf', 'text/plain'];
                    default:
                      return [];
                  }
                })}
              />
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      {selectedImage && (
        <ImageViewerModal
          isOpen={showImageViewer}
          onClose={() => {
            setShowImageViewer(false);
            setSelectedImage(null);
          }}
          imageUrl={selectedImage.url}
          imageName={selectedImage.name}
          imageAlt={selectedImage.alt}
        />
      )}
    </div>
  );
};

export default MediaBrowser;
