/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

// Media Library Data Management
// Handles file uploads, storage, metadata, and organization

export interface MediaFile {
  id: string;
  name: string;
  originalName: string;
  url: string;
  thumbnailUrl?: string;
  type: 'image' | 'video' | 'document' | 'audio';
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number; // for video/audio
  alt?: string;
  caption?: string;
  tags: string[];
  folder: string;
  uploadedAt: string;
  uploadedBy: string;
  isPublic: boolean;
  metadata?: Record<string, unknown>;
}

export interface MediaFolder {
  id: string;
  name: string;
  parentId?: string;
  createdAt: string;
  createdBy: string;
  description?: string;
}

export interface MediaLibraryStats {
  totalFiles: number;
  totalSize: number;
  filesByType: Record<string, number>;
  recentUploads: MediaFile[];
  storageUsed: number;
  storageLimit: number;
}

export class MediaLibraryManager {
  private static readonly STORAGE_KEY = 'media_library_files';
  private static readonly FOLDERS_KEY = 'media_library_folders';
  private static readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  private static readonly ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  private static readonly ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
  private static readonly ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  private static readonly ALLOWED_AUDIO_TYPES = ['audio/mp3', 'audio/wav', 'audio/ogg'];

  // File Management
  static async uploadFile(file: File, folder: string = 'uploads', metadata?: Record<string, unknown>): Promise<MediaFile> {
    return new Promise(async (resolve, reject) => {
      // Validate file
      if (!this.validateFile(file)) {
        reject(new Error('Invalid file type or size'));
        return;
      }

      // Generate unique ID
      const id = this.generateId();
      
      // Create file reader
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const dataUrl = e.target?.result as string;
          const dimensions = await this.getImageDimensions(dataUrl);
          
          const mediaFile: MediaFile = {
            id,
            name: this.generateFileName(file.name),
            originalName: file.name,
            url: dataUrl,
            thumbnailUrl: this.generateThumbnail(dataUrl, file.type),
            type: this.getFileType(file.type),
            mimeType: file.type,
            size: file.size,
            width: dimensions?.width,
            height: dimensions?.height,
            alt: '',
            caption: '',
            tags: [],
            folder,
            uploadedAt: new Date().toISOString(),
            uploadedBy: this.getCurrentUser(),
            isPublic: true,
            metadata: metadata || {}
          };

          // Save to storage
          this.saveMediaFile(mediaFile);
          resolve(mediaFile);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  static getMediaFiles(folder?: string): MediaFile[] {
    const files = this.getAllMediaFiles();
    if (folder) {
      return files.filter(file => file.folder === folder);
    }
    return files;
  }

  static getMediaFile(id: string): MediaFile | null {
    const files = this.getAllMediaFiles();
    return files.find(file => file.id === id) || null;
  }

  static updateMediaFile(id: string, updates: Partial<MediaFile>): boolean {
    const files = this.getAllMediaFiles();
    const index = files.findIndex(file => file.id === id);
    
    if (index === -1) return false;
    
    files[index] = { ...files[index], ...updates };
    this.saveAllMediaFiles(files);
    return true;
  }

  static deleteMediaFile(id: string): boolean {
    const files = this.getAllMediaFiles();
    const filteredFiles = files.filter(file => file.id !== id);
    
    if (filteredFiles.length === files.length) return false;
    
    this.saveAllMediaFiles(filteredFiles);
    return true;
  }

  static searchMediaFiles(query: string, type?: string): MediaFile[] {
    const files = this.getAllMediaFiles();
    let filtered = files;

    if (query) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(file => 
        file.name.toLowerCase().includes(searchTerm) ||
        file.originalName.toLowerCase().includes(searchTerm) ||
        file.alt?.toLowerCase().includes(searchTerm) ||
        file.caption?.toLowerCase().includes(searchTerm) ||
        file.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    if (type) {
      filtered = filtered.filter(file => file.type === type);
    }

    return filtered.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }

  // Folder Management
  static createFolder(name: string, parentId?: string): MediaFolder {
    const folder: MediaFolder = {
      id: this.generateId(),
      name,
      parentId,
      createdAt: new Date().toISOString(),
      createdBy: this.getCurrentUser(),
      description: ''
    };

    const folders = this.getAllFolders();
    folders.push(folder);
    this.saveAllFolders(folders);

    return folder;
  }

  static getFolders(): MediaFolder[] {
    return this.getAllFolders();
  }

  static updateFolder(id: string, updates: Partial<MediaFolder>): boolean {
    const folders = this.getAllFolders();
    const index = folders.findIndex(folder => folder.id === id);
    
    if (index === -1) return false;
    
    folders[index] = { ...folders[index], ...updates };
    this.saveAllFolders(folders);
    return true;
  }

  static deleteFolder(id: string): boolean {
    const folders = this.getAllFolders();
    const filteredFolders = folders.filter(folder => folder.id !== id);
    
    if (filteredFolders.length === folders.length) return false;
    
    this.saveAllFolders(filteredFolders);
    return true;
  }

  // Statistics
  static getStats(): MediaLibraryStats {
    const files = this.getAllMediaFiles();
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    
    const filesByType = files.reduce((acc, file) => {
      acc[file.type] = (acc[file.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentUploads = files
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
      .slice(0, 10);

    return {
      totalFiles: files.length,
      totalSize,
      filesByType,
      recentUploads,
      storageUsed: totalSize,
      storageLimit: 100 * 1024 * 1024 * 1024 // 100GB limit
    };
  }

  // Utility Methods
  private static validateFile(file: File): boolean {
    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      return false;
    }

    // Check file type
    const allowedTypes = [
      ...this.ALLOWED_IMAGE_TYPES,
      ...this.ALLOWED_VIDEO_TYPES,
      ...this.ALLOWED_DOCUMENT_TYPES,
      ...this.ALLOWED_AUDIO_TYPES
    ];

    return allowedTypes.includes(file.type);
  }

  private static getFileType(mimeType: string): 'image' | 'video' | 'document' | 'audio' {
    if (this.ALLOWED_IMAGE_TYPES.includes(mimeType)) return 'image';
    if (this.ALLOWED_VIDEO_TYPES.includes(mimeType)) return 'video';
    if (this.ALLOWED_AUDIO_TYPES.includes(mimeType)) return 'audio';
    return 'document';
  }

  private static generateThumbnail(dataUrl: string, mimeType: string): string | undefined {
    if (!this.ALLOWED_IMAGE_TYPES.includes(mimeType)) {
      return undefined;
    }

    // For now, return the original data URL as thumbnail
    // In a real implementation, you'd generate actual thumbnails
    return dataUrl;
  }

  private static getImageDimensions(dataUrl: string): Promise<{ width: number; height: number } | undefined> {
    return new Promise<{ width: number; height: number } | undefined>((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => resolve(undefined);
      img.src = dataUrl;
    });
  }

  private static generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const extension = originalName.split('.').pop();
    const baseName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_');
    return `${baseName}_${timestamp}.${extension}`;
  }

  private static generateId(): string {
    return `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static getCurrentUser(): string {
    // In a real app, this would get the current authenticated user
    return 'admin@reign.com';
  }

  // Storage Methods
  private static getAllMediaFiles(): MediaFile[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private static saveMediaFile(file: MediaFile): void {
    const files = this.getAllMediaFiles();
    files.push(file);
    this.saveAllMediaFiles(files);
  }

  private static saveAllMediaFiles(files: MediaFile[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(files));
    } catch (error) {
      console.error('Failed to save media files:', error);
    }
  }

  private static getAllFolders(): MediaFolder[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.FOLDERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private static saveAllFolders(folders: MediaFolder[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.FOLDERS_KEY, JSON.stringify(folders));
    } catch (error) {
      console.error('Failed to save folders:', error);
    }
  }

  // Batch Operations
  static bulkDeleteFiles(ids: string[]): number {
    const files = this.getAllMediaFiles();
    const filteredFiles = files.filter(file => !ids.includes(file.id));
    this.saveAllMediaFiles(filteredFiles);
    return files.length - filteredFiles.length;
  }

  static bulkUpdateFiles(updates: Array<{ id: string; updates: Partial<MediaFile> }>): number {
    const files = this.getAllMediaFiles();
    let updatedCount = 0;

    updates.forEach(({ id, updates: fileUpdates }) => {
      const index = files.findIndex(file => file.id === id);
      if (index !== -1) {
        files[index] = { ...files[index], ...fileUpdates };
        updatedCount++;
      }
    });

    if (updatedCount > 0) {
      this.saveAllMediaFiles(files);
    }

    return updatedCount;
  }

  // Export/Import
  static exportMediaLibrary(): string {
    const files = this.getAllMediaFiles();
    const folders = this.getAllFolders();
    return JSON.stringify({ files, folders }, null, 2);
  }

  static importMediaLibrary(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      if (parsed.files && Array.isArray(parsed.files)) {
        this.saveAllMediaFiles(parsed.files);
      }
      if (parsed.folders && Array.isArray(parsed.folders)) {
        this.saveAllFolders(parsed.folders);
      }
      return true;
    } catch {
      return false;
    }
  }
}
