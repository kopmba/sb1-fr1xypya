import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart, User, Store, Package } from 'lucide-react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <Store className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold">E-Commerce</span>
            </Link>

            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/products"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
              >
                <Package className="h-5 w-5 mr-1" />
                Produits
              </Link>
              <Link
                to="/stores"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
              >
                <Store className="h-5 w-5 mr-1" />
                Magasins
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {user ? (
              <>
                <Link to="/cart" className="relative p-2">
                  <ShoppingCart className="h-6 w-6 text-gray-600" />
                  {itemCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-indigo-600 rounded-full">
                      {itemCount}
                    </span>
                  )}
                </Link>
                <Link to="/profile" className="p-2">
                  <User className="h-6 w-6 text-gray-600" />
                </Link>
                <button
                  onClick={() => signOut()}
                  className="ml-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}