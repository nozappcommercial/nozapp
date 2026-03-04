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
            users: {
                Row: {
                    id: string
                    display_name: string | null
                    onboarding_complete: boolean
                    created_at: string
                }
                Insert: {
                    id: string
                    display_name?: string | null
                    onboarding_complete?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    display_name?: string | null
                    onboarding_complete?: boolean
                    created_at?: string
                }
            }
            user_pillars: {
                Row: {
                    id: string
                    user_id: string
                    film_id: string
                    rank: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    film_id: string
                    rank: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    film_id?: string
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
