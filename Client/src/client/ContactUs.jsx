import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiSend } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import api from "../api";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await api.post("/api/contacts", formData);

      if (response.data.success) {
        setIsSubmitted(true);
        setFormData({ name: "", email: "", message: "" });

        setTimeout(() => {
          setIsSubmitted(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Contact submission error:", error);
      setError(
        error.response?.data?.error ||
          "Failed to send message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappNumber = "212620303597";
  const contactEmail = "yassinaitamghar8@gmail.com";

  return (
    <section
      id="contact"
      className="bg-gradient-to-b from-gray-900 to-gray-950 text-white py-16 relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(67,56,202,0.4)_0%,transparent_40%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.3)_0%,transparent_40%)]"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Connect With Us</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Have questions about our IPTV service or need support? We're here to
            help!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="md:col-span-2 space-y-6"
          >
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-medium mb-6">Contact Options</h3>

              <div className="space-y-6">
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center group p-3 rounded-lg transition-all duration-300 hover:bg-indigo-900 hover:bg-opacity-40"
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-600 bg-opacity-20 flex items-center justify-center mr-4 group-hover:bg-opacity-40 transition-all duration-300">
                    <FiMail className="text-indigo-400 text-xl" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Email Us</p>
                    <p className="text-sm text-gray-300">{contactEmail}</p>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center group p-3 rounded-lg transition-all duration-300 hover:bg-green-900 hover:bg-opacity-40"
                >
                  <div className="w-12 h-12 rounded-full bg-green-600 bg-opacity-20 flex items-center justify-center mr-4 group-hover:bg-opacity-40 transition-all duration-300">
                    <FaWhatsapp className="text-green-400 text-xl" />
                  </div>
                  <div>
                    <p className="font-medium text-white">WhatsApp</p>
                    <p className="text-sm text-gray-300">+{whatsappNumber}</p>
                  </div>
                </a>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-700">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="flex justify-center space-x-4 p-2"
                >
                  <div className="px-4 py-2 bg-indigo-900 bg-opacity-50 backdrop-blur-sm rounded-lg text-sm text-center">
                    <span className="block font-medium">24/7</span>
                    <span className="text-xs text-gray-300">Support</span>
                  </div>
                  <div className="px-4 py-2 bg-indigo-900 bg-opacity-50 backdrop-blur-sm rounded-lg text-sm text-center">
                    <span className="block font-medium">15 min</span>
                    <span className="text-xs text-gray-300">Response time</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="md:col-span-3"
          >
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600 rounded-full filter blur-3xl opacity-10 -mr-20 -mt-20"></div>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-10"
                >
                  <div className="w-16 h-16 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-gray-300 text-center">
                    Thank you for contacting us. We'll respond shortly.
                  </p>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-xl font-medium mb-6">Send a Message</h3>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-900 bg-opacity-50 border border-red-600 text-red-200 px-4 py-3 rounded-lg mb-4"
                    >
                      {error}
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 bg-opacity-50 text-white border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 bg-opacity-50 text-white border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 bg-opacity-50 text-white border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-none"
                        required
                      ></textarea>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium py-3 px-6 rounded-lg hover:from-indigo-500 hover:to-indigo-600 transition duration-300 flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      ) : (
                        <FiSend className="mr-2" />
                      )}
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </motion.button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
