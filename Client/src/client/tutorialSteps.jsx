import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SimpleTutorial = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    // Start with first step open
    setActiveStep(0);
  }, []);

  const steps = [
    {
      title: "Choose Your Device",
      emoji: "📱",
      color: "#4F46E5",
      description:
        "Our IPTV service is compatible with a wide range of devices.",
      devices: [
        { name: "Smart TV", icon: "📺" },
        { name: "Android", icon: "🤖" },
        { name: "iOS", icon: "🍎" },
        { name: "PC/Mac", icon: "💻" },
        { name: "Firestick", icon: "🔥" },
        { name: "Roku", icon: "📡" },
      ],
    },
    {
      title: "Install the Application",
      emoji: "⬇️",
      color: "#10B981",
      description: "Download the recommended application for your device.",
      recommendations: [
        { device: "Smart TV", app: "Smart IPTV" },
        { device: "Android", app: "IPTV Smarters Pro" },
        { device: "iOS", app: "IPTV Smarters Pro" },
        { device: "PC/Mac", app: "VLC Player" },
        { device: "Firestick", app: "IPTV Smarters Pro" },
      ],
    },
    {
      title: "Load Your Playlist",
      emoji: "🔄",
      color: "#F59E0B",
      description: "Add your playlist to your chosen application.",
      methods: [
        "M3U URL: Copy and paste the provided M3U link.",
        "API: Enter the URL, username and password.",
        "File: Download and import the M3U file.",
      ],
    },
    {
      title: "Start Watching!",
      emoji: "🎬",
      color: "#EC4899",
      description: "Enjoy your favorite channels in HD quality!",
    },
  ];

  const nextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const goToStep = (index) => {
    setActiveStep(index);
  };

  return (
    <div
      id="tutorial"
      className="bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen py-12 px-4 text-white"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4 rounded-full p-2"
            style={{
              background: "linear-gradient(to right, #4F46E5, #10B981)",
            }}
          >
            <div className="bg-gray-900 rounded-full p-3">
              <div className="text-4xl">🚀</div>
            </div>
          </motion.div>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold mb-2"
          >
            Get Started in a Few Clicks
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-300"
          >
            Simple and quick setup for your IPTV
          </motion.p>
        </div>

        {/* Step indicator */}
        <div className="mb-6 flex justify-between items-center px-2">
          {steps.map((step, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => goToStep(index)}
              className="flex flex-col items-center"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-2 transition-all duration-300 ${
                  index === activeStep
                    ? "bg-indigo-500 shadow-lg shadow-indigo-500/30"
                    : index < activeStep
                    ? "bg-indigo-600 opacity-60"
                    : "bg-gray-700 opacity-40"
                }`}
              >
                {step.emoji}
              </div>
              <span
                className={`text-xs ${
                  index === activeStep ? "text-white" : "text-gray-400"
                }`}
              >
                {index + 1}
              </span>
            </motion.button>
          ))}

          <div className="absolute left-0 right-0 flex justify-center -z-10">
            <div className="h-0.5 bg-gray-700 w-2/3 mt-6"></div>
          </div>
        </div>

        {/* Active step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gray-800 rounded-2xl p-6 mb-6 shadow-xl">
              <div className="flex items-center mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-xl mr-4"
                  style={{ backgroundColor: steps[activeStep].color }}
                >
                  {steps[activeStep].emoji}
                </div>
                <h3 className="text-xl font-bold">{steps[activeStep].title}</h3>
              </div>

              <p className="text-gray-300 mb-6">
                {steps[activeStep].description}
              </p>

              {/* Step 1 content */}
              {activeStep === 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {steps[0].devices.map((device) => (
                    <motion.div
                      key={device.name}
                      whileHover={{ y: -5, scale: 1.03 }}
                      className="bg-gray-700 bg-opacity-50 rounded-xl p-3 text-center cursor-pointer"
                    >
                      <div className="text-3xl mb-1">{device.icon}</div>
                      <div className="text-sm">{device.name}</div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Step 2 content */}
              {activeStep === 1 && (
                <div className="space-y-3">
                  {steps[1].recommendations.map((item) => (
                    <motion.div
                      key={item.device}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex justify-between items-center bg-gray-700 bg-opacity-40 rounded-lg p-3"
                    >
                      <span>{item.device}</span>
                      <span className="bg-indigo-500 bg-opacity-30 px-3 py-1 rounded-full text-sm">
                        {item.app}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Step 3 content */}
              {activeStep === 2 && (
                <div className="space-y-4">
                  <div className="bg-gray-700 bg-opacity-40 p-4 rounded-lg">
                    <div className="space-y-2">
                      {steps[2].methods.map((method, idx) => (
                        <div key={idx} className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center mr-2 text-xs">
                            {idx + 1}
                          </div>
                          <p>{method}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-900 bg-opacity-40 p-4 rounded-lg border border-gray-700 text-center">
                    <p className="text-gray-300 text-sm">
                      You will receive your playlist information by email after
                      purchase
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4 content - UPDATED with embedded video */}
              {activeStep === 3 && (
                <div className="text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto w-full mb-6 relative"
                  >
                    <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-1 rounded-xl shadow-lg shadow-indigo-500/20">
                      <div className="bg-gray-900 rounded-lg p-4">
                        <p className="text-lg mb-3 font-medium">
                          Watch our setup tutorial:
                        </p>

                        {/* Video container with responsive aspect ratio */}
                        <div
                          className="relative w-full overflow-hidden rounded-lg shadow-xl"
                          style={{ paddingBottom: "56.25%" }}
                        >
                          {/* Decorative elements */}
                          <div className="absolute -top-3 -left-3 w-16 h-16 bg-indigo-500 rounded-full opacity-20 blur-xl"></div>
                          <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-purple-500 rounded-full opacity-20 blur-lg"></div>

                          {/* Video iframe with play button overlay */}
                          <div className="absolute inset-0 bg-black rounded-lg">
                            <iframe
                              className="absolute inset-0 w-full h-full rounded-lg"
                              src="https://www.youtube.com/embed/GWJC7Z8NxzE"
                              title="IPTV Setup Tutorial"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                        </div>

                        {/* Video controls and info */}
                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                              </svg>
                            </div>
                            <span className="text-sm text-gray-300">
                              Setup IPTV Tutorial
                            </span>
                          </div>
                          <a
                            href="#contact"
                            className="text-xs text-gray-400 hover:text-white transition-colors"
                          >
                            • Need help?
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Quick tips */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <p className="text-xl font-medium mb-4">
                      Enjoy your favorite shows!
                    </p>

                    <div className="inline-block bg-indigo-500 bg-opacity-20 rounded-lg p-3">
                      <p className="text-gray-200">
                        Having trouble?{" "}
                        <a
                          href="#contact"
                          className="text-indigo-300 hover:underline"
                        >
                          Contact us
                        </a>
                      </p>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={prevStep}
            disabled={activeStep === 0}
            className={`px-5 py-2 rounded-lg flex items-center ${
              activeStep === 0
                ? "bg-gray-700 opacity-40 cursor-not-allowed"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous
          </button>

          {activeStep < steps.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextStep}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 flex items-center"
            >
              Next
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          ) : (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#pricing"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center"
            >
              Get Started
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            </motion.a>
          )}
        </div>

        {/* Simple footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleTutorial;
