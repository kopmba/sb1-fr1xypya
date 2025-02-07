import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart, Plus } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  score: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('score', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Nos Produits</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">{product.price}€</span>
                    <button
                      onClick={() => addItem({ id: product.id, name: product.name, price: product.price })}
                      className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      <Plus size={20} />
                      <span>Ajouter</span>
                    </button>
                  </div>
                  <div className="mt-2 flex items-center">
                    <span className="text-sm text-gray-500">Score: {product.score}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === i + 1
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}