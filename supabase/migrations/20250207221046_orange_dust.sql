/*
  # Schéma initial de la base de données

  1. Tables
    - `users` - Informations utilisateur étendues
      - `id` (uuid, clé primaire)
      - `email` (text, unique)
      - `full_name` (text)
      - `created_at` (timestamp)
    
    - `products` - Catalogue des produits
      - `id` (uuid, clé primaire)
      - `name` (text)
      - `description` (text)
      - `price` (decimal)
      - `category` (text)
      - `score` (integer)
      - `created_at` (timestamp)
    
    - `stores` - Points de vente
      - `id` (uuid, clé primaire)
      - `name` (text)
      - `address` (text)
      - `latitude` (decimal)
      - `longitude` (decimal)
      - `created_at` (timestamp)
    
    - `orders` - Commandes
      - `id` (uuid, clé primaire)
      - `user_id` (uuid, référence users)
      - `store_id` (uuid, référence stores)
      - `status` (text)
      - `delivery_type` (text)
      - `created_at` (timestamp)
    
    - `order_items` - Détails des commandes
      - `id` (uuid, clé primaire)
      - `order_id` (uuid, référence orders)
      - `product_id` (uuid, référence products)
      - `quantity` (integer)
      - `price_at_time` (decimal)
      - `created_at` (timestamp)

  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques de sécurité pour l'accès aux données
*/

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- Products table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal NOT NULL,
  category text NOT NULL,
  score integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read products" ON products
  FOR SELECT TO authenticated
  USING (true);

-- Stores table
CREATE TABLE stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  latitude decimal NOT NULL,
  longitude decimal NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read stores" ON stores
  FOR SELECT TO authenticated
  USING (true);

-- Orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  store_id uuid REFERENCES stores(id) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  delivery_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own orders" ON orders
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Order items table
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) NOT NULL,
  product_id uuid REFERENCES products(id) NOT NULL,
  quantity integer NOT NULL,
  price_at_time decimal NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own order items" ON order_items
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own order items" ON order_items
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );