/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, FileImage, FileVideo, FileText, Music, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { MediaLibraryManager, MediaFile } from '@/lib/media-library';

interface FileUploadProps {
  onUploadComplete?: (files: MediaFile[]) => void;
  onUploadError?: (error: string) => void;
  multiple?: boolean;
  acceptedTypes?: string[];
  maxFiles?: number;
  folder?: string;
  className?: string;
}

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
  result?: MediaFile;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  onUploadError,
  multiple = true,
  acceptedTypes,
  maxFiles = 10,
  folder = 'uploads',
  className = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  }, []);

  const handleFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    // Validate file count
    if (files.length > maxFiles) {
      onUploadError?.(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate file types
    const invalidFiles = files.filter(file => {
      if (acceptedTypes && acceptedTypes.length > 0) {
        return !acceptedTypes.includes(file.type);
      }
      return false;
    });

    if (invalidFiles.length > 0) {
      onUploadError?.(`Invalid file types: ${invalidFiles.map(f => f.name).join(', ')}`);
      return;
    }

    setIsUploading(true);
    const newUploadingFiles: UploadingFile[] = files.map(file => ({
      id: `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      file,
      progress: 0,
      status: 'uploading'
    }));

    setUploadingFiles(newUploadingFiles);

    // Upload files
    const uploadPromises = newUploadingFiles.map(async (uploadingFile) => {
      try {
        const result = await MediaLibraryManager.uploadFile(uploadingFile.file, folder);
        
        setUploadingFiles(prev => prev.map(uf => 
          uf.id === uploadingFile.id 
            ? { ...uf, status: 'success', progress: 100, result }
            : uf
        ));
        
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        
        setUploadingFiles(prev => prev.map(uf => 
          uf.id === uploadingFile.id 
            ? { ...uf, status: 'error', error: errorMessage }
            : uf
        ));
        
        return null;
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter((result): result is MediaFile => result !== null);
      
      if (successfulUploads.length > 0) {
        onUploadComplete?.(successfulUploads);
      }
    } catch (error) {
      onUploadError?.('Upload failed');
    } finally {
      setIsUploading(false);
      
      // Clear uploading files after a delay
      setTimeout(() => {
        setUploadingFiles([]);
      }, 3000);
    }
  }, [acceptedTypes, maxFiles, folder, onUploadComplete, onUploadError]);

  const removeUploadingFile = (id: string) => {
    setUploadingFiles(prev => prev.filter(uf => uf.id !== id));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <FileImage className="w-5 h-5" />;
    if (file.type.startsWith('video/')) return <FileVideo className="w-5 h-5" />;
    if (file.type.startsWith('audio/')) return <Music className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes?.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
            <Upload className="w-8 h-8 text-gray-600 dark:text-gray-400" />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {isDragOver ? 'Drop files here' : 'Upload files'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Drag and drop files here, or click to select files
            </p>
            {acceptedTypes && acceptedTypes.length > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Accepted types: {acceptedTypes.join(', ')}
              </p>
            )}
            {maxFiles > 1 && (
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Maximum {maxFiles} files
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Uploading Files ({uploadingFiles.length})
          </h4>
          
          {uploadingFiles.map((uploadingFile) => (
            <div
              key={uploadingFile.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  {getFileIcon(uploadingFile.file)}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {uploadingFile.file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(uploadingFile.file.size)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {uploadingFile.status === 'uploading' && (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  )}
                  {uploadingFile.status === 'success' && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  {uploadingFile.status === 'error' && (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  )}
                  
                  <button
                    onClick={() => removeUploadingFile(uploadingFile.id)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              {uploadingFile.status === 'uploading' && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadingFile.progress}%` }}
                  />
                </div>
              )}

              {/* Error Message */}
              {uploadingFile.status === 'error' && uploadingFile.error && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                  {uploadingFile.error}
                </p>
              )}

              {/* Success Message */}
              {uploadingFile.status === 'success' && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                  Upload successful
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
