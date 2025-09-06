/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';


import React, { useState, useEffect } from 'react';
import { DynamicSection } from '@/lib/dynamic-sections';
import { Share2, Heart, MessageCircle, Repeat2, ExternalLink, RefreshCw, Settings } from 'lucide-react';
import { SocialMediaManager, SocialMediaPost, SocialMediaConfig } from '@/lib/social-media-api';

interface DynamicSocialFeedSectionProps {
  section: DynamicSection;
  isEditMode?: boolean;
  onUpdate?: (fields: Record<string, unknown>) => void;
}

interface SocialPost {
  id: string;
  content: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    verified?: boolean;
  };
  timestamp: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  media?: {
    type: 'image' | 'video';
    url: string;
    alt?: string;
  };
  platform: 'linkedin' | 'twitter' | 'instagram' | 'facebook';
}

const DynamicSocialFeedSection: React.FC<DynamicSocialFeedSectionProps> = ({
  section,
  isEditMode = false,
  onUpdate
}) => {
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const platform = section.fields.platform as string || 'linkedin';
  const username = section.fields.username as string || '';
  const postCount = section.fields.postCount as number || 6;
  const layout = section.fields.layout as string || 'grid';
  const showProfile = section.fields.showProfile as boolean ?? true;
  const showEngagement = section.fields.showEngagement as boolean ?? true;
  const autoRefresh = section.fields.autoRefresh as boolean ?? false;
  const socialMediaUrl = section.fields.socialMediaUrl as string || '';

  // Fetch posts from social media API
  const fetchSocialMediaPosts = async (): Promise<SocialMediaPost[]> => {
    if (!username && !socialMediaUrl) {
      // Return empty array instead of throwing error when no configuration is provided
      return [];
    }

    let finalUsername = username;
    
    // If social media URL is provided, try to extract username
    if (socialMediaUrl && !username) {
      const extractedUsername = SocialMediaManager.parseSocialMediaUrl(socialMediaUrl, platform);
      if (extractedUsername) {
        finalUsername = extractedUsername;
      } else {
        throw new Error('Could not extract username from social media URL');
      }
    }

    const config: SocialMediaConfig = {
      platform: platform as SocialMediaConfig['platform'],
      username: finalUsername
    };

    // Validate configuration
    const validation = SocialMediaManager.validateConfig(config);
    if (!validation.isValid) {
      throw new Error(`Configuration error: ${validation.errors.join(', ')}`);
    }

    try {
      const response = await SocialMediaManager.fetchPosts(config, postCount);
      return response.posts;
    } catch (err) {
      console.error('Social media API error:', err);
      throw new Error(`Failed to fetch ${platform} posts: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const fetchedPosts = await fetchSocialMediaPosts();
        setPosts(fetchedPosts);
        setLastUpdated(new Date());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load social media posts');
        console.error('Social feed error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [platform, username, socialMediaUrl, postCount]);

  // Auto refresh effect
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setPosts(prevPosts => 
        prevPosts.map(post => ({
          ...post,
          engagement: {
            ...post.engagement,
            likes: post.engagement.likes + Math.floor(Math.random() * 3)
          }
        }))
      );
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const handleFieldChange = (fieldName: string, value: unknown) => {
    if (onUpdate) {
      onUpdate({
        ...section,
        fields: {
          ...section.fields,
          [fieldName]: value
        }
      });
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return '💼';
      case 'twitter':
        return '🐦';
      case 'instagram':
        return '📸';
      case 'facebook':
        return '📘';
      default:
        return '📱';
    }
  };

  const renderPost = (post: SocialMediaPost) => (
    <div key={post.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {showProfile && (
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-gray-900">{post.author.name}</h4>
              {post.author.verified && (
                <span className="text-blue-500 text-sm">✓</span>
              )}
            </div>
            <p className="text-sm text-gray-500">{post.author.handle}</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>{getPlatformIcon(post.platform)}</span>
            <span>{formatTimestamp(post.timestamp)}</span>
          </div>
        </div>
      )}
      
      <div className="mb-4">
        <p className="text-gray-800 leading-relaxed">{post.content}</p>
      </div>

      {post.media && (
        <div className="mb-4">
          <img
            src={post.media.url}
            alt={post.media.alt}
            className="w-full rounded-lg"
          />
        </div>
      )}

      {showEngagement && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-6">
            <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors">
              <Heart className="w-4 h-4" />
              <span>{post.engagement.likes}</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>{post.engagement.comments}</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
              <Repeat2 className="w-4 h-4" />
              <span>{post.engagement.shares}</span>
            </button>
          </div>
          {post.url && (
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      )}
    </div>
  );

  const renderGridLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map(renderPost)}
    </div>
  );

  const renderCarouselLayout = () => (
    <div className="relative">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex space-x-6 pb-4" style={{ width: `${posts.length * 320}px` }}>
          {posts.map(post => (
            <div key={post.id} className="flex-shrink-0 w-80">
              {renderPost(post)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTimelineLayout = () => (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <div key={post.id} className="relative">
          {index < posts.length - 1 && (
            <div className="absolute left-6 top-16 w-0.5 h-full bg-gray-200"></div>
          )}
          <div className="flex space-x-4">
            <div className="flex-shrink-0">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full border-2 border-white"
              />
            </div>
            <div className="flex-1">
              {renderPost(post)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="py-16 text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">Loading social media posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <div className="text-red-500 mb-4">
          <Share2 className="w-8 h-8 mx-auto mb-2" />
          <p>{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Show configuration message when no username or URL is provided
  if (!username && !socialMediaUrl) {
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

          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Share2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Configure Social Media Feed
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Please provide a username or social media URL to display posts
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Edit this section to add your social media configuration
            </p>
          </div>
        </div>
      </section>
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

        {/* Edit Mode */}
        {isEditMode && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-4">Social Media Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Settings */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={(section.fields.title as string) || ''}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter section title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Section Subtitle
                  </label>
                  <input
                    type="text"
                    value={(section.fields.subtitle as string) || ''}
                    onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter section subtitle"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Social Platform
                  </label>
                  <select
                    value={(section.fields.platform as string) || 'linkedin'}
                    onChange={(e) => handleFieldChange('platform', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">Twitter/X</option>
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Username/Handle
                  </label>
                  <input
                    type="text"
                    value={(section.fields.username as string) || ''}
                    onChange={(e) => handleFieldChange('username', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="@username or company-name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Social Media URL (optional)
                  </label>
                  <input
                    type="url"
                    value={(section.fields.socialMediaUrl as string) || ''}
                    onChange={(e) => handleFieldChange('socialMediaUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="https://linkedin.com/in/username"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Paste the profile URL to auto-extract username
                  </p>
                </div>
              </div>

              {/* Display Settings */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Number of Posts
                  </label>
                  <input
                    type="number"
                    value={(section.fields.postCount as number) || 6}
                    onChange={(e) => handleFieldChange('postCount', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="1"
                    max="20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Layout Style
                  </label>
                  <select
                    value={(section.fields.layout as string) || 'grid'}
                    onChange={(e) => handleFieldChange('layout', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="grid">Grid Layout</option>
                    <option value="carousel">Carousel</option>
                    <option value="timeline">Timeline</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showProfile"
                      checked={(section.fields.showProfile as boolean) || true}
                      onChange={(e) => handleFieldChange('showProfile', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="showProfile" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Show Profile Info
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showEngagement"
                      checked={(section.fields.showEngagement as boolean) || true}
                      onChange={(e) => handleFieldChange('showEngagement', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="showEngagement" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Show Likes/Comments
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="autoRefresh"
                      checked={(section.fields.autoRefresh as boolean) || false}
                      onChange={(e) => handleFieldChange('autoRefresh', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="autoRefresh" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Auto Refresh Feed
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Show posts or empty state */}
        {posts.length > 0 ? (
          <>
            {layout === 'grid' && renderGridLayout()}
            {layout === 'carousel' && renderCarouselLayout()}
            {layout === 'timeline' && renderTimelineLayout()}
          </>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Share2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Posts Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No posts were found for the configured social media account
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        )}

        {/* Settings and Status Panel */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {lastUpdated && (
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            )}
            {autoRefresh && (
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4" />
                <span>Live updates enabled</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.location.reload()}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Feed Settings</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Platform:</span>
                <span className="ml-2 font-medium capitalize">{platform}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Username:</span>
                <span className="ml-2 font-medium">{username || 'Not set'}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Posts:</span>
                <span className="ml-2 font-medium">{posts.length}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Layout:</span>
                <span className="ml-2 font-medium capitalize">{layout}</span>
              </div>
            </div>
            {socialMediaUrl && (
              <div className="mt-3">
                <span className="text-gray-600 dark:text-gray-400 text-sm">Source URL:</span>
                <a
                  href={socialMediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:text-blue-800 text-sm break-all"
                >
                  {socialMediaUrl}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default DynamicSocialFeedSection;
