import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { User, Settings } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  async function fetchProfile() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
      setFormData({ full_name: data.full_name });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ full_name: formData.full_name })
        .eq('id', user?.id);

      if (error) throw error;
      await fetchProfile();
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold flex items-center">
                <User className="h-6 w-6 mr-2" />
                Mon Profil
              </h1>
              <button
                onClick={() => setEditMode(!editMode)}
                className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700"
              >
                <Settings className="h-5 w-5" />
                <span>{editMode ? 'Annuler' : 'Modifier'}</span>
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {editMode ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-medium text-gray-500">Email</h2>
                  <p className="mt-1">{profile?.email}</p>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500">Nom complet</h2>
                  <p className="mt-1">{profile?.full_name}</p>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500">Membre depuis</h2>
                  <p className="mt-1">
                    {new Date(profile?.created_at || '').toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}