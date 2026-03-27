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
            films: {
                Row: {
                    id: string
                    title: string
                    year: number | null
                    director: string | null
                    synopsis: string | null
                    poster_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    year?: number | null
                    director?: string | null
                    synopsis?: string | null
                    poster_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    year?: number | null
                    director?: string | null
                    synopsis?: string | null
                    poster_url?: string | null
                    created_at?: string
                }
            }
            editorial_edges: {
                Row: {
                    id: string
                    from_film_id: string
                    to_film_id: string
                    type: 'thematic' | 'stylistic' | 'contrast'
                    label: string | null
                    weight: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    from_film_id: string
                    to_film_id: string
                    type: 'thematic' | 'stylistic' | 'contrast'
                    label?: string | null
                    weight?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    from_film_id?: string
                    to_film_id?: string
                    type?: 'thematic' | 'stylistic' | 'contrast'
                    label?: string | null
                    weight?: number
                    created_at?: string
                }
            }
            articles: {
                Row: {
                    id: string
                    title: string
                    slug: string
                    content: string
                    excerpt: string | null
                    cover_image: string | null
                    author_id: string | null
                    status: 'draft' | 'published'
                    published_at: string | null
                    expires_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    slug: string
                    content: string
                    excerpt?: string | null
                    cover_image?: string | null
                    author_id?: string | null
                    status?: 'draft' | 'published'
                    published_at?: string | null
                    expires_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    slug?: string
                    content?: string
                    excerpt?: string | null
                    cover_image?: string | null
                    author_id?: string | null
                    status?: 'draft' | 'published'
                    published_at?: string | null
                    expires_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            users: {
                Row: {
                    id: string
                    display_name: string | null
                    onboarding_complete: boolean
                    is_admin: boolean
                    admin_verified_at: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    display_name?: string | null
                    onboarding_complete?: boolean
                    is_admin?: boolean
                    admin_verified_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    display_name?: string | null
                    onboarding_complete?: boolean
                    is_admin?: boolean
                    admin_verified_at?: string | null
                    created_at?: string
                }
            }
            security_logs: {
                Row: {
                    id: string
                    event_type: string
                    level: 'info' | 'warn' | 'error' | 'critical'
                    ip_address: string | null
                    user_id: string | null
                    path: string | null
                    user_agent: string | null
                    metadata: Json
                    created_at: string
                }
                Insert: {
                    id?: string
                    event_type: string
                    level?: 'info' | 'warn' | 'error' | 'critical'
                    ip_address?: string | null
                    user_id?: string | null
                    path?: string | null
                    user_agent?: string | null
                    metadata?: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    event_type?: string
                    level?: 'info' | 'warn' | 'error' | 'critical'
                    ip_address?: string | null
                    user_id?: string | null
                    path?: string | null
                    user_agent?: string | null
                    metadata?: Json
                    created_at?: string
                }
            }
            cinema_movies: {
                Row: {
                    id: string
                    title: string
                    director: string
                    year: number
                    poster_url: string | null
                    themes: string[]
                    expires_at: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    director: string
                    year: number
                    poster_url?: string | null
                    themes?: string[]
                    expires_at: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    director?: string
                    year?: number
                    poster_url?: string | null
                    themes?: string[]
                    expires_at?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            user_pillars: {
                Row: {
                    id: string
                    user_id: string
                    film_id: number
                    rank: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    film_id: number
                    rank: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    film_id?: number
                    rank?: number
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
