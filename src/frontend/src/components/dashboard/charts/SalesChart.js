import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SalesChart() {
  const data = {
    labels: ['Poivrons', 'Tomates', 'Piments', 'Aubergines', 'Concombres'],
    datasets: [
      {
        label: 'Ventes par Produit',
        data: [35, 30, 15, 12, 8],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',   // Vert
          'rgba(59, 130, 246, 0.8)',  // Bleu
          'rgba(245, 158, 11, 0.8)',  // Orange
          'rgba(168, 85, 247, 0.8)',  // Violet
          'rgba(236, 72, 153, 0.8)',  // Rose
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(236, 72, 153, 1)',
        ],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i];
                const total = dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.borderColor[i],
                  lineWidth: dataset.borderWidth,
                  hidden: false,
                  index: i,
                  pointStyle: 'circle',
                };
              });
            }
            return [];
          },
        },
      },
      title: {
        display: true,
        text: 'Répartition des Ventes par Produit',
        font: {
          size: 16,
          weight: 'bold',
          family: 'Inter, sans-serif',
        },
        color: '#1f2937',
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(34, 197, 94, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value}% (${percentage}% du total)`;
          }
        }
      },
    },
    cutout: '60%',
    elements: {
      arc: {
        borderJoinStyle: 'round',
      },
    },
  };

  // Données statistiques pour affichage au centre
  const totalSales = data.datasets[0].data.reduce((a, b) => a + b, 0);
  const topProduct = data.labels[data.datasets[0].data.indexOf(Math.max(...data.datasets[0].data))];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
      <div className="relative h-64 sm:h-80">
        <Doughnut data={data} options={options} />
        
        {/* Centre du donut avec statistiques */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{totalSales}%</div>
            <div className="text-sm text-gray-600">Total Ventes</div>
            <div className="text-xs text-green-600 mt-1 font-medium">
              Top: {topProduct}
            </div>
          </div>
        </div>
      </div>
      
      {/* Statistiques supplémentaires */}
      <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">
            {Math.max(...data.datasets[0].data)}%
          </div>
          <div className="text-xs text-gray-600">Meilleur produit</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600">
            {data.labels.length}
          </div>
          <div className="text-xs text-gray-600">Produits vendus</div>
        </div>
      </div>
    </div>
  );
}
