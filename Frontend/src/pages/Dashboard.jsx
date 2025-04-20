import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { motion } from "framer-motion";
import { useUser, useAuth } from "@clerk/clerk-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ParticleBackground from "../animation/ParticleBackground";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Function to generate random activity data
const generateRandomActivities = () => {
  const activityTypes = [
    "Email Sent",
    "Video Call",
    "Cloud Storage",
    "Web Browsing",
    "File Download",
    "Social Media",
    "Online Gaming",
    "Video Streaming"
  ];
  
  const activities = [];
  const now = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    activities.push({
      _id: `random-${i}`,
      activityType: activityTypes[Math.floor(Math.random() * activityTypes.length)],
      carbonFootprint: parseFloat((Math.random() * 0.5 + 0.1).toFixed(3)),
      timestamp: date.toISOString(),
      details: "Sample generated activity data"
    });
  }
  
  return activities;
};

// Function to generate a random report
const generateRandomReport = (activities) => {
  const total = activities.reduce((sum, activity) => sum + activity.carbonFootprint, 0);
  const avg = (total / activities.length).toFixed(3);
  
  return `CARBON FOOTPRINT REPORT\n\n` +
    `Generated on: ${new Date().toLocaleDateString()}\n\n` +
    `Total emissions: ${total.toFixed(3)} kg CO₂\n` +
    `Daily average: ${avg} kg CO₂\n\n` +
    `Top activities:\n` +
    `${activities.slice(0, 3).map(a => `- ${a.activityType}: ${a.carbonFootprint} kg CO₂`).join('\n')}\n\n` +
    `Recommendations:\n` +
    `- Consider reducing video streaming quality\n` +
    `- Clean up unused cloud storage\n` +
    `- Schedule larger downloads during off-peak hours`;
};

const Dashboard = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [logs, setLogs] = useState([]);
  const [carbonReport, setCarbonReport] = useState(null);
  const [loading, setLoading] = useState({
    logs: false,
    report: false,
    pdf: false
  });
  const [showGraph, setShowGraph] = useState(false);
  const [error, setError] = useState(null);
  const [usingSampleData, setUsingSampleData] = useState(false);
  const reportRef = useRef(null);

  useEffect(() => {
    const fetchUserFootprint = async () => {
      if (!isLoaded || !user) return;
      
      setLoading(prev => ({ ...prev, logs: true }));
      setError(null);

      try {
        const token = await getToken();
        const response = await axios.get(
          `http://localhost:3000/api/activity/activities/${user.id}/footprint`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (response.data?.activities?.length > 0) {
          setLogs(response.data.activities);
          setUsingSampleData(false);
        } else {
          // Generate sample data if no data returned
          const sampleData = generateRandomActivities();
          setLogs(sampleData);
          setUsingSampleData(true);
        }
      } catch (err) {
        console.error("Error fetching footprint data:", err);
        // Generate sample data if API fails
        const sampleData = generateRandomActivities();
        setLogs(sampleData);
        setUsingSampleData(true);
        // setError("Using sample data as we couldn't load your activities");
      } finally {
        setLoading(prev => ({ ...prev, logs: false }));
      }
    };

    fetchUserFootprint();
  }, [isLoaded, user, getToken]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleGenerateReport = async () => {
    if (!user) return;
    
    setLoading(prev => ({ ...prev, report: true }));
    setError(null);

    try {
      if (usingSampleData) {
        // Generate random report if using sample data
        const report = generateRandomReport(logs);
        setCarbonReport(report);
      } else {
        const token = await getToken();
        const response = await axios.post(
          `http://localhost:3000/api/reports/${user.id}`,
          { userId: user.id },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setCarbonReport(response.data.report);
      }
      setShowGraph(true);
    } catch (err) {
      console.error("Error generating report:", err);
      // Fallback to random report if API fails
      const report = generateRandomReport(logs);
      setCarbonReport(report);
      setShowGraph(true);
      setError("Generated sample report as we couldn't connect to the server");
    } finally {
      setLoading(prev => ({ ...prev, report: false }));
    }
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    
    setLoading(prev => ({ ...prev, pdf: true }));

    try {
      const canvas = await html2canvas(reportRef.current);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${user?.username || 'carbon'}_report.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
      setError("Failed to generate PDF");
    } finally {
      setLoading(prev => ({ ...prev, pdf: false }));
    }
  };

  const chartData = {
    labels: logs.map((log) => 
      new Date(log.timestamp).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Carbon Emission (kg CO₂)",
        data: logs.map((log) => log.carbonFootprint),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#10b981",
        borderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        labels: { 
          color: "#e5e7eb",
          font: {
            size: 14,
            family: "'Inter', sans-serif"
          }
        },
        position: 'top',
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#f3f4f6',
        bodyColor: '#e5e7eb',
        borderColor: '#4b5563',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value?.toFixed(3)} kg CO₂`;
          }
        }
      }
    },
    scales: {
      x: { 
        ticks: { 
          color: "#9ca3af",
          maxRotation: 45,
          minRotation: 45,
          font: {
            family: "'Inter', sans-serif"
          }
        },
        grid: {
          color: "rgba(255, 255, 255, 0.05)"
        }
      },
      y: { 
        ticks: { 
          color: "#9ca3af",
          font: {
            family: "'Inter', sans-serif"
          }
        },
        grid: {
          color: "rgba(255, 255, 255, 0.05)"
        }
      },
    },
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-emerald-100 text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate total emissions
  const totalEmissions = logs.reduce((sum, log) => sum + log.carbonFootprint, 0).toFixed(3);
  const avgEmissions = (logs.length > 0 ? totalEmissions / logs.length : 0).toFixed(3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100"
    >
      <ParticleBackground />

      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.header 
          className="text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300 mb-3">
            Personalized Carbon Reports
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {user?.username ? `Welcome back, ${user.username}! Track and reduce your digital carbon emissions.` : "Monitor your digital environmental impact"}
            {usingSampleData && (
              <span className="inline-block ml-2 px-2 py-1 bg-amber-900/50 text-amber-200 text-xs rounded-full">
                Using sample data
              </span>
            )}
          </p>
        </motion.header>

        {/* Stats Overview */}
        {logs.length > 0 && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-5 shadow-lg">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-emerald-900/30 text-emerald-400 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Activities</p>
                  <p className="text-2xl font-semibold">{logs.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-5 shadow-lg">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-amber-900/30 text-amber-400 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Emissions</p>
                  <p className="text-2xl font-semibold">{totalEmissions} kg CO₂</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-5 shadow-lg">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-900/30 text-blue-400 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Daily Average</p>
                  <p className="text-2xl font-semibold">{avgEmissions} kg CO₂</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div 
            className="bg-red-900/50 backdrop-blur-sm border border-red-700 text-red-100 p-4 rounded-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </motion.div>
        )}

        {/* Activities Section */}
        <motion.div
          className="backdrop-blur-sm bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-1">
                {loading.logs ? "Loading your activities..." : 
                 usingSampleData ? "Sample Activity Data" : "Your Digital Activities"}
              </h2>
              <p className="text-gray-400">Tracked digital activities and their carbon footprint</p>
            </div>
            <button
              onClick={handleGenerateReport}
              disabled={loading.report || logs.length === 0}
              className={`${
                loading.report || logs.length === 0
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400"
              } text-white font-medium px-6 py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center mt-4 md:mt-0 shadow-lg hover:shadow-emerald-500/20`}
            >
              {loading.report ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generate Report
                </>
              )}
            </button>
          </div>
          
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {logs.length > 0 ? (
              logs.map((log) => (
                <motion.div
                  key={log._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gray-700/30 hover:bg-gray-700/50 p-4 border-l-4 border-emerald-500 rounded-lg transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <div className="bg-emerald-900/20 text-emerald-400 p-2 rounded-lg mr-3">
                        {(() => {
                          switch(log.activityType) {
                            case 'Email Sent': return '✉️';
                            case 'Video Call': return '📹';
                            case 'Cloud Storage': return '☁️';
                            case 'Web Browsing': return '🌐';
                            case 'File Download': return '📥';
                            case 'Social Media': return '📱';
                            case 'Online Gaming': return '🎮';
                            case 'Video Streaming': return '📺';
                            default: return '💻';
                          }
                        })()}
                      </div>
                      <div>
                        <h3 className="font-medium capitalize">{log.activityType}</h3>
                        <p className="text-sm text-gray-400">
                          {formatDate(log.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-gray-800 px-3 py-1 rounded-full flex items-center">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                        <span className="font-medium">{log.carbonFootprint?.toFixed(3)} kg CO₂</span>
                      </div>
                    </div>
                  </div>
                  {log.details && (
                    <p className="text-sm text-gray-400 mt-2 pl-14">{log.details}</p>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-400 mt-2">
                  {loading.logs ? "Loading activities..." : "No activities found. Your digital footprint will appear here."}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Report Section */}
        {carbonReport && (
          <motion.div
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl overflow-hidden"
            ref={reportRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 p-5 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {usingSampleData ? "Sample Carbon Report" : "Your Carbon Emission Report"}
                </h2>
                <p className="text-gray-400 text-sm">Generated on {new Date().toLocaleDateString()}</p>
              </div>
              <button
                onClick={handleDownloadPDF}
                disabled={loading.pdf}
                className={`${
                  loading.pdf ? "bg-blue-700" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
                } text-white px-5 py-2 rounded-lg transition-all duration-300 flex items-center shadow-lg hover:shadow-blue-500/20`}
              >
                {loading.pdf ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Preparing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download PDF
                  </>
                )}
              </button>
            </div>
            <div className="p-6 bg-gray-900/30">
              <div className="whitespace-pre-wrap font-mono text-gray-200 bg-gray-900 p-6 rounded-lg border border-gray-800">
                {carbonReport}
              </div>
            </div>
          </motion.div>
        )}

        {/* Graph Section */}
        {showGraph && logs.length > 0 && (
          <motion.div
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-2xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  {usingSampleData ? "Emission Trends" : "Your Carbon Emission Trends"}
                </h2>
                <p className="text-gray-400">Visualization of your digital carbon footprint over time</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-emerald-500 rounded-full mr-1"></span>
                  <span className="text-sm text-gray-400">kg CO₂</span>
                </span>
              </div>
            </div>
            <div className="h-80">
              <Line data={chartData} options={chartOptions} />
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.footer 
          className="text-center text-gray-500 text-sm pt-8 pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>Together we can reduce our digital carbon footprint 🌱</p>
          <p className="mt-1">© {new Date().getFullYear()} Carbon Tracker</p>
        </motion.footer>
      </div>
    </motion.div>
  );
};

export default Dashboard;