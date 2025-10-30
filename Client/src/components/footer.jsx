import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const socialIcons = [
    {
      name: "Facebook",
      icon: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z",
      color: "hover:text-blue-500",
    },
    {
      name: "Twitter",
      icon: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
      color: "hover:text-blue-400",
    },
    {
      name: "Instagram",
      icon: "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z",
      color: "hover:text-pink-500",
    },
    {
      name: "YouTube",
      icon: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
      color: "hover:text-red-600",
    },
  ];

  const quickLinks = [
    { name: "Live Channels", href: "#channels" },
    { name: "Movies & Series", href: "#movies" },
    { name: "Sports", href: "#sports" },
    { name: "Pricing", href: "#pricing" },
  ];

  const supportLinks = [
    { name: "FAQs", href: "#faq" },
    { name: "Contact Us", href: "#contact" },
    { name: "Terms of Service", href: "#terms" },
    { name: "Privacy Policy", href: "#privacy" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-300 py-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-600/10 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-40 -right-20 w-80 h-80 bg-purple-600/10 rounded-full filter blur-3xl"></div>
        </div>
        <div className="wave-pattern absolute inset-0 opacity-5"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div variants={itemVariants} className="text-left">
            <h3 className="text-xl font-bold mb-6 text-white border-b border-blue-500/30 pb-2 inline-block">
              About Our IPTV Service
            </h3>
            <p className="text-gray-400 mb-6">
              We provide high-quality IPTV streaming with a wide range of
              channels and on-demand content. Enjoy your favorite shows, movies,
              and sports with crystal-clear picture.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-6 text-white border-b border-blue-500/30 pb-2 inline-block">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="hover:text-blue-400 transition-colors duration-200 block group flex items-center"
                  >
                    <span className="inline-block w-1 h-1 bg-blue-500 rounded-full mr-2 group-hover:w-2 transition-all duration-300"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-6 text-white border-b border-blue-500/30 pb-2 inline-block">
              Support
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="hover:text-blue-400 transition-colors duration-200 block group flex items-center"
                  >
                    <span className="inline-block w-1 h-1 bg-blue-500 rounded-full mr-2 group-hover:w-2 transition-all duration-300"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-6 text-white border-b border-blue-500/30 pb-2 inline-block">
              Connect With Us
            </h3>
            <div className="flex space-x-4">
              {socialIcons.map((platform, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className={`text-gray-400 ${platform.color} transition-all duration-300`}
                  aria-label={platform.name}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d={platform.icon} />
                  </svg>
                </motion.a>
              ))}
            </div>

            <div className="mt-8">
              <h4 className="text-sm font-medium text-gray-400 mb-3">
                Subscribe to our newsletter
              </h4>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-gray-800/50 border border-gray-700 rounded-l-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-200 w-full"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-md transition duration-300">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-16 pt-8 border-t border-gray-800/50 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400">
            &copy; {currentYear} Your IPTV Service. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Enjoy a premium streaming experience.
          </p>
        </motion.div>
      </div>

      <style jsx>{`
        .wave-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264.888-.14 1.24.19 1.64.39 1.84.39.194 0 .58-.2 1.82-.39.17-.124.53-.26.887-.14 1.24.19 1.64.39 1.84.39.194 0 .58-.2 1.82-.39.17-.124.53-.26.887-.14 1.24.19 1.64.39 1.84.39.194 0 .58-.2 1.82-.39.17-.124.53-.26.887-.14 1.24.19 1.64.39 1.84.39.194 0 .58-.2 1.82-.39.17-.124.53-.26.887-.14 1.24.19 1.64.39 1.84.39.194 0 .58-.2 1.82-.39.17-.124.53-.26.887-.14 1.24.19 1.64.39 1.84.39.194 0 .58-.2 1.82-.39.17-.124.53-.26.887-.14 1.24.19 1.64.39 1.84.39.194 0 .58-.2 1.82-.39.17-.124.53-.26.887-.14 1.24.19 1.64.39 1.84.39.194 0 .58-.2 1.82-.39.17-.124.53-.26.887-.14 1.24.19 1.64.39 1.84.39.194 0 .58-.2 1.82-.39.17-.124.53-.26.887-.14 1.24.19 1.64.39 1.84.39.194 0 .58-.2 1.82-.39.17-.124.53-.26.887-.14 1.24.19 1.64.39 1.84.39.194 0 .58-.2 1.82-.39.17-.124.53-.26.887-.14 1.24.19 1.64.39 1.84.39.194 0 .58-.2 1.82-.39.17-.124.53-.26.887-.14 1.24.19 1.64.39 1.84.39' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
          animation: wave 30s linear infinite;
          background-size: 400px 100%;
        }

        @keyframes wave {
          0% {
            background-position: 0% 0;
          }
          100% {
            background-position: 400% 0;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
