export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          takhallus: string | null
          bio: string | null
          avatar_url: string | null
          cover_url: string | null
          languages: string[]
          role: 'user' | 'moderator' | 'admin'
          badges: string[]
          counters: {
            posts: number
            followers: number
            following: number
          }
          created_at: string
        }
        Insert: {
          id: string
          username: string
          takhallus?: string | null
          bio?: string | null
          avatar_url?: string | null
          cover_url?: string | null
          languages?: string[]
          role?: 'user' | 'moderator' | 'admin'
          badges?: string[]
          counters?: any
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      posts: {
        Row: {
          id: string
          author_id: string
          type: 'sher' | 'ghazal' | 'nazm' | 'rubai' | 'quote'
          language: string
          script: 'devanagari' | 'nastaliq' | 'roman' | 'english'
          title: string | null
          lines: { text: string; number: number }[]
          tags: string[]
          mood: string | null
          image_id: string | null
          audio_id: string | null
          visibility: 'public' | 'followers' | 'private'
          counters: {
            wah_wah: number
            irshad: number
            mukarrar: number
            dil_se: number
            comments: number
            shares: number
            saves: number
          }
          created_at: string
        }
        Insert: {
          id?: string
          author_id: string
          type: 'sher' | 'ghazal' | 'nazm' | 'rubai' | 'quote'
          language: string
          script: 'devanagari' | 'nastaliq' | 'roman' | 'english'
          title?: string | null
          lines: { text: string; number: number }[] | any
          tags?: string[]
          mood?: string | null
          image_id?: string | null
          audio_id?: string | null
          visibility?: 'public' | 'followers' | 'private'
          counters?: any
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['posts']['Insert']>
      }
      reactions: {
        Row: {
          id: string
          post_id: string
          user_id: string
          type: 'wah_wah' | 'irshad' | 'mukarrar' | 'dil_se'
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          type: 'wah_wah' | 'irshad' | 'mukarrar' | 'dil_se'
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['reactions']['Insert']>
      }
      comments: {
        Row: {
          id: string
          post_id: string
          author_id: string
          body: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          author_id: string
          body: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['comments']['Insert']>
      }
      follows: {
        Row: {
          follower_id: string
          followee_id: string
          created_at: string
        }
        Insert: {
          follower_id: string
          followee_id: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['follows']['Insert']>
      }
      saved_posts: {
        Row: {
          id: string
          user_id: string
          post_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['saved_posts']['Insert']>
      }
      feed_items: {
        Row: {
          id: string
          user_id: string
          post_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['feed_items']['Insert']>
      }
      chats: {
        Row: {
          id: string
          type: 'dm' | 'mehfil'
          members: string[]
          last_message: string | null
          unread: Record<string, number>
          created_at: string
        }
        Insert: {
          id?: string
          type: 'dm' | 'mehfil'
          members: string[]
          last_message?: string | null
          unread?: any
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['chats']['Insert']>
      }
      messages: {
        Row: {
          id: string
          chat_id: string
          sender_id: string
          body: string
          created_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          sender_id: string
          body: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['messages']['Insert']>
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          payload: Json
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          payload: Json
          read?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }
      diwans: {
        Row: {
          id: string
          owner_id: string
          title: string
          cover_url: string | null
          post_ids: string[]
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          title: string
          cover_url?: string | null
          post_ids?: string[]
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['diwans']['Insert']>
      }
      challenges: {
        Row: {
          id: string
          title: string
          prompt: string
          starts_at: string
          ends_at: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          prompt: string
          starts_at: string
          ends_at: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['challenges']['Insert']>
      }
      challenge_entries: {
        Row: {
          id: string
          challenge_id: string
          user_id: string
          post_id: string
          created_at: string
        }
        Insert: {
          id?: string
          challenge_id: string
          user_id: string
          post_id: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['challenge_entries']['Insert']>
      }
      reports: {
        Row: {
          id: string
          target_type: 'post' | 'comment' | 'user' | 'message'
          target_id: string
          reporter_id: string
          reason: string
          status: 'pending' | 'resolved' | 'dismissed'
          created_at: string
        }
        Insert: {
          id?: string
          target_type: 'post' | 'comment' | 'user' | 'message'
          target_id: string
          reporter_id: string
          reason: string
          status?: 'pending' | 'resolved' | 'dismissed'
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['reports']['Insert']>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'user' | 'moderator' | 'admin'
      post_type: 'sher' | 'ghazal' | 'nazm' | 'rubai' | 'quote'
      post_script: 'devanagari' | 'nastaliq' | 'roman' | 'english'
      post_visibility: 'public' | 'followers' | 'private'
      reaction_type: 'wah_wah' | 'irshad' | 'mukarrar' | 'dil_se'
      chat_type: 'dm' | 'mehfil'
      report_target_type: 'post' | 'comment' | 'user' | 'message'
      report_status: 'pending' | 'resolved' | 'dismissed'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
