import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { Player } from "@lottiefiles/react-lottie-player";
import animationData from "../assets/success.json";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaFacebook,
  FaLinkedin,
  FaGithub,
  FaComments,
} from "react-icons/fa";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("https://formspree.io/f/mblkkbwk", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        toast.success("Message sent successfully!");
        setSubmitted(true);
        setForm({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
        playerRef.current?.play();
      } else {
        toast.error("Failed to send message.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-blue-900 text-white px-4 sm:px-6 pt-24">
      <ToastContainer position="top-right" theme="colored" />
      
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-6" data-aos="fade-down">
          Contact Us
        </h2>
        <p className="text-center text-gray-300 mb-12" data-aos="fade-up">
          Got a question? We’d love to hear from you.
        </p>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left Side: Form */}
          <form
            className="space-y-5 bg-slate-800 p-6 rounded-xl shadow-lg"
            onSubmit={handleSubmit}
            data-aos="fade-right"
          >
            <div>
              <label className="block mb-1 font-semibold">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full px-4 py-2 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full px-4 py-2 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Subject</label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="w-full px-4 py-2 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="4"
                placeholder="Your message..."
                className="w-full px-4 py-2 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md font-semibold"
            >
              Send Message
            </button>

            {submitted && (
              <div className="flex justify-center pt-4">
                <Player
                  ref={playerRef}
                  autoplay={false}
                  loop={false}
                  src={animationData}
                  style={{ height: "100px", width: "100px" }}
                />
              </div>
            )}
          </form>
          <div className="space-y-6" data-aos="fade-left">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-blue-400 text-xl" />
                <span>Moradabad, Uttar Pradesh, India</span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-blue-400 text-xl" />
                <span>keshavsin16@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-blue-400 text-xl" />
                <span>+91 9068497927</span>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <a href="https://linkedin.com/in/keshav-singh-08b436262" target="_blank" rel="noopener noreferrer">
                  <FaLinkedin className="text-xl hover:text-blue-500" />
                </a>
                <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
                  <FaGithub className="text-xl hover:text-gray-300" />
                </a>
                <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer">
                  <FaFacebook className="text-xl hover:text-blue-600" />
                </a>
              </div>
            </div>

            {/* Embedded Map */}
            <iframe
              title="Location"
              className="w-full h-64 rounded-lg shadow-md"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14013.314968698452!2d78.7532267!3d28.838614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ab5d81e37a3a7%3A0x4d3f02b89e8e54e9!2sMoradabad%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1693657632841!5m2!1sen!2sin"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <a
        href="#"
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 z-50"
        title="Contact Support"
      >
        <FaComments className="text-xl" />
      </a>
    </div>
  );
}
