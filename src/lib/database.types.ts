export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          category: string;
          score: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          category: string;
          score?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          category?: string;
          score?: number;
          created_at?: string;
        };
      };
      stores: {
        Row: {
          id: string;
          name: string;
          address: string;
          latitude: number;
          longitude: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address: string;
          latitude: number;
          longitude: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string;
          latitude?: number;
          longitude?: number;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          store_id: string;
          status: string;
          delivery_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          store_id: string;
          status?: string;
          delivery_type: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          store_id?: string;
          status?: string;
          delivery_type?: string;
          created_at?: string;
        };
      };
    };
  };
}