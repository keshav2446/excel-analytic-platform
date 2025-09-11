import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import AOS from "aos";
import "aos/dist/aos.css";

export default function About() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-blue-900 text-white pt-24 px-6">

        {/* Hero */}
        <section className="text-center mb-16" data-aos="fade-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-lg text-purple-200 max-w-2xl mx-auto">
            Empowering users to extract insights from Excel files with real-time visualizations and analytics.
          </p>
        </section>

        {/* Mission and Vision */}
        <section className="mb-16 grid md:grid-cols-2 gap-10" data-aos="fade-up">
          <div>
            <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
            <p className="text-purple-200">
              To make data analytics accessible, intuitive, and visually powerful for everyone.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-3">Our Vision</h2>
            <p className="text-purple-200">
              A world where anyone can turn raw data into actionable insights instantly.
            </p>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="mb-16" data-aos="zoom-in-up">
          <h2 className="text-2xl font-semibold mb-6 text-center">Tech Stack We Use</h2>
          <div className="flex flex-wrap justify-center gap-6 text-center">
            {["React.js", "Node.js", "Express", "MongoDB", "Multer", "XLSX", "JWT", "Tailwind CSS"].map((tech) => (
              <div key={tech} className="bg-white/10 px-4 py-2 rounded-xl shadow-md hover:scale-105 transition">
                {tech}
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-16" data-aos="fade-up">
          <h2 className="text-2xl font-semibold mb-6 text-center">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Real-Time Charts", desc: "Dynamic visualizations from Excel data instantly." },
              { title: "Secure Uploads", desc: "JWT-protected, file-type restricted, secure backend." },
              { title: "Modern UI", desc: "Sleek and responsive interface built with Tailwind." },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white/10 p-4 rounded-lg shadow hover:shadow-xl transition">
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-purple-200">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Platform Capabilities Section */}
<section className="py-16 px-4 text-white" data-aos="fade-left">
  <h2 className="text-3xl font-bold mb-8 text-purple-300 text-center">What Our Platform Can Do</h2>
  <ul className="space-y-6 list-none max-w-4xl mx-auto">
    {[
      {
        icon: "📤",
        title: "Smart Excel Uploads",
        desc: "Upload .xls/.xlsx files easily with built-in validation and file type checking."
      },
      {
        icon: "📊",
        title: "Auto Chart Generation",
        desc: "Visualize your data automatically using bar and line charts."
      },
      {
        icon: "📁",
        title: "Organized Dashboard",
        desc: "Track all uploads, previews, and file insights in a clean UI."
      },
      {
        icon: "⚡",
        title: "Real-Time Analytics",
        desc: "Analyze numeric data on the fly and get meaningful summaries."
      },
      {
        icon: "🛠️",
        title: "Admin Panel Features",
        desc: "Monitor user uploads, platform usage, and manage access securely."
      },
      {
        icon: "🔒",
        title: "Secure and Scalable",
        desc: "Built on JWT, MongoDB, and modern practices for safety and speed."
      }
    ].map((item, idx) => (
      <li key={idx} className="flex items-start space-x-4">
        <span className="text-2xl">{item.icon}</span>
        <div>
          <h3 className="text-xl font-semibold">{item.title}</h3>
          <p className="text-purple-200">{item.desc}</p>
        </div>
      </li>
    ))}
  </ul>
</section>


     

        {/* Meet the Team */}
        <section className="mb-16" data-aos="fade-up">
          <h2 className="text-2xl font-semibold mb-6 text-center">Meet the Team</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { name: "Keshav Singh", role: "keshavsin16@gmail.com" },
              { name: "Tanu Shukla", role: "shuklatannu497@gmail.com" },
              { name: "Khushal Agarwal", role: "agarwalkhushal2704@gmail.com" },
              { name: "Sandeep Thamke", role: "sandeepthamke@gmail.com" },
            ].map((member, idx) => (
              <div key={idx} className="bg-white/10 p-4 rounded-xl text-center w-64">
                <div className="w-20 h-20 mx-auto bg-purple-500 rounded-full mb-4" />
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-purple-300">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center my-16" data-aos="fade-in">
          <h2 className="text-2xl font-semibold mb-3">Have Questions or Feedback?</h2>
          <p className="mb-4 text-purple-200">We'd love to hear from you.</p>
          <a
            href="/contact"
            className="inline-block bg-purple-600 hover:bg-purple-700 transition px-6 py-2 rounded-full text-white font-medium"
          >
            Contact Us
          </a>
        </section>

      </div>
    </>
  );
}
