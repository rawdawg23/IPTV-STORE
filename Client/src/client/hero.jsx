import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

const Hero = () => {
  const [activeDevice, setActiveDevice] = useState(0);
  const [videoMuted, setVideoMuted] = useState(true); // Start muted for better autoplay
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  // Scroll effect for the content layer
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"], // Tracks scroll from the top of the section
  });

  // Transform for parallax effect on content
  // Adjust the range [0, 300] if the parallax movement feels too much or too little
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  // Define device data
  const devices = [
    {
      name: "Smart TV",
      image:
        "https://i.pinimg.com/736x/9b/e6/82/9be6827711bb10ae3c6d9d7eca9ce1b6.jpg",
      type: "tv",
    },
    {
      name: "Tablet",
      image:
        "https://i.pinimg.com/736x/07/4a/40/074a40e6d886ea2d9268ef2b377c887b.jpg",
      type: "tablet",
    },
    {
      name: "Smartphone",
      image:
        "https://i.pinimg.com/736x/95/41/f8/9541f8d77fa2b02fccb8280753024925.jpg",
      type: "phone",
    },
    {
      name: "Laptop",
      image:
        "https://i.pinimg.com/736x/e3/f1/09/e3f109b357780f11e67f138925884984.jpg",
      type: "laptop",
    },
  ];

  // Auto-rotate devices
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDevice((prev) => (prev + 1) % devices.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [devices.length]);

  // Play video when component mounts and handle mute state
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.muted = videoMuted;
      // Using play() directly might be prevented by browsers.
      // The playsInline attribute helps for mobile.
      videoElement.play().catch((err) => {
        console.error("Video autoplay prevented:", err);
        // You might want to show a play button if autoplay fails
      });
    }
  }, [videoMuted]); // Re-run if videoMuted state changes

  const toggleMute = () => {
    setVideoMuted((prev) => !prev);
  };

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const featureVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  const trustedBrands = [
    {
      name: "Netflix",
      logo: "M 0 0 L 0 40 L 10 40 L 10 0 L 0 0 Z M 20 0 L 20 40 L 30 40 L 30 0 L 20 0 Z M 5 10 L 5 30 L 25 20 L 5 10 Z",
      color: "#E50914",
    },
    {
      name: "Disney",
      logo: "M25.7,10.2c-1.4-1.2-3.2-2.1-5.1-2.7c-2-0.6-4-0.9-6.1-0.9c-2.1,0-4.1,0.3-6.1,0.9c-1.9,0.6-3.7,1.5-5.1,2.7c-1.5,1.2-2.6,2.7-3.5,4.4c-0.8,1.7-1.3,3.5-1.3,5.4c0,1.9,0.4,3.7,1.3,5.4c0.8,1.7,2,3.2,3.5,4.4c1.4,1.2,3.2,2.1,5.1,2.7c2,0.6,4,0.9,6.1,0.9c2.1,0,4.1-0.3,6.1-0.9c1.9-0.6,3.7-1.5,5.1-2.7c1.5,1.2,2.6-2.7,3.5-4.4c0.8-1.7,1.3-3.5,1.3-5.4c0-1.9-0.4-3.7-1.3-5.4C28.4,12.9,27.2,11.4,25.7,10.2z M14.5,25.5c-3,0-5.5-2.5-5.5-5.5s2.5-5.5,5.5-5.5s5.5,2.5,5.5,5.5S17.5,25.5,14.5,25.5z",
      color: "#0063e5",
    },
    {
      name: "Prime",
      logo: "M28.2,20.2l-5-2.9v5.8L28.2,20.2z M3.8,20.2l5-2.9v5.8L3.8,20.2z M16,7l10,5.8v11.7L16,18.7L6,24.5V12.8L16,7z",
      color: "#00A8E1",
    },
    {
      name: "HBO",
      logo: "M6,16c0-5.5,4.5-10,10-10s10,4.5,10,10s-4.5,10-10,10S6,21.5,6,16z M10,13v6h2v-6H10z M14,13v6h2v-6H14z M18,13v6h2v-6H18z",
      color: "#5822b4",
    },
  ];

  const features = [
    {
      icon: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
      text: "HD & 4K Quality",
      color: "yellow",
    },
    {
      icon: "M21 6h-7.59l3.29-3.29L16 2l-4 4-4-4-.71.71L10.59 6H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 14H3V8h18v12zM9 10v8l7-4z",
      text: "Vast Channel Library",
      color: "red",
    },
    {
      icon: "M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z",
      text: "Movies & Series",
      color: "purple",
    },
    {
      icon: "M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z",
      text: "Always Reliable",
      color: "teal",
    },
  ];

  return (
    <section
      ref={containerRef}
      id="home"
      className="bg-black text-white relative overflow-hidden min-h-screen flex flex-col"
    >
      {/* Full-screen background video container */}
      {/* Ensure this container always covers the full section */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          // Use w-full h-full object-cover to ensure video covers the container
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted={videoMuted}
          playsInline // Important for mobile autoplay
        >
          {/* Ensure the video source path is correct */}
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 z-10"></div>
      </div>

      {/* Content Layer */}
      {/* This layer moves with the scroll effect */}
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 flex-grow flex flex-col justify-center py-16 md:py-24"
        style={{ opacity, y }} // Apply opacity and y transform here
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          {/* Left Section: Text Content & CTAs */}
          <motion.div
            className="text-center lg:text-left lg:w-1/2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="inline-block">Unlock </span>
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                Unlimited
              </span>
              <span className="inline-block"> Entertainment</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Stream thousands of live channels, movies, and series in stunning
              HD and 4K quality, on any device.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
            >
              <motion.a
                href="#free-trial"
                className="relative overflow-hidden group bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium py-4 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-green-500/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">Get Your Free Trial</span>
                <span className="absolute inset-0 w-full h-full bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></span>
              </motion.a>

              <motion.a
                href="#pricing"
                className="relative group py-4 px-8 bg-transparent rounded-xl text-white font-medium transition-all duration-300 overflow-hidden border border-white/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 group-hover:text-black transition-colors duration-300">
                  View Pricing Plans
                </span>
                <span className="absolute inset-0 w-full h-full bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></span>
              </motion.a>

              <motion.button
                className="bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMute}
                aria-label={videoMuted ? "Unmute video" : "Mute video"}
              >
                {videoMuted ? (
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                )}
              </motion.button>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-12 space-y-4">
              <span className="text-gray-400 text-sm block text-center lg:text-left">
                Trusted by major streaming services
              </span>
              <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                {trustedBrands.map((brand, i) => (
                  <motion.div
                    key={i}
                    className="relative h-10 w-10 flex items-center justify-center"
                    whileHover={{ scale: 1.2, y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: i * 0.1 + 0.5 },
                    }}
                  >
                    <svg viewBox="0 0 32 32" className="w-full h-full">
                      <path d={brand.logo} fill={brand.color} />
                    </svg>
                    <motion.div
                      className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      {brand.name}
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Section: Interactive Devices Showcase */}
          {/* Adjusted height to be more flexible while maintaining aspect ratio feel */}
          <motion.div
            className="lg:w-1/2 flex flex-col items-center justify-center relative w-full max-w-sm sm:max-w-md mx-auto"
            // Removed fixed height here, let the device mockups determine height
          >
            <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {devices.map(
                  (device, i) =>
                    activeDevice === i && (
                      <motion.div
                        key={device.name} // Key for AnimatePresence to detect changes
                        className="absolute inset-0 flex items-center justify-center" // Ensures the motion.div fills the parent for positioning
                        initial={{ opacity: 0, rotateY: -90 }}
                        animate={{
                          opacity: 1,
                          rotateY: 0,
                          transition: {
                            type: "spring",
                            stiffness: 70, // As per your requirement
                            damping: 20,
                          },
                        }}
                        exit={{
                          opacity: 0,
                          rotateY: 90,
                          transition: {
                            duration: 0.3,
                          },
                        }}
                      >
                        <div className="relative">
                          {/* Device Frame Rendered Here (existing logic) */}
                          {device.type === "tv" && (
                            <div className="w-full max-w-md aspect-video bg-gray-800 rounded-lg overflow-hidden relative shadow-xl shadow-blue-500/20 border-4 border-gray-700">
                              <img
                                src={device.image}
                                alt="TV screen"
                                className="w-full h-full object-cover" // Ensure image covers its container
                              />
                              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-70 pointer-events-none"></div>
                              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-gray-700 rounded-t-md"></div>
                              <div className="absolute inset-0 flex flex-col">
                                <div className="flex-1"></div>
                                <div className="p-4 bg-gradient-to-t from-black/80 to-transparent">
                                  <div className="w-3/4 h-2 bg-white/30 rounded-full mb-2"></div>
                                  <div className="w-1/2 h-2 bg-white/20 rounded-full"></div>
                                </div>
                              </div>
                            </div>
                          )}
                          {device.type === "tablet" && (
                            <div className="w-full max-w-sm aspect-[4/3] bg-gray-800 rounded-2xl overflow-hidden relative shadow-xl shadow-blue-500/20 border-4 border-gray-700">
                              <img
                                src={device.image}
                                alt="Tablet screen"
                                className="w-full h-full object-cover" // Ensure image covers its container
                              />
                              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-70 pointer-events-none"></div>
                              <div className="absolute top-1/2 right-1 w-2 h-10 bg-gray-700 rounded-full transform -translate-y-1/2"></div>
                              <div className="absolute inset-0 flex flex-col">
                                <div className="h-6 bg-black/20 flex items-center justify-center">
                                  <div className="w-4 h-4 bg-black border border-gray-700 rounded-full"></div>
                                </div>
                                <div className="flex-1"></div>
                                <div className="p-4 bg-gradient-to-t from-black/80 to-transparent">
                                  <div className="w-3/4 h-2 bg-white/30 rounded-full mb-2"></div>
                                  <div className="w-1/2 h-2 bg-white/20 rounded-full"></div>
                                </div>
                              </div>
                            </div>
                          )}
                          {device.type === "phone" && (
                            <div className="w-64 aspect-[9/16] bg-gray-800 rounded-3xl overflow-hidden relative shadow-xl shadow-blue-500/20 border-4 border-gray-700">
                              <img
                                src={device.image}
                                alt="Phone screen"
                                className="w-full h-full object-cover" // Ensure image covers its container
                              />
                              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-70 pointer-events-none"></div>
                              <div className="absolute inset-0 flex flex-col">
                                <div className="h-6 bg-black/20 flex items-center justify-between px-4">
                                  <div className="w-16 h-1 bg-white/50 rounded-full"></div>
                                  <div className="w-4 h-2 bg-white/50 rounded-full"></div>
                                </div>
                                <div className="flex-1"></div>
                                <div className="p-4 bg-gradient-to-t from-black/80 to-transparent">
                                  <div className="w-3/4 h-2 bg-white/30 rounded-full mb-2"></div>
                                  <div className="w-1/2 h-2 bg-white/20 rounded-full"></div>
                                </div>
                              </div>
                              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-black rounded-b-xl z-10 flex justify-center items-center">
                                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                                <div className="w-3 h-3 bg-black border border-gray-700 rounded-full"></div>
                              </div>
                            </div>
                          )}
                          {device.type === "laptop" && (
                            <div className="relative">
                              <div className="w-full max-w-md aspect-[16/10] bg-gray-800 rounded-t-lg overflow-hidden relative shadow-xl shadow-blue-500/20 border-4 border-t-gray-700 border-l-gray-700 border-r-gray-700 border-b-0">
                                <img
                                  src={device.image}
                                  alt="Laptop screen"
                                  className="w-full h-full object-cover" // Ensure image covers its container
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-70 pointer-events-none"></div>
                                <div className="absolute inset-0 flex flex-col">
                                  <div className="h-6 bg-black/20 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-black rounded-full"></div>
                                  </div>
                                  <div className="flex-1"></div>
                                  <div className="p-4 bg-gradient-to-t from-black/80 to-transparent">
                                    <div className="w-3/4 h-2 bg-white/30 rounded-full mb-2"></div>
                                    <div className="w-1/2 h-2 bg-white/20 rounded-full"></div>
                                  </div>
                                </div>
                              </div>
                              <div className="w-full max-w-md h-4 bg-gray-700 rounded-b-lg"></div>
                            </div>
                          )}
                          {/* Glow effect (z-index -10) */}
                          <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl -z-10"></div>
                          {/* Device Name Overlay */}
                          <motion.div
                            className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none p-4 text-center"
                            initial={{ opacity: 0, y: 25, scale: 0.7 }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              scale: 1,
                              transition: {
                                type: "spring",
                                stiffness: 100,
                                damping: 12,
                                delay: 0.15,
                              },
                            }}
                            exit={{
                              opacity: 0,
                              y: -25,
                              scale: 0.7,
                              transition: { duration: 0.25 },
                            }}
                          >
                            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white/70 [text-shadow:_0_2px_6px_rgba(0,0,0,0.7)] leading-tight">
                              {device.name}
                            </h3>
                          </motion.div>
                        </div>
                      </motion.div>
                    )
                )}
              </AnimatePresence>
              {/* Device selector dots */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3 mt-6 z-30">
                {devices.map((_, index) => (
                  <motion.button
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      activeDevice === index ? "bg-blue-500" : "bg-gray-600"
                    }`}
                    onClick={() => setActiveDevice(index)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    initial={false}
                    animate={
                      activeDevice === index
                        ? {
                            scale: [1, 1.2, 1],
                            transition: {
                              duration: 0.5,
                              repeat: Infinity,
                              repeatDelay: 1,
                            },
                          }
                        : {}
                    }
                    aria-label={`Show ${devices[index].name}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature Highlights */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8 text-center mt-16 md:mt-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={featureVariants}
              className="flex flex-col items-center group"
              whileHover={{ scale: 1.05 }}
            >
              <div
                className={`
                w-12 h-12 rounded-xl flex items-center justify-center mb-3
                bg-gradient-to-br
                ${
                  feature.color === "yellow"
                    ? "from-yellow-400 to-amber-600"
                    : feature.color === "red"
                    ? "from-red-400 to-rose-600"
                    : feature.color === "purple"
                    ? "from-purple-400 to-violet-600"
                    : feature.color === "teal"
                    ? "from-teal-400 to-emerald-600"
                    : ""
                }
                shadow-lg
                ${
                  feature.color === "yellow"
                    ? "shadow-yellow-400/20"
                    : feature.color === "red"
                    ? "shadow-red-400/20"
                    : feature.color === "purple"
                    ? "shadow-purple-400/20"
                    : feature.color === "teal"
                    ? "shadow-teal-400/20"
                    : ""
                }
                group-hover:shadow-xl transition-all duration-300
                ${
                  feature.color === "yellow"
                    ? "group-hover:shadow-yellow-400/30"
                    : feature.color === "red"
                    ? "group-hover:shadow-red-400/30"
                    : feature.color === "purple"
                    ? "group-hover:shadow-purple-400/30"
                    : feature.color === "teal"
                    ? "group-hover:shadow-teal-400/30"
                    : ""
                }
              `}
              >
                <svg
                  className="w-6 h-6 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d={feature.icon} />
                </svg>
              </div>
              <p className="text-gray-300 font-medium">{feature.text}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: [0.5, 1, 0.5],
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          <svg
            className="w-6 h-6 text-white/70"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
