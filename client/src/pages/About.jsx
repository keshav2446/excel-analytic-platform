import React from "react";
import Navbar from "../components/Navbar";

export default function About() {
  return (<>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white px-6 pt-24">
      
      <h1 className="text-4xl font-bold mb-4">About</h1>
      <p className="text-lg text-purple-200">
        This is a platform to explore and analyze Excel data with powerful visualization and user-friendly interface.
      </p>
    </div>
    </>
  );
}
