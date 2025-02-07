import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { supabase } from '../lib/supabase';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Store {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface DeliveryFormData {
  storeId: string;
  productType: string;
  deliveryType: string;
  latitude: number;
  longitude: number;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center);
  return null;
}

export default function StoreLocator() {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [formData, setFormData] = useState<DeliveryFormData>({
    storeId: '',
    productType: '',
    deliveryType: '',
    latitude: 48.8566,
    longitude: 2.3522,
  });
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchStores();
  }, []);

  async function fetchStores() {
    try {
      const { data, error } = await supabase.from('stores').select('*');
      if (error) throw error;
      setStores(data || []);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  }

  function handleStoreSelect(store: Store) {
    setSelectedStore(store);
    setFormData(prev => ({ ...prev, storeId: store.id }));
  }

  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedStore) {
      setError('Veuillez sélectionner une boutique');
      return;
    }

    const distance = calculateDistance(
      selectedStore.latitude,
      selectedStore.longitude,
      formData.latitude,
      formData.longitude
    );

    if (distance > 1) {
      setError('La distance doit être inférieure à 1 km');
      return;
    }

    // Here you would typically submit the order to your backend
    setError('');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Localisateur de Boutiques</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-[500px] rounded-lg overflow-hidden shadow-lg">
          <MapContainer
            center={[48.8566, 2.3522]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <ChangeView center={[48.8566, 2.3522]} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {stores.map((store) => (
              <Marker
                key={store.id}
                position={[store.latitude, store.longitude]}
                eventHandlers={{
                  click: () => handleStoreSelect(store),
                }}
              >
                <Popup>
                  <div>
                    <h3 className="font-bold">{store.name}</h3>
                    <p>{store.address}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">Commander</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Boutique sélectionnée
              </label>
              <input
                type="text"
                value={selectedStore?.name || ''}
                readOnly
                className="w-full px-3 py-2 border rounded-md bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de produit
              </label>
              <select
                value={formData.productType}
                onChange={(e) => setFormData(prev => ({ ...prev, productType: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Sélectionnez un produit</option>
                <option value="gateau">Gâteau</option>
                <option value="pain">Pain</option>
                <option value="pizza">Pizza</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de livraison
              </label>
              <select
                value={formData.deliveryType}
                onChange={(e) => setFormData(prev => ({ ...prev, deliveryType: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Sélectionnez un type</option>
                <option value="direct">Direct</option>
                <option value="indirect">Indirect</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Valider la commande
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}