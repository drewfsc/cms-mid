/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

// Migration utility to move from localStorage to Supabase
// This helps transition your existing media library data

import { SupabaseMediaLibraryManager } from './supabase-media-library';
import { MediaLibraryManager } from './media-library';

export interface MigrationProgress {
  totalFiles: number;
  migratedFiles: number;
  totalFolders: number;
  migratedFolders: number;
  errors: string[];
  isComplete: boolean;
}

export class MediaLibraryMigration {
  private static readonly STORAGE_KEY = 'media_library_files';
  private static readonly FOLDERS_KEY = 'media_library_folders';

  static async migrateToSupabase(): Promise<MigrationProgress> {
    const progress: MigrationProgress = {
      totalFiles: 0,
      migratedFiles: 0,
      totalFolders: 0,
      migratedFolders: 0,
      errors: [],
      isComplete: false
    };

    try {
      // Migrate folders first
      await this.migrateFolders(progress);
      
      // Then migrate files
      await this.migrateFiles(progress);
      
      progress.isComplete = true;
      console.log('Migration completed successfully:', progress);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      progress.errors.push(`Migration failed: ${errorMessage}`);
      console.error('Migration failed:', error);
    }

    return progress;
  }

  private static async migrateFolders(progress: MigrationProgress): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const storedFolders = localStorage.getItem(this.FOLDERS_KEY);
      if (!storedFolders) return;

      const folders = JSON.parse(storedFolders);
      progress.totalFolders = folders.length;

      for (const folder of folders) {
        try {
          await SupabaseMediaLibraryManager.createFolder(
            folder.name,
            folder.parentId
          );
          progress.migratedFolders++;
        } catch (error) {
          const errorMessage = `Failed to migrate folder "${folder.name}": ${error instanceof Error ? error.message : 'Unknown error'}`;
          progress.errors.push(errorMessage);
          console.error(errorMessage);
        }
      }
    } catch (error) {
      const errorMessage = `Failed to migrate folders: ${error instanceof Error ? error.message : 'Unknown error'}`;
      progress.errors.push(errorMessage);
      console.error(errorMessage);
    }
  }

  private static async migrateFiles(progress: MigrationProgress): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const storedFiles = localStorage.getItem(this.STORAGE_KEY);
      if (!storedFiles) return;

      const files = JSON.parse(storedFiles);
      progress.totalFiles = files.length;

      for (const file of files) {
        try {
          // Convert data URL back to File object
          const fileObj = await this.dataUrlToFile(file.url, file.originalName, file.mimeType);
          
          await SupabaseMediaLibraryManager.uploadFile(
            fileObj,
            file.folder,
            file.metadata as Record<string, unknown>
          );
          progress.migratedFiles++;
        } catch (error) {
          const errorMessage = `Failed to migrate file "${file.name}": ${error instanceof Error ? error.message : 'Unknown error'}`;
          progress.errors.push(errorMessage);
          console.error(errorMessage);
        }
      }
    } catch (error) {
      const errorMessage = `Failed to migrate files: ${error instanceof Error ? error.message : 'Unknown error'}`;
      progress.errors.push(errorMessage);
      console.error(errorMessage);
    }
  }

  private static async dataUrlToFile(dataUrl: string, filename: string, mimeType: string): Promise<File> {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  }

  static async exportLocalStorageData(): Promise<{ files: unknown[]; folders: unknown[] }> {
    if (typeof window === 'undefined') {
      return { files: [], folders: [] };
    }

    try {
      const files = localStorage.getItem(this.STORAGE_KEY);
      const folders = localStorage.getItem(this.FOLDERS_KEY);

      return {
        files: files ? JSON.parse(files) : [],
        folders: folders ? JSON.parse(folders) : []
      };
    } catch (error) {
      console.error('Failed to export localStorage data:', error);
      return { files: [], folders: [] };
    }
  }

  static async clearLocalStorageData(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.FOLDERS_KEY);
      console.log('LocalStorage data cleared successfully');
    } catch (error) {
      console.error('Failed to clear localStorage data:', error);
    }
  }

  static async validateMigration(): Promise<boolean> {
    try {
      // Check if Supabase has data
      const supabaseFiles = await SupabaseMediaLibraryManager.getMediaFiles();
      const supabaseFolders = await SupabaseMediaLibraryManager.getFolders();

      // Check if localStorage has data
      const localData = await this.exportLocalStorageData();

      const hasSupabaseData = supabaseFiles.length > 0 || supabaseFolders.length > 0;
      const hasLocalData = localData.files.length > 0 || localData.folders.length > 0;

      if (hasSupabaseData && !hasLocalData) {
        console.log('Migration appears successful - Supabase has data, localStorage is empty');
        return true;
      }

      if (!hasSupabaseData && hasLocalData) {
        console.log('Migration needed - localStorage has data, Supabase is empty');
        return false;
      }

      if (hasSupabaseData && hasLocalData) {
        console.log('Both storage systems have data - manual review needed');
        return false;
      }

      console.log('No data found in either storage system');
      return true;
    } catch (error) {
      console.error('Failed to validate migration:', error);
      return false;
    }
  }

  // Utility to switch between storage systems
  static async switchToSupabase(): Promise<void> {
    console.log('Switching to Supabase storage...');
    
    // Migrate data
    const progress = await this.migrateToSupabase();
    
    if (progress.isComplete && progress.errors.length === 0) {
      // Clear localStorage after successful migration
      await this.clearLocalStorageData();
      console.log('Successfully switched to Supabase storage');
    } else {
      console.error('Migration had errors:', progress.errors);
      throw new Error('Migration failed - see console for details');
    }
  }

  static async switchToLocalStorage(): Promise<void> {
    console.log('Switching to localStorage storage...');
    
    try {
      // Export from Supabase
      const supabaseFiles = await SupabaseMediaLibraryManager.getMediaFiles();
      const supabaseFolders = await SupabaseMediaLibraryManager.getFolders();

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(supabaseFiles));
        localStorage.setItem(this.FOLDERS_KEY, JSON.stringify(supabaseFolders));
      }

      console.log('Successfully switched to localStorage storage');
    } catch (error) {
      console.error('Failed to switch to localStorage:', error);
      throw error;
    }
  }
}
