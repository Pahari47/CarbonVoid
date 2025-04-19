import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import jsPDF from 'jspdf';

import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [carbonReport, setCarbonReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const reportRef = useRef(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/activityLogs');
        setLogs(response.data.logs || []);
      } catch (err) {
        console.error('Error fetching logs:', err);
      }
    };
    fetchLogs();
  }, []);

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/getCarbonReport');
      setCarbonReport(response.data.carbonReport);
      setShowGraph(true);
    } catch (err) {
      console.error('Error generating report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('carbon_report.pdf');
  };

  const chartData = {
    labels: logs.map((log) => log.activityType),
    datasets: [
      {
        label: 'Carbon Emission (kg CO₂)',
        data: logs.map((log) => log.carbonCost),
        borderColor: '#22c55e',
        tension: 0.4,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#fff' } },
    },
    scales: {
      x: { ticks: { color: '#fff' } },
      y: { ticks: { color: '#fff' } },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen bg-black overflow-hidden"
    >
      {/* Molecular Background Animation */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <svg className="w-full h-full animate-pulse" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="molecule" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" fill="white" />
              <circle cx="50" cy="50" r="2" fill="white" />
              <line x1="10" y1="10" x2="50" y2="50" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#molecule)" />
        </svg>
      </div>

      <div className="relative z-10 p-4 sm:p-8 max-w-6xl mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            🌍 Digital Carbon Footprint Insights
          </h1>
          <p className="text-gray-400 text-lg">
            Visualize your digital emissions and generate your custom carbon report
          </p>
        </div>

        <motion.div
          className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 shadow-lg"
          whileHover={{ scale: 1.01 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-white">🧾 Tracked Activities</h2>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {logs.length > 0 ? (
              logs.map((log) => (
                <div
                  key={log._id}
                  className="bg-white/5 p-4 border-l-4 border-green-500 rounded-md shadow-sm text-white"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{log.activityType}</span>
                    <span className="text-sm text-gray-400">{formatDate(log.timestamp)}</span>
                  </div>
                  <p className="mt-1">
                    💨 Emission: <strong>{log.carbonCost?.toFixed(3)} kg CO₂</strong>
                  </p>
                  <p className="text-sm text-gray-400 mt-1">{log.details}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No activity logs found.</p>
            )}
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-md transition duration-300"
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </motion.div>

        {carbonReport && (
          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-lg shadow-md p-6 text-white"
            ref={reportRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-xl font-semibold mb-2 text-green-400">📄 Carbon Emission Report</h2>
            <p className="whitespace-pre-wrap">{carbonReport}</p>
            <button
              onClick={handleDownloadPDF}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition"
            >
              📥 Download PDF
            </button>
          </motion.div>
        )}

        {showGraph && (
          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-lg p-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-white">📈 Emission Visualization</h2>
            <Line data={chartData} options={chartOptions} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;
