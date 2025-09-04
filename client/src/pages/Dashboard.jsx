import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { FaSun, FaMoon } from "react-icons/fa";
 import axios from "axios"; 
 import { toast, ToastContainer } from "react-toastify";
 import "react-toastify/dist/ReactToastify.css";


const graphCategories = [
  {
    title: 'Bar & Column Charts',
    graphs: [
      { name: 'Bar Chart', icon: '📊', desc: 'Compare values across categories.' },
      { name: 'Stacked Bar Chart', icon: '📊', desc: 'Show parts of a whole.' },
      { name: 'Column Chart', icon: '📊', desc: 'Vertical bars for comparison.' },
      { name: 'Stacked Column Chart', icon: '📊', desc: 'Stacked vertical bars.' },
    ]
  },
  {
    title: 'Line & Area Charts',
    graphs: [
      { name: 'Line Chart', icon: '📈', desc: 'Trends over time.' },
      { name: 'Area Chart', icon: '📈', desc: 'Line chart with filled area.' },
      { name: 'Stacked Area Chart', icon: '📈', desc: 'Stacked filled areas.' },
      { name: 'Step Line Chart', icon: '📈', desc: 'Stepwise trends.' },
    ]
  },
  {
    title: 'Pie & Donut Charts',
    graphs: [
      { name: 'Pie Chart', icon: '🥧', desc: 'Show proportions of a whole.' },
      { name: 'Donut Chart', icon: '🍩', desc: 'Pie chart with a hole.' },
      { name: 'Semi Pie Chart', icon: '🥧', desc: 'Half-pie for proportions.' },
      { name: 'Polar Area Chart', icon: '🧭', desc: 'Area in polar coordinates.' },
    ]
  },
  {
    title: 'Scatter & Bubble Charts',
    graphs: [
      { name: 'Scatter Plot', icon: '🔵', desc: 'Show correlation between variables.' },
      { name: 'Bubble Chart', icon: '⚪', desc: 'Scatter plot with size dimension.' },
      { name: 'Dot Plot', icon: '🔘', desc: 'Dots for distribution.' },
      { name: 'Heatmap', icon: '🌡️', desc: 'Color-coded matrix.' },
    ]
  },
  {
    title: 'Distribution Charts',
    graphs: [
      { name: 'Histogram', icon: '📊', desc: 'Distribution of data.' },
      { name: 'Box Plot', icon: '📦', desc: 'Show quartiles and outliers.' },
      { name: 'Violin Plot', icon: '🎻', desc: 'Distribution and density.' },
      { name: 'Density Plot', icon: '🌈', desc: 'Smoothed distribution.' },
    ]
  },
  {
    title: 'Relationship Charts',
    graphs: [
      { name: 'Network Graph', icon: '🕸️', desc: 'Show relationships.' },
      { name: 'Sankey Diagram', icon: '🔀', desc: 'Flow between states.' },
      { name: 'Chord Diagram', icon: '⭕', desc: 'Inter-relationships.' },
      { name: 'Tree Map', icon: '🌳', desc: 'Hierarchical data.' },
    ]
  },
  {
    title: 'Geographical Charts',
    graphs: [
      { name: 'Map Chart', icon: '🗺️', desc: 'Data on a map.' },
      { name: 'Geo Heatmap', icon: '🔥', desc: 'Heatmap on map.' },
      { name: 'Bubble Map', icon: '🌍', desc: 'Bubbles on map.' },
      { name: 'Choropleth Map', icon: '🗺️', desc: 'Color-coded regions.' },
    ]
  },
  {
    title: 'Specialty Charts',
    graphs: [
      { name: 'Radar Chart', icon: '📡', desc: 'Multivariate data.' },
      { name: 'Funnel Chart', icon: '🔻', desc: 'Stages in a process.' },
      { name: 'Gauge Chart', icon: '⏲️', desc: 'Show progress or value.' },
      { name: 'Waterfall Chart', icon: '💧', desc: 'Cumulative effect.' },
    ]
  }
];

const graph2D = [
  { name: 'Bar Chart', icon: '📊', desc: '2D Bar Chart.' },
  { name: 'Line Chart', icon: '📈', desc: '2D Line Chart.' },
  { name: 'Pie Chart', icon: '🥧', desc: '2D Pie Chart.' },
  { name: 'Scatter Plot', icon: '🔵', desc: '2D Scatter Plot.' },
  { name: 'Area Chart', icon: '📈', desc: '2D Area Chart.' },
  { name: 'Histogram', icon: '📊', desc: '2D Histogram.' },
  { name: 'Box Plot', icon: '📦', desc: '2D Box Plot.' },
  { name: 'Radar Chart', icon: '📡', desc: '2D Radar Chart.' },
];
const graph3D = [
  { name: '3D Bar Chart', icon: '🧊', desc: '3D Bar Chart.' },
  { name: '3D Surface Chart', icon: '🌄', desc: '3D Surface Chart.' },
  { name: '3D Pie Chart', icon: '🥧', desc: '3D Pie Chart.' },
  { name: '3D Scatter Plot', icon: '🔵', desc: '3D Scatter Plot.' },
  { name: '3D Area Chart', icon: '📈', desc: '3D Area Chart.' },
  { name: '3D Bubble Chart', icon: '⚪', desc: '3D Bubble Chart.' },
  { name: '3D Line Chart', icon: '📈', desc: '3D Line Chart.' },
  { name: '3D Surface Plot', icon: '🌄', desc: '3D Surface Plot.' },
];

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('graph');
  const [uploadedFiles, setUploadedFiles] = useState([]); // For upload history
  const [excelData, setExcelData] = useState(null); // Parsed Excel data
  const [columns, setColumns] = useState([]); // Columns from Excel
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [activeGraphTab, setActiveGraphTab] = useState('2D');
  const [selectedGraphType, setSelectedGraphType] = useState(null);

  const [theme, setTheme] = useState("dark");
  const isDark = theme === "dark";


  // Dropzone for file upload


const onDrop = async (acceptedFiles) => {
  const file = acceptedFiles[0];

  const allowedExtensions = [".xls", ".xlsx"];
  const fileExtension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

  if (!allowedExtensions.includes(fileExtension)) {
    toast.error("❌ Upload Failed: Only .xls/.xlsx files allowed");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    setExcelData(json);
    setColumns(json[0] || []);
  };
  reader.readAsArrayBuffer(file);

  // Upload to server
  try {
    const formData = new FormData();
    formData.append("excelFile", file);
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5001/api/excel/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const responseData = await res.json(); 

    if (res.status === 401) {
      toast.error("❌ Unauthorized: Please log in again.");
      return;
    }

    if (!res.ok) {
      toast.error(`❌ Upload Failed: ${responseData.message || "Unknown error"}`);
      return;
    }

    toast.success("✅ File uploaded successfully");
    setUploadedFiles((prev) => [
      ...prev,
      { name: file.name, date: new Date().toLocaleString() },
    ]);
  } catch (err) {
    console.error("❌ Upload Failed:", err.message);
    toast.error(`❌ Upload Failed: ${err.message}`);
  }
};




  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: '.xlsx,.xls' });

  const handleDownloadChart = () => {
    alert('Download chart feature coming soon!');
  };

  const tabs = [
    { id: 'graph', name: 'Graph', icon: '📊' },
    { id: 'insights', name: 'Insights and Summaries', icon: '📈' },
    { id: 'reports', name: 'Reports', icon: '📋' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  const widgets = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: '👥'
    },
    {
      title: 'Revenue',
      value: '$45,678',
      change: '+8%',
      changeType: 'positive',
      icon: '💰'
    },
    {
      title: 'Active Projects',
      value: '23',
      change: '+3',
      changeType: 'positive',
      icon: '📁'
    },
    {
      title: 'Tasks Completed',
      value: '89%',
      change: '+5%',
      changeType: 'positive',
      icon: '✅'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'New user registered', time: '2 minutes ago', type: 'user' },
    { id: 2, action: 'Report generated', time: '15 minutes ago', type: 'report' },
    { id: 3, action: 'Data updated', time: '1 hour ago', type: 'data' },
    { id: 4, action: 'System backup completed', time: '2 hours ago', type: 'system' }
  ];

  return (
    <div
  className={`min-h-screen pt-20 transition-all duration-300 ${
    isDark
      ? "bg-gradient-to-br from-gray-900 via-slate-800 to-blue-900 text-white"
      : "bg-gradient-to-br from-white via-slate-100 to-gray-100 text-gray-900"
  }`}
>

    <button
  onClick={() => setTheme(isDark ? "light" : "dark")}
  className={`absolute top-6 right-6 text-xl p-2 rounded-full shadow z-50 ${
    isDark ? "bg-white/10 text-white" : "bg-purple-200 text-purple-800"
  }`}
  title="Toggle Theme"
>
  {isDark ? <FaSun /> : <FaMoon />}
  
</button>


<button
  onClick={() => {
    localStorage.removeItem("token");
    window.location.href = "/userlogin";
  }}
  className="absolute top-6 right-18 bg-red-500 text-white px-4 py-2 rounded"
>
  Logout
</button>




      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-navy-600 mt-2">
            Here's what's happening with your insights platform today.
          </p>
        </div>

        {/* File Upload and Upload History Side by Side */}
        <div className="mb-8 flex flex-col md:flex-row gap-6">
          {/* Drag and Drop Upload Card */}
          <div className="flex-1 bg-slate-800 text-white rounded-2xl shadow-lg p-8">

            <h2 className="text-xl font-semibold text-navy-500 mb-2">Upload Excel File</h2>
            <div
              {...getRootProps()}
              className={`relative border-2 border-navy-500 rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 bg-navy-50`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center h-full">
                <div className={`text-6xl mb-4 transition-transform duration-300 ${isDragActive ? 'animate-bounce text-pink-500' : 'text-navy-400'}`}>📥</div>
                <p className="text-lg font-semibold text-navy-700 mb-2">
                  {isDragActive ? 'Drop your Excel file here!' : 'Drag & drop your Excel file here'}
                </p>
                <p className="text-navy-500">or <span className="underline text-pink-500">click to select file</span></p>
                <div className="absolute inset-0 pointer-events-none rounded-2xl border-2 border-transparent group-hover:border-pink-300 transition-all duration-300"></div>
              </div>
            </div>
          </div>
          {/* Upload History Card */}
          <div className="flex-1 bg-slate-800 text-white rounded-2xl shadow-lg p-8">

          <ToastContainer position="top-right" autoClose={3000} />


            <h2 className="text-xl font-semibold text-navy-500 mb-2">Upload History</h2>
            <ul className="rounded-lg p-5 bg-navy-100">
              {uploadedFiles.length === 0 ? (
                <li className="text-navy-500">No files uploaded yet.</li>
              ) : (
                uploadedFiles.map((file, idx) => (
                  <li key={idx} className="py-2 flex justify-between">
                    <span>{file.name}</span>
                    <span className="text-sm text-black-400">{file.date}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* Data Mapping Section */}
        {excelData && columns.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-navy-900 mb-2">Data Mapping</h2>
            <div className="flex space-x-4">
              <div>
                <label className="block text-navy-700 mb-1">X Axis</label>
                <select value={xAxis} onChange={e => setXAxis(e.target.value)} className="border rounded px-2 py-1">
                  <option value="">Select column</option>
                  {columns.map((col, idx) => (
                    <option key={idx} value={col}>{col}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-navy-700 mb-1">Y Axis</label>
                <select value={yAxis} onChange={e => setYAxis(e.target.value)} className="border rounded px-2 py-1">
                  <option value="">Select column</option>
                  {columns.map((col, idx) => (
                    <option key={idx} value={col}>{col}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-navy-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-pink-500 text-navy-900'
                      : 'border-transparent text-navy-500 hover:text-navy-700 hover:border-navy-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="mb-8">
          {activeTab === 'graph' && (
            <div className="bg-slate-800 text-white rounded-lg shadow-md p-6">

              <h3 className="text-lg font-semibold text-navy-900 mb-4">Graph View</h3>
              {/* Placeholder for chart */}
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-navy-50 to-pink-50 rounded-lg">
                {xAxis && yAxis && excelData ? (
                  <div className="text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <p className="text-navy-600">Chart for {xAxis} vs {yAxis}</p>
                    <p className="text-sm text-navy-500">(Chart rendering coming soon)</p>
                    {selectedGraphType && (
                      <div className="mt-2 text-pink-600 font-semibold">Selected Graph: {selectedGraphType}</div>
                    )}
                  </div>
                ) : (
                  <p className="text-navy-500">Select X and Y axes to view chart.</p>
                )}
              </div>
              <button onClick={handleDownloadChart} className="mt-4 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600">Download Chart</button>
            </div>
          )}
          {activeTab === 'insights' && (
            <div className="bg-slate-800 text-white rounded-lg shadow-md p-6">

              <h3 className="text-lg font-semibold text-navy-900 mb-4">Insights and Summaries</h3>
              <p className="text-navy-600">(Insights and summaries based on uploaded data will appear here.)</p>
            </div>
          )}
          {activeTab === 'reports' && (
           <div className="bg-slate-800 text-white rounded-lg shadow-md p-6">

              <h3 className="text-lg font-semibold text-navy-900 mb-4">Reports</h3>
              <p className="text-navy-600">(Reports section coming soon.)</p>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="bg-slate-800 text-white rounded-lg shadow-md p-6">

              <h3 className="text-lg font-semibold text-navy-900 mb-4">Settings</h3>
              <p className="text-navy-600">(Settings section coming soon.)</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

         <div className="bg-slate-800 text-white rounded-lg shadow-md p-6">

            <h3 className="text-lg font-semibold text-navy-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border border-navy-200 rounded-lg hover:bg-navy-50 transition-colors duration-200">
                <div className="text-2xl mb-2">📤</div>
                <p className="text-sm font-medium text-navy-900">Upload Data</p>
              </button>
              <button className="p-4 border border-navy-200 rounded-lg hover:bg-navy-50 transition-colors duration-200">
                <div className="text-2xl mb-2">📊</div>
                <p className="text-sm font-medium text-navy-900">Create Report</p>
              </button>
              <button className="p-4 border border-navy-200 rounded-lg hover:bg-navy-50 transition-colors duration-200">
                <div className="text-2xl mb-2">👥</div>
                <p className="text-sm font-medium text-navy-900">Invite Users</p>
              </button>
              <button className="p-4 border border-navy-200 rounded-lg hover:bg-navy-50 transition-colors duration-200">
                <div className="text-2xl mb-2">⚙️</div>
                <p className="text-sm font-medium text-navy-900">Settings</p>
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-slate-800 text-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-navy-900 mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-navy-600">Database</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-navy-600">API Services</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-navy-600">Storage</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  75% Used
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-navy-600">Last Backup</span>
                <span className="text-sm text-navy-500">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>

      {/* 2D/3D Graph Tabs Section */}
<div className="mt-12">
  <h2 className="text-2xl font-bold text-white mb-4">Graph Types by Dimension</h2>
  <div className="flex space-x-4 mb-6">
    <button
      className={`px-6 py-2 rounded-full font-semibold border-2 transition-all duration-200 ${
        activeGraphTab === '2D'
          ? 'bg-pink-500 text-white border-pink-500'
          : 'bg-slate-700 text-slate-200 border-slate-500 hover:bg-slate-600'
      }`}
      onClick={() => setActiveGraphTab('2D')}
    >
      2D Graphs
    </button>
    <button
      className={`px-6 py-2 rounded-full font-semibold border-2 transition-all duration-200 ${
        activeGraphTab === '3D'
          ? 'bg-pink-500 text-white border-pink-500'
          : 'bg-slate-700 text-slate-200 border-slate-500 hover:bg-slate-600'
      }`}
      onClick={() => setActiveGraphTab('3D')}
    >
      3D Graphs
    </button>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {(activeGraphTab === '2D' ? graph2D : graph3D).map((g, i) => (
      <button
        key={i}
        className={`flex items-center space-x-4 p-4 rounded-lg bg-slate-800 text-white shadow hover:bg-slate-700 transition border-2 focus:outline-none ${
          selectedGraphType === g.name
            ? 'border-pink-500 ring-2 ring-pink-400'
            : 'border-slate-700'
        }`}
        onClick={() => setSelectedGraphType(g.name)}
        type="button"
      >
        <span className="text-3xl">{g.icon}</span>
        <div className="text-left">
          <div className="font-medium text-white">{g.name}</div>
          <div className="text-sm text-slate-300">{g.desc}</div>
        </div>
      </button>
    ))}
  </div>
</div>


        {/* Most Used Graph Types */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900 mb-6">Most Used Graph Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {graphCategories.map((cat, idx) => (
             <div key={idx} className="bg-slate-800 text-white rounded-xl shadow-lg p-6">
               <h3 className="text-xl font-semibold text-pink-400 mb-4">{cat.title}</h3>

                <div className="grid grid-cols-2 gap-4">
                  {cat.graphs.map((g, i) => (
                    <div key={i} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-pink-50 transition">
                      <span className="text-3xl">{g.icon}</span>
                      <div>
                        <div className="font-medium text-navy-900">{g.name}</div>
                        <div className="text-sm text-navy-500">{g.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 