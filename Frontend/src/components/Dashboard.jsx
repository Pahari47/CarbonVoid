import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
  const [videoHours, setVideoHours] = useState('');
  const [cloudStorage, setCloudStorage] = useState('');
  const [videoCalls, setVideoCalls] = useState('');
  const [carbonReport, setCarbonReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const reportRef = useRef(null);

  useEffect(() => {
    setLogs([
      {
        _id: 1,
        activityType: '🎥 YouTube Streaming',
        timestamp: '2025-04-15T14:00:00Z',
        carbonCost: 0.5,
        details: '5 hours of streaming',
      },
      {
        _id: 2,
        activityType: '☁️ Cloud Storage',
        timestamp: '2025-04-15T15:00:00Z',
        carbonCost: 0.2,
        details: '10GB of cloud storage used',
      },
    ]);
  }, []);

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/getCarbonReport', {
        videoHours,
        cloudStorage,
        videoCalls,
      });
      setCarbonReport(response.data.carbonReport);
    } catch (err) {
      console.error('Error:', err);
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
    labels: ['Video Streaming', 'Cloud Storage', 'Video Calls'],
    datasets: [
      {
        label: 'Carbon Emission (kg CO₂)',
        data: [0.5, 0.2, 0.3],
        fill: false,
        borderColor: '#16a34a',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      x: { ticks: { color: '#555' } },
      y: { ticks: { color: '#555' } },
    },
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-8">
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-bold text-green-700 mb-1">🌿 Carbon Emission Dashboard</h1>
        <p className="text-gray-600">Track and reduce your digital carbon footprint</p>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">📊 Generate Your Carbon Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">🎞 Video Hours</label>
            <input
              type="number"
              value={videoHours}
              onChange={(e) => setVideoHours(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">☁️ Cloud Storage (GB)</label>
            <input
              type="number"
              value={cloudStorage}
              onChange={(e) => setCloudStorage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">📞 Video Call Hours</label>
            <input
              type="number"
              value={videoCalls}
              onChange={(e) => setVideoCalls(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={loading}
          className="mt-6 w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-md transition duration-300"
        >
          {loading ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      <div className="space-y-4">
        {logs.length > 0 ? (
          logs.map((log) => (
            <div
              key={log._id}
              className="bg-white p-4 border-l-4 border-green-500 rounded-md shadow-sm"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">{log.activityType}</span>
                <span className="text-sm text-gray-500">{formatDate(log.timestamp)}</span>
              </div>
              <p className="text-gray-700 mt-1">
                💨 Emission: <strong>{log.carbonCost?.toFixed(3)} kg CO₂</strong>
              </p>
              <p className="text-sm text-gray-500 mt-1">{log.details}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No activity logs found.</p>
        )}
      </div>

      {carbonReport && (
        <div className="bg-white rounded-lg shadow-md p-6" ref={reportRef}>
          <h2 className="text-xl font-semibold mb-2 text-green-700">📝 Carbon Emission Report</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{carbonReport}</p>
          <button
            onClick={handleDownloadPDF}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition"
          >
            📥 Download PDF
          </button>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">📈 Emission Visualization</h2>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Dashboard;
