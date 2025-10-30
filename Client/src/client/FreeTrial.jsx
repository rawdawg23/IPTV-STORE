import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";

const FreeTrial = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [trialForm, setTrialForm] = useState({
    name: "",
    email: "",
    phone: "",
    plan: "basic",
  });

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setActiveFeature(0);
      const interval = setInterval(() => {
        setActiveFeature((prev) => (prev + 1) % 6);
      }, 3000);
      return () => clearInterval(interval);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleContactRedirect = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePricingRedirect = () => {
    const pricingSection = document.getElementById("pricing");
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleTrialSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await api.post("/api/trials", {
        name: trialForm.name,
        email: trialForm.email,
        phone: trialForm.phone,
        plan: trialForm.plan,
        source: "website",
        deviceInfo: navigator.userAgent,
      });

      if (response.data.success) {
        setSuccess(
          "Free trial registered successfully! Check your email for activation details."
        );
        setTrialForm({
          name: "",
          email: "",
          phone: "",
          plan: "basic",
        });
      }
    } catch (error) {
      console.error("Trial registration error:", error);
      setError(
        error.response?.data?.error ||
          "Failed to register for free trial. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTrialForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1] },
    },
  };

  const glowVariants = {
    idle: { opacity: 0.5, scale: 1 },
    active: {
      opacity: [0.5, 0.8, 0.5],
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const ctaButtonVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.7 },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(0, 119, 255, 0.5)",
      transition: { duration: 0.3 },
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 },
    },
  };

  const titleCharVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.8,
        ease: [0.23, 1, 0.32, 1],
      },
    }),
  };

  const features = [
    {
      title: "Massive Channel Lineup",
      description:
        "Explore hundreds of global channels tailored to your interests",
      icon: "📺",
      color: "from-green-400 to-emerald-600",
    },
    {
      title: "On-Demand Entertainment",
      description:
        "Access thousands of latest movies & series anytime, anywhere",
      icon: "🎬",
      color: "from-purple-400 to-indigo-600",
    },
    {
      title: "Superior Streaming Quality",
      description: "Enjoy crystal-clear, buffer-free viewing in HD, 4K & 8K",
      icon: "⭐",
      color: "from-yellow-400 to-amber-600",
    },
    {
      title: "Multi-Device Support",
      description:
        "Seamless experience across Smart TVs, phones, tablets & more",
      icon: "📱",
      color: "from-red-400 to-rose-600",
    },
    {
      title: "Unmatched Reliability",
      description:
        "99.9% uptime with smart load balancing for consistent streaming",
      icon: "🔄",
      color: "from-teal-400 to-cyan-600",
    },
    {
      title: "24/7 Premium Support",
      description:
        "Expert assistance available instantly via chat, email or call",
      icon: "🎧",
      color: "from-blue-400 to-indigo-600",
    },
  ];

  const mainTitle = "Experience Next-Gen IPTV";
  const subTitle = "Start Your Free Trial Today";

  return (
    <section
      id="freetrial"
      className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-gray-950 to-gray-900 text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_35%,rgba(20,120,255,0.08)_0%,rgba(0,0,0,0)_60%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_65%,rgba(20,255,160,0.1)_0%,rgba(0,0,0,0)_60%)]"></div>
      <div className="absolute w-full h-full">
        <div className="absolute h-32 w-32 rounded-full bg-blue-600/20 blur-3xl top-1/4 left-1/4 animate-float-slow"></div>
        <div className="absolute h-48 w-48 rounded-full bg-purple-600/10 blur-3xl bottom-1/3 right-1/3 animate-float"></div>
        <div className="absolute h-24 w-24 rounded-full bg-emerald-600/15 blur-3xl bottom-1/4 left-1/3 animate-float-reverse"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatePresence>
          {isVisible && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-7xl mx-auto"
            >
              <motion.h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-center mb-8 leading-tight">
                <div className="flex justify-center flex-wrap">
                  {mainTitle.split("").map((char, index) => (
                    <motion.span
                      key={index}
                      custom={index}
                      variants={titleCharVariants}
                      initial="hidden"
                      animate="visible"
                      className={`inline-block ${char === " " ? "w-4" : ""} ${
                        index % 3 === 0
                          ? "text-blue-400"
                          : index % 3 === 1
                          ? "text-cyan-300"
                          : "text-teal-400"
                      }`}
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
              </motion.h2>

              <motion.div
                variants={itemVariants}
                className="flex justify-center items-center mb-6"
              >
                <span className="relative inline-flex">
                  <motion.span className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                    {subTitle.split("").map((char, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: {
                            delay: 0.5 + index * 0.03,
                            duration: 0.5,
                          },
                        }}
                        className="inline-block"
                      >
                        {char}
                      </motion.span>
                    ))}
                  </motion.span>
                  <motion.span
                    className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-teal-400"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                  ></motion.span>
                </span>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto mb-16 text-center"
              >
                Discover a revolutionary streaming experience with cutting-edge
                technology and unmatched content variety.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8 mb-20"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="group relative rounded-2xl"
                    initial="idle"
                    animate={activeFeature === index ? "active" : "idle"}
                    whileHover="active"
                  >
                    <motion.div
                      variants={glowVariants}
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 blur-xl group-hover:opacity-20 transition-opacity duration-700`}
                    />
                    <div className="relative bg-gray-800/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 h-full transform transition-all duration-500 group-hover:border-gray-500/50 group-hover:bg-gray-800/60 group-hover:translate-y-[-5px] group-hover:shadow-2xl">
                      <div className="mb-5 flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br opacity-90 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 group-hover:scale-110 border border-white/10 shadow-inner p-3 text-3xl">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="relative max-w-4xl mx-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-3xl blur-xl opacity-70 transform -rotate-1"></div>
                <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md p-10 sm:p-12 rounded-3xl border border-gray-700/50 overflow-hidden">
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8, duration: 1 }}
                      className="inline-block relative"
                    >
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                        Ready to Transform
                      </span>
                      <motion.span
                        className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 1.3, duration: 0.7 }}
                      ></motion.span>
                    </motion.span>{" "}
                    Your Viewing Experience?
                  </h3>
                  <p className="text-gray-300 text-lg mb-10 text-center max-w-2xl mx-auto">
                    Join thousands enjoying premium entertainment. Our free
                    trial gives you full access to experience the difference.
                  </p>

                  {/* Error and Success Messages */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-900 bg-opacity-50 border border-red-600 text-red-200 px-4 py-3 rounded-lg mb-6"
                    >
                      {error}
                    </motion.div>
                  )}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green-900 bg-opacity-50 border border-green-600 text-green-200 px-4 py-3 rounded-lg mb-6"
                    >
                      {success}
                    </motion.div>
                  )}

                  <form onSubmit={handleTrialSubmit} className="space-y-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={trialForm.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg bg-gray-700 bg-opacity-50 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          placeholder="Enter your name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={trialForm.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg bg-gray-700 bg-opacity-50 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Phone (Optional)
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={trialForm.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg bg-gray-700 bg-opacity-50 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Plan
                        </label>
                        <select
                          name="plan"
                          value={trialForm.plan}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg bg-gray-700 bg-opacity-50 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        >
                          <option value="basic">Basic Plan</option>
                          <option value="standard">Standard Plan</option>
                          <option value="premium">Premium Plan</option>
                        </select>
                      </div>
                    </div>
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-4 px-10 rounded-full text-lg shadow-xl relative overflow-hidden group disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        <span className="relative flex items-center justify-center gap-2">
                          Start Free Trial
                          <svg
                            className="w-5 h-5 transition-transform duration-300 transform group-hover:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </span>
                      )}
                    </motion.button>
                  </form>

                  <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                    <motion.button
                      variants={ctaButtonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={handleContactRedirect}
                      className="w-full sm:w-auto bg-gray-800 border border-gray-600 text-gray-300 font-medium py-4 px-10 rounded-full text-lg shadow-lg hover:bg-gray-700 hover:text-white transition-all duration-300"
                    >
                      Contact Support
                    </motion.button>

                    <motion.button
                      variants={ctaButtonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={handlePricingRedirect}
                      className="w-full sm:w-auto bg-gray-800 border border-gray-600 text-gray-300 font-medium py-4 px-10 rounded-full text-lg shadow-lg hover:bg-gray-700 hover:text-white transition-all duration-300"
                    >
                      View Plans
                    </motion.button>
                  </div>

                  <div className="flex justify-center items-center mt-8 gap-4">
                    <div className="flex -space-x-2">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-8 h-8 rounded-full border-2 border-gray-800 bg-gradient-to-br ${
                            i === 0
                              ? "from-blue-400 to-indigo-600"
                              : i === 1
                              ? "from-purple-400 to-pink-600"
                              : i === 2
                              ? "from-teal-400 to-cyan-600"
                              : "from-amber-400 to-orange-600"
                          }`}
                        ></div>
                      ))}
                    </div>
                    <p className="text-gray-400 text-sm">
                      <span className="text-white font-medium">5,000+</span>{" "}
                      satisfied users
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex flex-wrap justify-center gap-6 mt-16 text-gray-400"
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Full feature access</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        @keyframes float-reverse {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(20px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float 20s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: float-reverse 18s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default FreeTrial;
