import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { Bar, Line } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const HomePage = () => {
  const [recentUploads, setRecentUploads] = useState([]);
  const [chartType, setChartType] = useState("bar");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUploads = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/excel", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setRecentUploads(data.slice(0, 3)); // show top 3
        }

        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload);
      } catch (err) {
        console.error("Error fetching recent uploads:", err);
      }
    };

    fetchUploads();
  }, []);

 
  const chartOptions = {
  responsive: true,
  plugins: {
    datalabels: {
      color: 'white',
      anchor: 'end',
      align: 'top',
      formatter: Math.round,
      font: {
        weight: 'bold',
        size: 12
      }
    },
    legend: {
      position: 'bottom',
      labels: {
        color: 'white',
        font: {
          weight: 'bold'
        }
      }
    },
    title: {
      display: false,
    }
  },
  scales: {
    x: {
      ticks: {
        color: 'white',
        font: {
          weight: 'bold'
        }
      }
    },
    y: {
      ticks: {
        color: 'white',
        font: {
          weight: 'bold'
        }
      }
    }
  },
  layout: {
    padding: {
      top: 50,     
      bottom: 20,  
    }
  }
};


  const calculateAverages = (rows, numericCols) => {
    const sums = {};
    numericCols.forEach(col => sums[col] = 0);

    rows.forEach(row => {
      numericCols.forEach(col => {
        const val = parseFloat(row[col]);
        if (!isNaN(val)) {
          sums[col] += val;
        }
      });
    });

    return numericCols.map(col => rows.length ? sums[col] / rows.length : 0);
  };

  const renderChart = (file) => {
    if (!file.sampleData || file.sampleData.length === 0) {
      return <p className="text-sm text-slate-400">No data available</p>;
    }

    const isMostlyNumeric = (col, data) => {
  const total = data.length;
  const numericCount = data.filter(row => !isNaN(parseFloat(row[col]))).length;
  return numericCount >= total / 2; // At least 50% values must be numeric
};

const numericCols = file.columns.filter(col => isMostlyNumeric(col, file.sampleData));


    if (!numericCols.length) {
      return <p className="text-sm text-slate-400">No numeric data</p>;
    }

    const averageValues = calculateAverages(file.sampleData, numericCols);

    const chartData = {
      labels: numericCols,
      datasets: [
        {
          label: "Average Values",
          data: averageValues,
          backgroundColor: "rgba(59,130,246,0.6)",
          borderColor: "#3b82f6",
          borderWidth: 2,
          fill: false,
        },
      ],
    };

    return chartType === "line" ? (
      <Line data={chartData} options={chartOptions} />
    ) : (
      <Bar data={chartData} options={chartOptions} />
    );
  };

  const handleDelete = async (fileId) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  if (!window.confirm("Are you sure you want to delete this file?")) return;

  try {
    const res = await fetch(`http://localhost:5001/api/excel/${fileId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      // ✅ Remove from UI
      setRecentUploads(prev => prev.filter(file => file._id !== fileId));
    } else {
      const err = await res.json();
      alert("Failed to delete: " + err.message);
    }
  } catch (error) {
    console.error("❌ Delete error:", error);
    alert("Something went wrong while deleting");
  }
};


  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-blue-900 text-white overflow-x-hidden">
      {/* Background Glow */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${3 + Math.random() * 3}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      <Navbar />

      {/* Hero Section */}
      <main className="mt-28 px-6 max-w-5xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
          Welcome to <br />
          Excel Analytic Platform
        </h1>
        <p className="text-xl italic text-slate-300 mb-2">
          Explore{" "}
          <span className="font-semibold text-white">
            analytics like never before.
          </span>
        </p>
        <p className="text-md text-slate-400 mb-6">
          Import, analyze, and visualize your Excel data effortlessly.
        </p>
      </main>

      {/* Recent Uploads Section */}
      {user && (
        <section className="mt-10 px-6 max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">📈 Recent Uploads</h2>
            <div>
              <label className="mr-2 text-sm">Chart Type:</label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="rounded px-2 py-1 text-black"
              >
                <option value="bar">Bar</option>
                <option value="line">Line</option>
              </select>
            </div>
          </div>

          {recentUploads.length === 0 ? (
            <p className="text-slate-300">No uploads found.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {recentUploads.map((file) => (
                <div
                  key={file._id}
                  className="bg-white/5 p-5 rounded-lg shadow border border-white/10"
                >
                  <h3 className="text-lg font-semibold mb-2">{file.originalName}</h3>
                  <p className="text-sm text-slate-300 mb-4">
                    Rows: {file.rowCount}, Columns: {file.columns?.length}
                  </p>
                  {renderChart(file)}

                  <button
        onClick={() => handleDelete(file._id)}
        className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded text-sm transition"
      >
        Delete
      </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow-lg transition"
            >
              See All Uploads →
            </button>
          </div>
        </section>
      )}

      {/* Admin Only Area */}
      {user?.role === "admin" && (
        <section className="mt-16 px-6 max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">🧠 Admin Dashboard</h2>
          <p className="text-sm text-slate-400 mb-2">
            Coming soon: analytics, system stats, and user insights
          </p>
        </section>
      )}

      <footer className="mt-16 py-8 text-center text-sm text-slate-400 border-t border-white/10">
        &copy; {new Date().getFullYear()} Excel Analytic Platform. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
