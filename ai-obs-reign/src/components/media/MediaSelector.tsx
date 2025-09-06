/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  X, 
  Check, 
  Eye, 
  Download,
  Search,
  Grid3x3,
  List,
  Video,
  Music,
  FileText
} from 'lucide-react';
import { MediaLibraryManager, MediaFile } from '@/lib/media-library';
import FileUpload from './FileUpload';
import ImageViewerModal from './ImageViewerModal';

interface MediaSelectorProps {
  onSelect?: (file: MediaFile) => void;
  onSelectMultiple?: (files: MediaFile[]) => void;
  multiple?: boolean;
  acceptedTypes?: ('image' | 'video' | 'document' | 'audio')[];
  showUpload?: boolean;
  currentValue?: string | string[];
  className?: string;
}

const MediaSelector: React.FC<MediaSelectorProps> = ({
  onSelect,
  onSelectMultiple,
  multiple = false,
  acceptedTypes = ['image'],
  showUpload = true,
  currentValue,
  className = ''
}) => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImage, setSelectedImage] = useState<MediaFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (showModal) {
      loadFiles();
    }
  }, [showModal]);

  useEffect(() => {
    // Initialize selected files based on current value
    if (currentValue) {
      if (Array.isArray(currentValue)) {
        setSelectedFiles(new Set(currentValue));
      } else {
        setSelectedFiles(new Set([currentValue]));
      }
    }
  }, [currentValue]);

  const loadFiles = async () => {
    setIsLoading(true);
    try {
      const mediaFiles = MediaLibraryManager.getMediaFiles();
      const filteredFiles = mediaFiles.filter(file => {
        // Filter by accepted types
        if (acceptedTypes.length > 0 && !acceptedTypes.includes(file.type)) {
          return false;
        }
        
        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return file.name.toLowerCase().includes(query) ||
                 file.originalName.toLowerCase().includes(query) ||
                 file.alt?.toLowerCase().includes(query) ||
                 file.caption?.toLowerCase().includes(query) ||
                 file.tags.some(tag => tag.toLowerCase().includes(query));
        }
        
        return true;
      });
      
      setFiles(filteredFiles);
    } catch (error) {
      console.error('Failed to load files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showModal) {
      loadFiles();
    }
  }, [searchQuery, showModal]);

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
      setShowModal(false);
    }
  };

  const handleConfirmSelection = () => {
    if (multiple && selectedFiles.size > 0) {
      const selectedMediaFiles = files.filter(file => selectedFiles.has(file.id));
      onSelectMultiple?.(selectedMediaFiles);
      setShowModal(false);
    }
  };

  const handleUploadComplete = (uploadedFiles: MediaFile[]) => {
    setShowUploadModal(false);
    loadFiles();
    
    // Auto-select uploaded files if single selection
    if (!multiple && uploadedFiles.length > 0) {
      onSelect?.(uploadedFiles[0]);
      setShowModal(false);
    }
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
        return <ImageIcon className="w-5 h-5" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCurrentFile = (): MediaFile | null => {
    if (!currentValue || Array.isArray(currentValue)) return null;
    return MediaLibraryManager.getMediaFile(currentValue) || null;
  };

  const getCurrentFiles = (): MediaFile[] => {
    if (!currentValue || !Array.isArray(currentValue)) return [];
    return currentValue.map(id => MediaLibraryManager.getMediaFile(id)).filter(Boolean) as MediaFile[];
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Current Selection Display */}
      {multiple ? (
        <div className="space-y-2">
          {getCurrentFiles().map((file) => (
            <div key={file.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              {file.type === 'image' ? (
                <img
                  src={file.url}
                  alt={file.alt || file.name}
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                  {getFileIcon(file)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <button
                onClick={() => {
                  const newSelected = new Set(selectedFiles);
                  newSelected.delete(file.id);
                  setSelectedFiles(newSelected);
                }}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        getCurrentFile() && (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            {getCurrentFile()?.type === 'image' ? (
              <img
                src={getCurrentFile()?.url}
                alt={getCurrentFile()?.alt || getCurrentFile()?.name}
                className="w-12 h-12 object-cover rounded"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                {getCurrentFile() && getFileIcon(getCurrentFile()!)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {getCurrentFile()?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {getCurrentFile() && formatFileSize(getCurrentFile()!.size)}
              </p>
            </div>
            <button
              onClick={() => {
                // Clear selection by calling onSelect with undefined
                onSelect?.(undefined as unknown as MediaFile);
              }}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        )
      )}

      {/* Select Media Button */}
      <button
        onClick={() => setShowModal(true)}
        className="w-full mt-3 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
      >
        {multiple ? 'Select Media Files' : 'Select Media File'}
      </button>

      {/* Media Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-6xl w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {multiple ? 'Select Media Files' : 'Select Media File'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Search and Controls */}
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search media..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                
                {showUpload && (
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : files.length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
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
                <div className={`${viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4' : 'space-y-2'}`}>
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        selectedFiles.has(file.id)
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      } ${viewMode === 'list' ? 'flex items-center p-3' : ''}`}
                      onClick={() => handleFileSelect(file)}
                    >
                      {/* Selection Indicator */}
                      <div className={`${viewMode === 'grid' ? 'absolute top-2 left-2 z-10' : 'mr-3'}`}>
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

                      {/* File Preview */}
                      {viewMode === 'grid' ? (
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
                      ) : (
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                            {getFileIcon(file)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* File Info */}
                      {viewMode === 'grid' && (
                        <div className="p-2 bg-white dark:bg-gray-800">
                          <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      )}

                      {/* Hover Actions */}
                      <div className={`absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 ${viewMode === 'list' ? 'bg-opacity-0' : ''}`}>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (file.type === 'image') {
                                setSelectedImage(file);
                                setShowImageViewer(true);
                              } else {
                                // For non-image files, try to open in new tab
                                // This will work for regular URLs but not data URLs
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
            </div>

            {/* Footer */}
            {multiple && (
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedFiles.size} file{selectedFiles.size !== 1 ? 's' : ''} selected
                  </p>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmSelection}
                      disabled={selectedFiles.size === 0}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Select Files
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
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
                multiple={multiple}
                folder="uploads"
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

export default MediaSelector;
