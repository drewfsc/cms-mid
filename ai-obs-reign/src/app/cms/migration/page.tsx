/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import React, { useState } from 'react';
import { Database, Upload, Download, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import CMSHeader from '@/components/cms/CMSHeader';
import { MediaLibraryMigration, MigrationProgress } from '@/lib/media-library-migration';

export default function MigrationPage() {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState<MigrationProgress | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<boolean | null>(null);

  const handleMigration = async () => {
    setIsMigrating(true);
    setMigrationProgress(null);

    try {
      const progress = await MediaLibraryMigration.migrateToSupabase();
      setMigrationProgress(progress);
    } catch (error) {
      console.error('Migration failed:', error);
    } finally {
      setIsMigrating(false);
    }
  };

  const handleValidation = async () => {
    setIsValidating(true);
    try {
      const isValid = await MediaLibraryMigration.validateMigration();
      setValidationResult(isValid);
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSwitchToSupabase = async () => {
    setIsMigrating(true);
    try {
      await MediaLibraryMigration.switchToSupabase();
      alert('Successfully switched to Supabase storage!');
    } catch (error) {
      alert(`Failed to switch: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsMigrating(false);
    }
  };

  const handleSwitchToLocalStorage = async () => {
    setIsMigrating(true);
    try {
      await MediaLibraryMigration.switchToLocalStorage();
      alert('Successfully switched to localStorage storage!');
    } catch (error) {
      alert(`Failed to switch: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CMSHeader title="Media Migration" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Media Library Migration
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Migrate your media library from localStorage to Supabase
                </p>
              </div>
            </div>

            {/* Validation Section */}
            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Storage Status
              </h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleValidation}
                  disabled={isValidating}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {isValidating ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  <span>Check Status</span>
                </button>
                
                {validationResult !== null && (
                  <div className="flex items-center space-x-2">
                    {validationResult ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-green-600 dark:text-green-400">
                          Migration complete or no data to migrate
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                        <span className="text-yellow-600 dark:text-yellow-400">
                          Migration needed or data conflict detected
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Migration Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Migration Options
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleMigration}
                  disabled={isMigrating}
                  className="flex items-center justify-center space-x-2 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isMigrating ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                  <span>Migrate to Supabase</span>
                </button>

                <button
                  onClick={handleSwitchToSupabase}
                  disabled={isMigrating}
                  className="flex items-center justify-center space-x-2 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isMigrating ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <Database className="w-5 h-5" />
                  )}
                  <span>Switch to Supabase</span>
                </button>
              </div>
            </div>

            {/* Progress Display */}
            {migrationProgress && (
              <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Migration Progress
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>Files</span>
                      <span>{migrationProgress.migratedFiles} / {migrationProgress.totalFiles}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: migrationProgress.totalFiles > 0 
                            ? `${(migrationProgress.migratedFiles / migrationProgress.totalFiles) * 100}%` 
                            : '0%' 
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>Folders</span>
                      <span>{migrationProgress.migratedFolders} / {migrationProgress.totalFolders}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: migrationProgress.totalFolders > 0 
                            ? `${(migrationProgress.migratedFolders / migrationProgress.totalFolders) * 100}%` 
                            : '0%' 
                        }}
                      />
                    </div>
                  </div>

                  {migrationProgress.errors.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                        Errors ({migrationProgress.errors.length})
                      </h4>
                      <div className="max-h-32 overflow-y-auto">
                        {migrationProgress.errors.map((error, index) => (
                          <p key={index} className="text-xs text-red-600 dark:text-red-400 mb-1">
                            {error}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {migrationProgress.isComplete && (
                    <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Migration completed!</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Instructions
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <p>1. <strong>Check Status</strong> - Verify current storage state</p>
                <p>2. <strong>Migrate to Supabase</strong> - Copy data from localStorage to Supabase</p>
                <p>3. <strong>Switch to Supabase</strong> - Migrate and clear localStorage</p>
                <p>4. Update your components to use <code>SupabaseMediaLibraryManager</code></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
