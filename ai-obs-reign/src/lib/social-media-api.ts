// Social Media API integration for fetching public posts

export interface SocialMediaConfig {
  platform: 'linkedin' | 'twitter' | 'instagram' | 'facebook';
  username: string;
  apiKey?: string;
  accessToken?: string;
}

export interface SocialMediaPost {
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
  url?: string;
}

export interface SocialMediaResponse {
  posts: SocialMediaPost[];
  totalCount: number;
  hasMore: boolean;
  nextCursor?: string;
}

export class SocialMediaManager {
  /**
   * Fetch posts from LinkedIn public profile
   */
  static async fetchLinkedInPosts(config: SocialMediaConfig, count: number = 10): Promise<SocialMediaResponse> {
    try {
      // LinkedIn API requires authentication and has strict rate limits
      // For demo purposes, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const posts = this.generateMockLinkedInPosts(config.username, count);
      
      return {
        posts,
        totalCount: posts.length,
        hasMore: false
      };
    } catch (err) {
      console.error('LinkedIn API error:', err);
      throw new Error('Failed to fetch LinkedIn posts');
    }
  }

  /**
   * Fetch posts from Twitter/X public profile
   */
  static async fetchTwitterPosts(config: SocialMediaConfig, count: number = 10): Promise<SocialMediaResponse> {
    try {
      // Twitter API v2 requires authentication
      // For demo purposes, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const posts = this.generateMockTwitterPosts(config.username, count);
      
      return {
        posts,
        totalCount: posts.length,
        hasMore: false
      };
    } catch (err) {
      console.error('Twitter API error:', err);
      throw new Error('Failed to fetch Twitter posts');
    }
  }

  /**
   * Fetch posts from Instagram public profile
   */
  static async fetchInstagramPosts(config: SocialMediaConfig, count: number = 10): Promise<SocialMediaResponse> {
    try {
      // Instagram Basic Display API requires authentication
      // For demo purposes, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const posts = this.generateMockInstagramPosts(config.username, count);
      
      return {
        posts,
        totalCount: posts.length,
        hasMore: false
      };
    } catch (err) {
      console.error('Instagram API error:', err);
      throw new Error('Failed to fetch Instagram posts');
    }
  }

  /**
   * Fetch posts from Facebook public page
   */
  static async fetchFacebookPosts(config: SocialMediaConfig, count: number = 10): Promise<SocialMediaResponse> {
    try {
      // Facebook Graph API requires authentication
      // For demo purposes, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const posts = this.generateMockFacebookPosts(config.username, count);
      
      return {
        posts,
        totalCount: posts.length,
        hasMore: false
      };
    } catch (err) {
      console.error('Facebook API error:', err);
      throw new Error('Failed to fetch Facebook posts');
    }
  }

  /**
   * Generic method to fetch posts from any platform
   */
  static async fetchPosts(config: SocialMediaConfig, count: number = 10): Promise<SocialMediaResponse> {
    switch (config.platform) {
      case 'linkedin':
        return this.fetchLinkedInPosts(config, count);
      case 'twitter':
        return this.fetchTwitterPosts(config, count);
      case 'instagram':
        return this.fetchInstagramPosts(config, count);
      case 'facebook':
        return this.fetchFacebookPosts(config, count);
      default:
        throw new Error(`Unsupported platform: ${config.platform}`);
    }
  }

  /**
   * Parse social media URL to extract username
   */
  static parseSocialMediaUrl(url: string, platform: string): string | null {
    try {
      const patterns = {
        linkedin: [
          /linkedin\.com\/in\/([^\/\?]+)/,
          /linkedin\.com\/company\/([^\/\?]+)/
        ],
        twitter: [
          /twitter\.com\/([^\/\?]+)/,
          /x\.com\/([^\/\?]+)/
        ],
        instagram: [
          /instagram\.com\/([^\/\?]+)/
        ],
        facebook: [
          /facebook\.com\/([^\/\?]+)/
        ]
      };

      const platformPatterns = patterns[platform as keyof typeof patterns];
      if (!platformPatterns) return null;

      for (const pattern of platformPatterns) {
        const match = url.match(pattern);
        if (match) return match[1];
      }

      return null;
    } catch (err) {
      console.error('Error parsing social media URL:', err);
      return null;
    }
  }

  /**
   * Validate social media configuration
   */
  static validateConfig(config: SocialMediaConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.platform) {
      errors.push('Platform is required');
    }

    if (!config.username) {
      errors.push('Username is required');
    }

    if (!['linkedin', 'twitter', 'instagram', 'facebook'].includes(config.platform)) {
      errors.push('Invalid platform');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Mock data generators for demonstration
  private static generateMockLinkedInPosts(username: string, count: number): SocialMediaPost[] {
    const companyNames = ['TechCorp', 'InnovateLab', 'DataDriven Inc', 'CloudFirst', 'AI Solutions'];
    const companyName = companyNames[Math.floor(Math.random() * companyNames.length)];
    
    return Array.from({ length: count }, (_, i) => ({
      id: `linkedin-${i + 1}`,
      content: `Excited to share our latest insights on ${['AI', 'Data Science', 'Cloud Computing', 'Digital Transformation'][i % 4]}! Our team has been working hard to deliver innovative solutions that drive real business value. #Innovation #Technology #Business`,
      author: {
        name: companyName,
        handle: username,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=0077b5&color=fff`,
        verified: true
      },
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      engagement: {
        likes: Math.floor(Math.random() * 200) + 50,
        comments: Math.floor(Math.random() * 30) + 5,
        shares: Math.floor(Math.random() * 20) + 2
      },
      media: i % 3 === 0 ? {
        type: 'image' as const,
        url: `https://picsum.photos/600/400?random=${i + 100}`,
        alt: `LinkedIn post image ${i + 1}`
      } : undefined,
      platform: 'linkedin' as const,
      url: `https://linkedin.com/posts/${username}-${i + 1}`
    }));
  }

  private static generateMockTwitterPosts(username: string, count: number): SocialMediaPost[] {
    const topics = ['AI', 'Web3', 'Sustainability', 'Innovation', 'Tech'];
    
    return Array.from({ length: count }, (_, i) => ({
      id: `twitter-${i + 1}`,
      content: `Just published our latest research on ${topics[i % topics.length]}! The findings are groundbreaking and will shape the future of technology. What are your thoughts? 🚀 #Tech #Innovation #Future`,
      author: {
        name: username.charAt(0).toUpperCase() + username.slice(1),
        handle: `@${username}`,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=1da1f2&color=fff`,
        verified: true
      },
      timestamp: new Date(Date.now() - i * 1800000).toISOString(), // 30 min intervals
      engagement: {
        likes: Math.floor(Math.random() * 1000) + 100,
        comments: Math.floor(Math.random() * 100) + 10,
        shares: Math.floor(Math.random() * 200) + 20
      },
      media: i % 4 === 0 ? {
        type: 'image' as const,
        url: `https://picsum.photos/600/400?random=${i + 200}`,
        alt: `Twitter post image ${i + 1}`
      } : undefined,
      platform: 'twitter' as const,
      url: `https://twitter.com/${username}/status/${Date.now() + i}`
    }));
  }

  private static generateMockInstagramPosts(username: string, count: number): SocialMediaPost[] {
    const hashtags = ['#Innovation', '#Tech', '#Design', '#Creative', '#Inspiration'];
    
    return Array.from({ length: count }, (_, i) => ({
      id: `instagram-${i + 1}`,
      content: `Behind the scenes of our latest project! ✨ The creative process is always fascinating. ${hashtags[i % hashtags.length]} ${hashtags[(i + 1) % hashtags.length]}`,
      author: {
        name: username.charAt(0).toUpperCase() + username.slice(1),
        handle: `@${username}`,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=e4405f&color=fff`,
        verified: false
      },
      timestamp: new Date(Date.now() - i * 7200000).toISOString(), // 2 hour intervals
      engagement: {
        likes: Math.floor(Math.random() * 5000) + 500,
        comments: Math.floor(Math.random() * 200) + 20,
        shares: Math.floor(Math.random() * 100) + 10
      },
      media: {
        type: 'image' as const,
        url: `https://picsum.photos/600/600?random=${i + 300}`,
        alt: `Instagram post ${i + 1}`
      },
      platform: 'instagram' as const,
      url: `https://instagram.com/p/${Math.random().toString(36).substr(2, 9)}`
    }));
  }

  private static generateMockFacebookPosts(username: string, count: number): SocialMediaPost[] {
    const topics = ['Community', 'Events', 'Updates', 'News', 'Announcements'];
    
    return Array.from({ length: count }, (_, i) => ({
      id: `facebook-${i + 1}`,
      content: `We're thrilled to announce our latest ${topics[i % topics.length].toLowerCase()}! This is a significant milestone for our community. Thank you for your continued support and engagement. 🙏`,
      author: {
        name: username.charAt(0).toUpperCase() + username.slice(1),
        handle: username,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=1877f2&color=fff`,
        verified: false
      },
      timestamp: new Date(Date.now() - i * 14400000).toISOString(), // 4 hour intervals
      engagement: {
        likes: Math.floor(Math.random() * 300) + 50,
        comments: Math.floor(Math.random() * 50) + 5,
        shares: Math.floor(Math.random() * 30) + 3
      },
      media: i % 2 === 0 ? {
        type: 'image' as const,
        url: `https://picsum.photos/600/400?random=${i + 400}`,
        alt: `Facebook post image ${i + 1}`
      } : undefined,
      platform: 'facebook' as const,
      url: `https://facebook.com/${username}/posts/${Date.now() + i}`
    }));
  }
}
