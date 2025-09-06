'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DynamicSection } from '@/lib/dynamic-sections';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, AlertCircle } from 'lucide-react';

interface DynamicVideoSectionProps {
  section: DynamicSection;
  isEditMode?: boolean;
  onUpdate?: (section: DynamicSection) => void;
}

const DynamicVideoSection: React.FC<DynamicVideoSectionProps> = ({
  section,
  isEditMode = false,
  onUpdate
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const videoType = section.fields.videoType as string || 'youtube';
  const videoUrl = section.fields.videoUrl as string || '';
  const videoFile = section.fields.videoFile as string || '';
  const aspectRatio = section.fields.aspectRatio as string || '16:9';
  const autoplay = section.fields.autoplay as boolean ?? false;
  const muted = section.fields.muted as boolean ?? true;
  const loop = section.fields.loop as boolean ?? false;
  const showControls = section.fields.showControls as boolean ?? true;
  const posterImage = section.fields.posterImage as string || '';
  const caption = section.fields.caption as string || '';

  // Extract video ID from YouTube/Vimeo URLs with enhanced validation
  const extractVideoId = (url: string, platform: string): string | null => {
    if (!url || typeof url !== 'string') return null;
    
    try {
      if (platform === 'youtube') {
        // Handle various YouTube URL formats
        const patterns = [
          /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
          /youtube\.com\/shorts\/([^&\n?#]+)/,
          /youtube\.com\/live\/([^&\n?#]+)/
        ];
        
        for (const pattern of patterns) {
          const match = url.match(pattern);
          if (match) return match[1];
        }
        return null;
      } else if (platform === 'vimeo') {
        // Handle various Vimeo URL formats
        const patterns = [
          /vimeo\.com\/(\d+)/,
          /player\.vimeo\.com\/video\/(\d+)/
        ];
        
        for (const pattern of patterns) {
          const match = url.match(pattern);
          if (match) return match[1];
        }
        return null;
      }
    } catch (err) {
      console.error('Error extracting video ID:', err);
    }
    
    return null;
  };

  // Generate embed URL with enhanced error handling
  const getEmbedUrl = (url: string, platform: string): string | null => {
    const videoId = extractVideoId(url, platform);
    if (!videoId) {
      setError(`Invalid ${platform} URL format`);
      return null;
    }

    try {
      if (platform === 'youtube') {
        const params = new URLSearchParams({
          autoplay: autoplay ? '1' : '0',
          mute: muted ? '1' : '0',
          loop: loop ? '1' : '0',
          controls: showControls ? '1' : '0',
          rel: '0',
          modestbranding: '1',
          playsinline: '1'
        });
        return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
      } else if (platform === 'vimeo') {
        const params = new URLSearchParams({
          autoplay: autoplay ? '1' : '0',
          muted: muted ? '1' : '0',
          loop: loop ? '1' : '0',
          controls: showControls ? '1' : '0',
          playsinline: '1'
        });
        return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
      }
    } catch (err) {
      console.error('Error generating embed URL:', err);
      setError('Failed to generate video embed URL');
    }
    
    return null;
  };

  // Get aspect ratio classes
  const getAspectRatioClass = (ratio: string): string => {
    switch (ratio) {
      case '16:9':
        return 'aspect-video';
      case '4:3':
        return 'aspect-[4/3]';
      case '1:1':
        return 'aspect-square';
      case '21:9':
        return 'aspect-[21/9]';
      default:
        return 'aspect-video';
    }
  };

  // Video event handlers
  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  // Format time in MM:SS
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handlePlayEvent = () => setIsPlaying(true);
    const handlePauseEvent = () => setIsPlaying(false);
    const handleError = () => setError('Failed to load video');

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlayEvent);
    video.addEventListener('pause', handlePauseEvent);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlayEvent);
      video.removeEventListener('pause', handlePauseEvent);
      video.removeEventListener('error', handleError);
    };
  }, []);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const renderEmbeddedVideo = () => {
    if (videoType === 'youtube' || videoType === 'vimeo') {
      const embedUrl = getEmbedUrl(videoUrl, videoType);
      if (!embedUrl) {
        setError('Invalid video URL');
        return null;
      }

      return (
        <iframe
          src={embedUrl}
          className="w-full h-full rounded-lg"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      );
    }

    return null;
  };

  const renderCustomVideo = () => {
    const videoSrc = videoType === 'upload' ? videoFile : videoUrl;
    
    if (!videoSrc) {
      setError('No video source provided');
      return null;
    }

    return (
      <video
        ref={videoRef}
        className="w-full h-full object-cover rounded-lg"
        poster={posterImage}
        muted={muted}
        loop={loop}
        controls={showControls}
        onError={() => setError('Failed to load video')}
      >
        <source src={videoSrc} type="video/mp4" />
        <source src={videoSrc} type="video/webm" />
        Your browser does not support the video tag.
      </video>
    );
  };

  if (error) {
    return (
      <div className="py-16 text-center">
        <div className="text-red-500 mb-4">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Edit Mode Interface
  if (isEditMode) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-4">Video Section Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Settings */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-blue-800 dark:text-blue-400">Basic Settings</h4>
            
            <div>
              <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                Section Title
              </label>
              <input
                type="text"
                value={section.fields.title as string || ''}
                onChange={(e) => onUpdate?.({ ...section, fields: { ...section.fields, title: e.target.value } })}
                className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Enter section title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                Section Subtitle
              </label>
              <input
                type="text"
                value={section.fields.subtitle as string || ''}
                onChange={(e) => onUpdate?.({ ...section, fields: { ...section.fields, subtitle: e.target.value } })}
                className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Enter section subtitle"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                Video Source
              </label>
              <select
                value={videoType}
                onChange={(e) => onUpdate?.({ ...section, fields: { ...section.fields, videoType: e.target.value } })}
                className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="youtube">YouTube</option>
                <option value="vimeo">Vimeo</option>
                <option value="upload">Upload File</option>
                <option value="url">Direct URL</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                Video URL
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => onUpdate?.({ ...section, fields: { ...section.fields, videoUrl: e.target.value } })}
                className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
              />
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Paste YouTube, Vimeo, or direct video URL
              </p>
            </div>
          </div>
          
          {/* Display Settings */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-blue-800 dark:text-blue-400">Display Settings</h4>
            
            <div>
              <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => onUpdate?.({ ...section, fields: { ...section.fields, aspectRatio: e.target.value } })}
                className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="16:9">16:9 (Widescreen)</option>
                <option value="4:3">4:3 (Standard)</option>
                <option value="1:1">1:1 (Square)</option>
                <option value="21:9">21:9 (Ultrawide)</option>
              </select>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoplay"
                  checked={autoplay}
                  onChange={(e) => onUpdate?.({ ...section, fields: { ...section.fields, autoplay: e.target.checked } })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                />
                <label htmlFor="autoplay" className="ml-2 block text-sm text-blue-700 dark:text-blue-300">
                  Autoplay video
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="muted"
                  checked={muted}
                  onChange={(e) => onUpdate?.({ ...section, fields: { ...section.fields, muted: e.target.checked } })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                />
                <label htmlFor="muted" className="ml-2 block text-sm text-blue-700 dark:text-blue-300">
                  Start muted
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="loop"
                  checked={loop}
                  onChange={(e) => onUpdate?.({ ...section, fields: { ...section.fields, loop: e.target.checked } })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                />
                <label htmlFor="loop" className="ml-2 block text-sm text-blue-700 dark:text-blue-300">
                  Loop video
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showControls"
                  checked={showControls}
                  onChange={(e) => onUpdate?.({ ...section, fields: { ...section.fields, showControls: e.target.checked } })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                />
                <label htmlFor="showControls" className="ml-2 block text-sm text-blue-700 dark:text-blue-300">
                  Show video controls
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Preview */}
        <div className="mt-6">
          <h4 className="text-md font-medium text-blue-800 dark:text-blue-400 mb-3">Preview</h4>
          <div className="border border-blue-300 dark:border-blue-600 rounded-lg p-4 bg-white dark:bg-gray-800">
            {videoUrl ? (
              <div className={`relative ${getAspectRatioClass(aspectRatio)} bg-gray-900 rounded-lg overflow-hidden`}>
                {(videoType === 'youtube' || videoType === 'vimeo') ? (
                  renderEmbeddedVideo()
                ) : (
                  renderCustomVideo()
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Play className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Enter a video URL to see preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {((section.fields.title as string) || (section.fields.subtitle as string)) && (
          <div className="text-center mb-12">
            {(section.fields.title as string) && (
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {section.fields.title as string}
              </h2>
            )}
            {(section.fields.subtitle as string) && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {section.fields.subtitle as string}
              </p>
            )}
          </div>
        )}

        <div ref={containerRef} className="relative">
          <div className={`relative ${getAspectRatioClass(aspectRatio)} bg-gray-900 rounded-xl overflow-hidden`}>
            {(videoType === 'youtube' || videoType === 'vimeo') ? (
              renderEmbeddedVideo()
            ) : (
              <>
                {renderCustomVideo()}
                
                {/* Custom controls overlay */}
                {!showControls && videoType !== 'youtube' && videoType !== 'vimeo' && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <button
                      onClick={isPlaying ? handlePause : handlePlay}
                      className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 text-gray-900" />
                      ) : (
                        <Play className="w-6 h-6 text-gray-900 ml-1" />
                      )}
                    </button>
                  </div>
                )}

                {/* Custom control bar */}
                {!showControls && videoType !== 'youtube' && videoType !== 'vimeo' && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={isPlaying ? handlePause : handlePlay}
                        className="text-white hover:text-gray-300 transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </button>

                      <div className="flex-1 flex items-center space-x-2">
                        <span className="text-white text-sm">{formatTime(currentTime)}</span>
                        <div className="flex-1 bg-white/30 rounded-full h-1">
                          <div
                            className="bg-white rounded-full h-1 transition-all"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                          />
                        </div>
                        <span className="text-white text-sm">{formatTime(duration)}</span>
                      </div>

                      <button
                        onClick={handleMute}
                        className="text-white hover:text-gray-300 transition-colors"
                      >
                        {isMuted ? (
                          <VolumeX className="w-5 h-5" />
                        ) : (
                          <Volume2 className="w-5 h-5" />
                        )}
                      </button>

                      <button
                        onClick={handleRestart}
                        className="text-white hover:text-gray-300 transition-colors"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </button>

                      <button
                        onClick={handleFullscreen}
                        className="text-white hover:text-gray-300 transition-colors"
                      >
                        <Maximize className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {caption && (
            <div className="mt-4 text-center">
              <p className="text-gray-600 italic">{caption}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DynamicVideoSection;
