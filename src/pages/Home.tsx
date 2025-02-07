import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, MapPin, ChartBar } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {
  const chartData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Ventes mensuelles',
        data: [65, 59, 80, 81, 56, 90],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Évolution des ventes',
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bienvenue sur notre plateforme de gestion d'articles
        </h1>
        <p className="text-xl text-gray-600">
          Découvrez notre sélection de produits et gérez vos commandes en toute simplicité.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link
          to="/products"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <ShoppingBag className="h-12 w-12 text-indigo-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Nos Produits</h2>
          <p className="text-gray-600">
            Découvrez notre gamme de produits de qualité.
          </p>
        </Link>

        <Link
          to="/stores"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <MapPin className="h-12 w-12 text-indigo-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Nos Boutiques</h2>
          <p className="text-gray-600">
            Trouvez la boutique la plus proche de chez vous.
          </p>
        </Link>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <ChartBar className="h-12 w-12 text-indigo-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Statistiques</h2>
          <p className="text-gray-600">
            Suivez l'évolution de nos ventes.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Analyse des ventes</h2>
        <div className="h-[400px]">
          <Line options={chartOptions} data={chartData} />
        </div>
      </div>
    </div>
  );
}