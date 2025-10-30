import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiMessageCircle } from "react-icons/fi";

const faqData = [
  {
    id: "q1",
    question: "What is IPTV?",
    answer:
      "IPTV (Internet Protocol Television) is a method of delivering television content over the internet instead of traditional broadcast, satellite, or cable formats. It allows you to stream live TV, movies, and series directly to your compatible devices.",
  },
  {
    id: "q2",
    question: "What devices are compatible with your service?",
    answer:
      "Our service is compatible with a wide range of devices including Smart TVs (Samsung, LG, Android TV), Android boxes and smartphones, iOS devices (iPhone, iPad), Windows and Mac computers, and streaming devices like Firestick and Roku.",
  },
  {
    id: "q3",
    question: "What internet speed do I need?",
    answer:
      "For a smooth streaming experience, we recommend a minimum internet speed of 20 Mbps for HD content and 50 Mbps or higher for Full HD and 4K content. A stable wired connection (Ethernet) is always preferred over Wi-Fi for the best performance.",
  },
  {
    id: "q4",
    question: "How do I set up the service?",
    answer:
      "Setup is easy! You generally need to install a compatible IPTV player app on your device and then load the playlist or subscription details we provide after your purchase or trial activation. We provide step-by-step tutorials for common devices in our Tutorial section.",
  },
  {
    id: "q5",
    question: "Do you offer a free trial?",
    answer:
      "Yes, we offer a free trial so you can experience our service before subscribing. Please contact us to request your free trial.",
  },
  {
    id: "q6",
    question: "How can I contact customer support?",
    answer:
      "You can contact our customer support team via email or WhatsApp. Visit our Contact Us page for details.",
  },
  {
    id: "q7",
    question: "What payment methods do you accept?",
    answer:
      "We accept various secure payment methods. Details are available during the checkout process when you subscribe.",
  },
  {
    id: "q8",
    question: "Is your service legal?",
    answer:
      "We provide access to content based on licensing agreements. Users are responsible for ensuring their usage complies with local laws and regulations.",
  },
];

const FAQ = () => {
  const [openQuestion, setOpenQuestion] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleQuestion = (id) => {
    setOpenQuestion(openQuestion === id ? null : id);
  };

  const filteredFAQs = faqData.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section
      id="faq"
      className="bg-gradient-to-b from-gray-900 to-gray-950 text-white py-16 md:py-24 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-blue-600 blur-3xl"></div>
        <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-purple-600 blur-3xl"></div>
        <div className="absolute -bottom-32 left-1/4 w-72 h-72 rounded-full bg-indigo-600 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto">
            Find quick answers to the most common questions about our IPTV
            service
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <input
              type="text"
              placeholder="Search FAQ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800/50 backdrop-blur-sm text-white rounded-full px-6 py-4 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition pl-12"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </motion.div>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group"
              >
                <div
                  className={`border border-gray-700 rounded-xl overflow-hidden bg-gray-800/30 backdrop-filter backdrop-blur-sm hover:shadow-lg hover:shadow-blue-900/20 transition duration-300 ${
                    openQuestion === item.id ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <button
                    className="flex justify-between items-center w-full p-5 text-left font-medium focus:outline-none"
                    onClick={() => toggleQuestion(item.id)}
                    aria-expanded={openQuestion === item.id}
                    aria-controls={`faq-answer-${item.id}`}
                  >
                    <span className="text-lg text-white group-hover:text-blue-400 transition duration-300">
                      {item.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openQuestion === item.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 ml-2"
                    >
                      <FiChevronDown
                        className={`w-5 h-5 ${
                          openQuestion === item.id
                            ? "text-blue-400"
                            : "text-gray-400"
                        }`}
                      />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {openQuestion === item.id && (
                      <motion.div
                        id={`faq-answer-${item.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-gray-300 border-t border-gray-700/50 pt-3">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-400 text-lg">
                No matching questions found. Try a different search term.
              </p>
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-semibold text-white mb-4">
            Still Have Questions?
          </h3>
          <p className="text-gray-300 text-lg mb-8">
            Our support team is here to help you with any inquiries.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-blue-700 hover:to-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg group"
          >
            <FiMessageCircle className="mr-2 w-6 h-6 group-hover:animate-pulse" />
            Contact Support
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
