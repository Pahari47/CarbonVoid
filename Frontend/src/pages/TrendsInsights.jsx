import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react'; // Import Clerk's useUser hook

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const TrendsInsights = () => {
  const { user } = useUser(); // Get user from Clerk
  const [timeRange, setTimeRange] = useState('weekly');
  const [mainChartData, setMainChartData] = useState(null);
  const [appChartsData, setAppChartsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch time-based emissions data
  const fetchTimeBasedEmissions = async () => {
    if (!user) return;
    
    try {
      const response = await axios.get(`/api/${user.id}/emissions/${timeRange}`);
      const data = response.data;
      
      const chartData = {
        labels: data.labels,
        datasets: [
          {
            label: 'Carbon Usage (kg)',
            data: data.values,
            backgroundColor: getBackgroundColor(timeRange),
            borderColor: getBorderColor(timeRange),
            borderWidth: 1,
          },
        ],
      };
      
      setMainChartData(chartData);
    } catch (err) {
      setError('Failed to load time-based emissions data');
      console.error(err);
    }
  };

  // Fetch service-wise emissions data
  const fetchServiceWiseEmissions = async () => {
    if (!user) return;
    
    try {
      const response = await axios.get(`/api/${user.id}/emissions/services`);
      const servicesData = response.data;
      
      const groupedData = groupServicesByCategory(servicesData);
      setAppChartsData(groupedData);
    } catch (err) {
      setError('Failed to load service-wise emissions data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to group services by category
  const groupServicesByCategory = (servicesData) => {
    const categories = {
      'Social Media': ['facebook', 'instagram', 'twitter', 'tiktok', 'linkedin'],
      'Streaming Services': ['netflix', 'youtube', 'spotify', 'disneyplus', 'amazonprime'],
      'Productivity Tools': ['slack', 'microsoftteams', 'zoom', 'googledocs', 'trello'],
    };
    
    return Object.entries(categories).map(([category, services]) => {
      const filteredServices = servicesData.filter(item => 
        services.includes(item.service.toLowerCase())
      );
      
      return {
        category,
        data: {
          labels: filteredServices.map(item => item.service),
          datasets: [
            {
              label: 'Carbon Emission (kg)',
              data: filteredServices.map(item => item.emission),
              backgroundColor: getRandomColors(filteredServices.length),
              borderColor: '#ffffff',
              borderWidth: 1,
            },
          ],
        },
      };
    });
  };

  // Color helper functions
  const getBackgroundColor = (timeframe) => {
    const colors = {
      weekly: 'rgba(75, 192, 192, 0.6)',
      monthly: 'rgba(54, 162, 235, 0.6)',
      yearly: 'rgba(153, 102, 255, 0.6)',
    };
    return colors[timeframe];
  };

  const getBorderColor = (timeframe) => {
    const colors = {
      weekly: 'rgba(75, 192, 192, 1)',
      monthly: 'rgba(54, 162, 235, 1)',
      yearly: 'rgba(153, 102, 255, 1)',
    };
    return colors[timeframe];
  };

  const getRandomColors = (count) => {
    return Array.from({ length: count }, () => 
      `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
    );
  };

  // Fetch data when component mounts or timeRange/user changes
  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([fetchTimeBasedEmissions(), fetchServiceWiseEmissions()])
        .catch(err => {
          setError('Failed to load data');
          console.error(err);
        });
    }
  }, [timeRange, user]);

  // Chart options
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Carbon Usage Overview',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Carbon Emission (kg)',
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'App Carbon Emissions',
      },
    },
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Please sign in to view your carbon usage data</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        <p>{error}</p>
        <button 
          onClick={() => {
            setError(null);
            setLoading(true);
            Promise.all([fetchTimeBasedEmissions(), fetchServiceWiseEmissions()]);
          }} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Carbon Usage Trends & Insights</h1>
      
      {/* Time range selector */}
      <div className="flex flex-wrap gap-4 mb-6">
        {['weekly', 'monthly', 'yearly'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg capitalize transition-colors ${
              timeRange === range 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {range}
          </button>
        ))}
      </div>
      
      {/* Main chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Total Carbon Usage ({timeRange})
        </h2>
        <div className="h-96">
          {mainChartData ? (
            <Bar data={mainChartData} options={barOptions} />
          ) : (
            <p className="text-gray-500">No data available for this time period</p>
          )}
        </div>
      </div>
      
      {/* App-specific charts */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Service-wise Carbon Emissions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appChartsData.length > 0 ? (
          appChartsData.map((app, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-700 mb-3">{app.category}</h3>
              <div className="h-64">
                <Pie data={app.data} options={pieOptions} />
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full">No service data available</p>
        )}
      </div>
    </div>
  );
};

export default TrendsInsights; 