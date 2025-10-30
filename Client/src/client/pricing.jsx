import React, { useState, useEffect } from "react";
import api from "../api";

// Floating animation component
const FloatingElement = ({ children, delay = 0, duration = 4 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-1000 ${
        isVisible
          ? "opacity-100 transform translate-y-0"
          : "opacity-0 transform translate-y-4"
      }`}
      style={{ animationDuration: `${duration}s` }}
    >
      {children}
    </div>
  );
};

// Features list component
const FeaturesList = ({ features }) => (
  <ul className="space-y-3 mb-8">
    {features.map((feature, index) => (
      <FloatingElement key={index} delay={index * 0.1}>
        <li className="flex items-center text-gray-300">
          <svg
            className="w-5 h-5 text-green-400 mr-3 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          {feature}
        </li>
      </FloatingElement>
    ))}
  </ul>
);

// Price tag component
const PriceTag = ({ price, isPopular }) => (
  <div className="mb-6">
    <FloatingElement delay={0.5}>
      <div className="text-center">
        <span className="text-4xl font-bold text-white">${price}</span>
        <span className="text-gray-400 ml-2">/month</span>
        {isPopular && (
          <div className="mt-2">
            <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              Most Popular
            </span>
          </div>
        )}
      </div>
    </FloatingElement>
  </div>
);

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [activePlan, setActivePlan] = useState(null);
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [pricingPlans, setPricingPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Add default pricing plans in case API fails
  const defaultPlans = [
    {
      _id: "default1",
      plan: "basic",
      name: "Basic",
      description: "Perfect for casual viewers",
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      features: {
        channels: 100,
        quality: "HD",
        connections: 1,
        vodLibrary: false,
        premiumSports: false
      },
      isPopular: false
    },
    {
      _id: "default2",
      plan: "standard",
      name: "Standard",
      description: "Great for families",
      monthlyPrice: 19.99,
      yearlyPrice: 199.99,
      features: {
        channels: 500,
        quality: "FHD",
        connections: 3,
        vodLibrary: true,
        premiumSports: false
      },
      isPopular: true
    },
    {
      _id: "default3",
      plan: "premium",
      name: "Premium",
      description: "Ultimate entertainment package",
      monthlyPrice: 29.99,
      yearlyPrice: 299.99,
      features: {
        channels: 1000,
        quality: "4K",
        connections: 5,
        vodLibrary: true,
        premiumSports: true
      },
      isPopular: false
    }
  ];

  // Fetch pricing plans from database
  useEffect(() => {
    const fetchPricingPlans = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/pricing");
        if (response.data.success) {
          setPricingPlans(response.data.plans);
          console.log("Pricing plans loaded:", response.data.plans);
        } else {
          // Handle case where success is false but no error was thrown
          setError("Failed to load pricing plans: " + (response.data.error || "Unknown error"));
          console.error("API returned success:false", response.data);
        }
      } catch (error) {
        console.error("Error fetching pricing plans:", error);
        setError("Failed to load pricing plans: " + (error.response?.data?.error || error.message || "Network error"));
      } finally {
        setLoading(false);
      }
    };

    fetchPricingPlans();
  }, []);

  // Calculate discount percentage for yearly plans
  const getYearlySavings = () => {
    if (pricingPlans.length === 0) return "20%";
    const plan = pricingPlans[0];
    const monthlyTotal = plan.monthlyPrice * 12;
    const savings = monthlyTotal - plan.yearlyPrice;
    return Math.round((savings / monthlyTotal) * 100) + "%";
  };

  // Get current price based on billing cycle
  const getCurrentPrice = (plan) => {
    if (billingCycle === "monthly") {
      return plan.monthlyPrice || 9.99; // Default to 9.99 if undefined
    } else {
      return plan.yearlyPrice || 99.99; // Default to 99.99 if undefined
    }
  };

  // Get features list for a plan
  const getFeaturesList = (plan) => {
    const features = [];
    
    // Handle potential undefined values with fallbacks
    const channels = plan.features?.channels || 100;
    const quality = plan.features?.quality || "HD";
    const connections = plan.features?.connections || 1;
    
    features.push(`Access to ${channels}+ channels`);
    features.push(`${quality} quality`);
    features.push(
      `${connections} connection${connections > 1 ? "s" : ""}`
    );

    if (plan.features?.vodLibrary) {
      features.push("VOD Library");
    }

    if (plan.features?.premiumSports) {
      features.push("Premium Sports Channels");
    }

    features.push("24/7 Support");
    return features;
  };

  // Get gradient class based on plan
  const getGradientClass = (plan) => {
    const gradients = {
      basic: "from-purple-900 to-indigo-900",
      standard: "from-blue-900 to-cyan-900",
      premium: "from-teal-900 to-emerald-900",
    };
    return gradients[plan.plan] || "from-gray-900 to-gray-800";
  };

  // Get icon based on plan
  const getIcon = (plan) => {
    const icons = {
      basic: "📺",
      standard: "🔥",
      premium: "⭐",
    };
    return icons[plan.plan] || "📺";
  };

  // Handle plan selection
  const handleSelectPlan = async (plan) => {
    setActivePlan(plan.name);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // Redirect to login if not authenticated
        window.location.href = "/client";
        return;
      }

      // Set auth header
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Create subscription
      const response = await api.post("/api/subscriptions", {
        plan: plan.plan,
        billingCycle,
        paymentMethod: "Credit Card", // This would be handled by payment gateway
      });

      if (response.data.success) {
        alert("Subscription created successfully!");
        // Redirect to profile or dashboard
        window.location.href = "/profile";
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert(error.response?.data?.error || "Failed to create subscription");
    }
  };

  // Background decorative elements
  const BackgroundDecoration = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-10 left-1/2 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
    </div>
  );

  // Use default plans if API fails and no plans are loaded
  useEffect(() => {
    if (!loading && (pricingPlans.length === 0 || pricingPlans.length < 3)) {
      console.log("Using default pricing plans as fallback");
      setPricingPlans(defaultPlans);
      setError(""); // Clear error since we're using fallback data
    }
  }, [loading, error, defaultPlans, pricingPlans.length]);

  return (
    <section
      id="pricing"
      className="py-20 relative bg-gray-950 overflow-hidden"
    >
      <BackgroundDecoration />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Choose Your <span className="text-blue-400">Perfect</span> Plan
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            All plans include our reliable service and dedicated 24/7 support
            team.
          </p>

          {/* Billing toggle */}
          <div className="mt-10 mb-16 inline-flex items-center bg-gray-900 p-1 rounded-full border border-gray-800">
            <button
              className={`py-2 px-6 rounded-full transition-all duration-300 ${
                billingCycle === "monthly"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </button>
            <button
              className={`py-2 px-6 rounded-full transition-all duration-300 ${
                billingCycle === "yearly"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setBillingCycle("yearly")}
            >
              Yearly{" "}
              <span className="text-xs font-semibold">
                SAVE {getYearlySavings()}
              </span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading pricing plans...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <div
                key={plan.plan}
                className={`
                  relative overflow-hidden rounded-2xl border border-gray-800
                  transition-all duration-500 transform
                  ${hoveredPlan === plan.name ? "scale-105" : "scale-100"}
                  ${activePlan === plan.name ? "ring-2 ring-blue-400" : ""}
                  ${plan.isPopular ? "md:-mt-4 md:mb-4" : ""}
                `}
                onMouseEnter={() => setHoveredPlan(plan.name)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                <div
                  className={`h-full flex flex-col bg-gradient-to-br ${getGradientClass(
                    plan
                  )} p-1`}
                >
                  <div className="flex-grow flex flex-col bg-gray-900 rounded-xl p-6">
                    {/* Popular tag */}
                    {plan.isPopular && (
                      <div className="absolute -right-12 top-7 bg-blue-600 text-white px-12 py-1 rotate-45 text-sm font-semibold">
                        Most Popular
                      </div>
                    )}

                    {/* Plan header */}
                    <div className="flex items-center mb-6">
                      <FloatingElement delay={Math.random()}>
                        <span className="text-3xl mr-3">{getIcon(plan)}</span>
                      </FloatingElement>
                      <h3 className="text-2xl font-bold text-white">
                        {plan.name}
                      </h3>
                    </div>

                    {/* Price */}
                    <PriceTag
                      price={getCurrentPrice(plan)}
                      isPopular={plan.isPopular}
                    />

                    {/* Features */}
                    <FeaturesList features={getFeaturesList(plan)} />

                    {/* CTA Button */}
                    <button
                      className={`
                        w-full py-3 px-4 rounded-xl font-medium transition-all duration-300
                        ${
                          plan.isPopular
                            ? "bg-blue-600 hover:bg-blue-500 text-white transform hover:-translate-y-1"
                            : "bg-gray-800 hover:bg-gray-700 text-gray-100 transform hover:-translate-y-1"
                        }
                      `}
                      onClick={() => handleSelectPlan(plan)}
                    >
                      Select {plan.name}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Additional info */}
        <div className="text-center mt-12 text-gray-400">
          <p>
            All plans come with a 30-day money-back guarantee. No contracts,
            cancel anytime.
          </p>
        </div>
      </div>

      {/* Add CSS animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blob {
          0% {
            transform: scale(1);
          }
          33% {
            transform: scale(1.1);
          }
          66% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default Pricing;
