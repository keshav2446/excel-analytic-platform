import React from "react";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const particles = Array.from({ length: 30 });

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-slate-800 to-blue-900 text-white">
      {/* Glowing particles */}
      {particles.map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${3 + Math.random() * 3}s`,
            animationDelay: `${Math.random() * 5}s`
          }}
        ></div>
      ))}

      <Navbar />

      {/* Main content */}
      <main className="p-10 mt-28 text-center backdrop-blur-sm bg-white/5 rounded-xl max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
          Welcome to <br />Excel Analytic Platform
        </h1>
        <p className="text-xl font-light mb-4 italic text-slate-300">
          Explore <span className="font-semibold text-white">analytics like never before.</span>
        </p>
        <p className="text-md text-slate-400">
          Import, analyze, and visualize your Excel data effortlessly.
        </p>
      </main>
    </div>
  );
};

export default HomePage;
