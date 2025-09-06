import { createClient } from '@supabase/supabase-js'

// Client-side Supabase client
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Server-side Supabase client (for API routes)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Database types
export interface Database {
  public: {
    Tables: {
      media_files: {
        Row: {
          id: string
          name: string
          original_name: string
          url: string // base64 data URL
          thumbnail_url?: string
          type: 'image' | 'video' | 'document' | 'audio'
          mime_type: string
          size: number
          width?: number
          height?: number
          duration?: number
          alt?: string
          caption?: string
          tags: string[]
          folder: string
          uploaded_at: string
          uploaded_by: string
          is_public: boolean
          metadata?: Record<string, unknown>
        }
        Insert: {
          id?: string
          name: string
          original_name: string
          url: string
          thumbnail_url?: string
          type: 'image' | 'video' | 'document' | 'audio'
          mime_type: string
          size: number
          width?: number
          height?: number
          duration?: number
          alt?: string
          caption?: string
          tags?: string[]
          folder?: string
          uploaded_at?: string
          uploaded_by?: string
          is_public?: boolean
          metadata?: Record<string, unknown>
        }
        Update: {
          id?: string
          name?: string
          original_name?: string
          url?: string
          thumbnail_url?: string
          type?: 'image' | 'video' | 'document' | 'audio'
          mime_type?: string
          size?: number
          width?: number
          height?: number
          duration?: number
          alt?: string
          caption?: string
          tags?: string[]
          folder?: string
          uploaded_at?: string
          uploaded_by?: string
          is_public?: boolean
          metadata?: Record<string, unknown>
        }
      }
      media_folders: {
        Row: {
          id: string
          name: string
          parent_id?: string
          created_at: string
          created_by: string
          description?: string
        }
        Insert: {
          id?: string
          name: string
          parent_id?: string
          created_at?: string
          created_by?: string
          description?: string
        }
        Update: {
          id?: string
          name?: string
          parent_id?: string
          created_at?: string
          created_by?: string
          description?: string
        }
      }
    }
  }
}
