import React, { useEffect, useState } from 'react';
import { getLogs } from '../services/api';

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLogs()
      .then((data) => {
        setLogs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch logs:', error);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🌍 Carbon Footprint Dashboard</h1>

      {loading ? (
        <p className="text-gray-600">Loading activity logs...</p>
      ) : logs.length === 0 ? (
        <p className="text-gray-500">No activity logs found.</p>
      ) : (
        <div className="grid gap-4">
          {logs.map((log) => (
            <div key={log._id} className="bg-white shadow-md rounded-lg p-4 border-l-4 border-green-500">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-lg">{log.activityType}</p>
                <p className="text-sm text-gray-500">{formatDate(log.timestamp)}</p>
              </div>
              <p className="text-gray-700 mt-2">
                Estimated Carbon Emission: <span className="font-medium">{log.carbonCost?.toFixed(3)} kg CO₂</span>
              </p>
              {log.details && (
                <p className="text-gray-600 mt-1 text-sm">Details: {log.details}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
