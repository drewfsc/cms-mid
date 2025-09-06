/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

// Supabase Media Library Data Management
// Handles file uploads, storage, metadata, and organization using Supabase

import { supabase } from './supabase';
import type { Database } from './supabase';

type MediaFile = Database['public']['Tables']['media_files']['Row'];
type MediaFileInsert = Database['public']['Tables']['media_files']['Insert'];
type MediaFileUpdate = Database['public']['Tables']['media_files']['Update'];
type MediaFolder = Database['public']['Tables']['media_folders']['Row'];
type MediaFolderInsert = Database['public']['Tables']['media_folders']['Insert'];

export interface MediaLibraryStats {
  totalFiles: number;
  totalSize: number;
  filesByType: Record<string, number>;
  recentUploads: MediaFile[];
  storageUsed: number;
  storageLimit: number;
}

export class SupabaseMediaLibraryManager {
  private static readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  private static readonly ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  private static readonly ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
  private static readonly ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  private static readonly ALLOWED_AUDIO_TYPES = ['audio/mp3', 'audio/wav', 'audio/ogg'];

  // File Management
  static async uploadFile(file: File, folder: string = 'uploads', metadata?: Record<string, unknown>): Promise<MediaFile> {
    // Validate file
    if (!this.validateFile(file)) {
      throw new Error('Invalid file type or size');
    }

    // Generate unique ID
    const id = this.generateId();
    
    // Convert file to base64
    const dataUrl = await this.fileToDataUrl(file);
    
    // Get image dimensions if it's an image
    const dimensions = await this.getImageDimensions(dataUrl);
    
    const mediaFileInsert: MediaFileInsert = {
      id,
      name: this.generateFileName(file.name),
      original_name: file.name,
      url: dataUrl, // base64 data URL
      thumbnail_url: this.generateThumbnail(dataUrl, file.type),
      type: this.getFileType(file.type),
      mime_type: file.type,
      size: file.size,
      width: dimensions?.width,
      height: dimensions?.height,
      alt: '',
      caption: '',
      tags: [],
      folder,
      uploaded_by: this.getCurrentUser(),
      is_public: true,
      metadata: metadata || {}
    };

    const { data, error } = await supabase
      .from('media_files')
      .insert(mediaFileInsert)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    return data;
  }

  static async getMediaFiles(folder?: string): Promise<MediaFile[]> {
    let query = supabase
      .from('media_files')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (folder) {
      query = query.eq('folder', folder);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching media files:', error);
      return [];
    }

    return data || [];
  }

  static async getMediaFile(id: string): Promise<MediaFile | null> {
    const { data, error } = await supabase
      .from('media_files')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching media file:', error);
      return null;
    }

    return data;
  }

  static async updateMediaFile(id: string, updates: MediaFileUpdate): Promise<boolean> {
    const { error } = await supabase
      .from('media_files')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating media file:', error);
      return false;
    }

    return true;
  }

  static async deleteMediaFile(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('media_files')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting media file:', error);
      return false;
    }

    return true;
  }

  static async searchMediaFiles(query: string, type?: string): Promise<MediaFile[]> {
    let supabaseQuery = supabase
      .from('media_files')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (query) {
      // Search in name, original_name, alt, caption, and tags
      supabaseQuery = supabaseQuery.or(
        `name.ilike.%${query}%,original_name.ilike.%${query}%,alt.ilike.%${query}%,caption.ilike.%${query}%`
      );
    }

    if (type) {
      supabaseQuery = supabaseQuery.eq('type', type);
    }

    const { data, error } = await supabaseQuery;

    if (error) {
      console.error('Error searching media files:', error);
      return [];
    }

    return data || [];
  }

  // Folder Management
  static async createFolder(name: string, parentId?: string): Promise<MediaFolder> {
    const folderInsert: MediaFolderInsert = {
      name,
      parent_id: parentId,
      created_by: this.getCurrentUser(),
      description: ''
    };

    const { data, error } = await supabase
      .from('media_folders')
      .insert(folderInsert)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create folder: ${error.message}`);
    }

    return data;
  }

  static async getFolders(): Promise<MediaFolder[]> {
    const { data, error } = await supabase
      .from('media_folders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching folders:', error);
      return [];
    }

    return data || [];
  }

  static async updateFolder(id: string, updates: Partial<MediaFolderInsert>): Promise<boolean> {
    const { error } = await supabase
      .from('media_folders')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating folder:', error);
      return false;
    }

    return true;
  }

  static async deleteFolder(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('media_folders')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting folder:', error);
      return false;
    }

    return true;
  }

  // Statistics
  static async getStats(): Promise<MediaLibraryStats> {
    const { data, error } = await supabase.rpc('get_media_stats');

    if (error) {
      console.error('Error fetching stats:', error);
      return {
        totalFiles: 0,
        totalSize: 0,
        filesByType: {},
        recentUploads: [],
        storageUsed: 0,
        storageLimit: 100 * 1024 * 1024 * 1024 // 100GB default limit
      };
    }

    return {
      totalFiles: data[0]?.total_files || 0,
      totalSize: data[0]?.total_size || 0,
      filesByType: data[0]?.files_by_type || {},
      recentUploads: data[0]?.recent_uploads || [],
      storageUsed: data[0]?.total_size || 0,
      storageLimit: 100 * 1024 * 1024 * 1024 // 100GB default limit
    };
  }

  // Batch Operations
  static async bulkDeleteFiles(ids: string[]): Promise<number> {
    const { error } = await supabase
      .from('media_files')
      .delete()
      .in('id', ids);

    if (error) {
      console.error('Error bulk deleting files:', error);
      return 0;
    }

    return ids.length;
  }

  static async moveFilesToFolder(fileIds: string[], folderName: string): Promise<boolean> {
    const { error } = await supabase
      .from('media_files')
      .update({ folder: folderName })
      .in('id', fileIds);

    if (error) {
      console.error('Error moving files to folder:', error);
      return false;
    }

    return true;
  }

  // Utility Methods
  private static validateFile(file: File): boolean {
    if (file.size > this.MAX_FILE_SIZE) {
      return false;
    }

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

  private static async getImageDimensions(dataUrl: string): Promise<{ width: number; height: number } | undefined> {
    return new Promise((resolve) => {
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
    const extension = originalName.split('.').pop() || '';
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '-');
    return `${sanitizedName}-${timestamp}.${extension}`;
  }

  private static generateId(): string {
    return `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static getCurrentUser(): string {
    // In a real implementation, get from Supabase auth
    return 'anonymous';
  }

  private static async fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve(result);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  // Migration utility
  static async migrateFromLocalStorage(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      // Get localStorage data
      const storedFiles = localStorage.getItem('media_library_files');
      const storedFolders = localStorage.getItem('media_library_folders');

      if (storedFiles) {
        const files = JSON.parse(storedFiles);
        for (const file of files) {
          try {
            await this.uploadFile(
              new File([file.url], file.originalName, { type: file.mimeType }),
              file.folder,
              file.metadata
            );
          } catch (error) {
            console.error('Error migrating file:', file.name, error);
          }
        }
      }

      if (storedFolders) {
        const folders = JSON.parse(storedFolders);
        for (const folder of folders) {
          try {
            await this.createFolder(folder.name, folder.parentId);
          } catch (error) {
            console.error('Error migrating folder:', folder.name, error);
          }
        }
      }

      console.log('Migration completed successfully');
    } catch (error) {
      console.error('Migration failed:', error);
    }
  }
}

// Export types for compatibility
export type { MediaFile, MediaFolder };
