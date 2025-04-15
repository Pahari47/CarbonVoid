import React, { useEffect, useState } from 'react';
import { getLogs } from '../services/api';

const Dashboard = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Fetch logs for the dashboard
    getLogs().then((data) => setLogs(data));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Carbon Footprint Dashboard</h1>
      <div className="mt-4">
        {logs.map((log) => (
          <div key={log._id} className="border p-2 mb-2">
            <p>{log.activityType}</p>
            <p>Carbon Impact: {log.carbonCost} kg CO₂</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
