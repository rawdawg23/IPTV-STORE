import React, { useState, useEffect, useRef } from "react";
import {
  Eye,
  EyeOff,
  Github,
  Twitter,
  Mail,
  Facebook,
  ArrowRight,
  Lock,
  User,
  Fingerprint,
  Sparkles,
} from "lucide-react";
import "./client.css";
import api from "../api";
import { isFirebaseConfigured, signInWithGoogle } from "../firebase";

const Client = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const formRef = useRef(null);
  const blobRef = useRef(null);

  // Animation for tab switching
  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsAnimating(false);
    }, 500);
  };

  // Form handling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      if (activeTab === "register") {
        // Registration
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          return;
        }

        const response = await api.post("/api/auth/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        if (response.data.success) {
          setSuccess("Registration successful! You can now login.");
          // Store token
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));

          // Reset form
          setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          });

          // Switch to login tab after successful registration
          setTimeout(() => {
            setActiveTab("login");
            setSuccess("");
          }, 2000);
        }
      } else {
        // Login
        const response = await api.post("/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        if (response.data.success) {
          setSuccess("Login successful!");
          // Store token and user data
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));

          // Redirect to profile or dashboard
          setTimeout(() => {
            window.location.href = "/profile";
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      setError(
        error.response?.data?.error ||
          (activeTab === "register" ? "Registration failed" : "Login failed")
      );
} finally {
    setIsSubmitting(false);
  }
  };

  const handleGoogleSignIn = async () => {
    if (!isFirebaseConfigured()) {
      setError("Google sign-in is not configured. Add Firebase env vars.");
      return;
    }
    setError("");
    setSuccess("");
    setIsSubmitting(true);
    try {
      const idToken = await signInWithGoogle();
      const response = await api.post("/api/auth/firebase", { idToken });
      if (response.data.success) {
        setSuccess("Signed in with Google!");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setTimeout(() => {
          window.location.href = "/profile";
        }, 800);
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError(err.response?.data?.error || err.message || "Google sign-in failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3D effect with mouse position
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (formRef.current) {
        const rect = formRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Normalize mouse position to be between -1 and 1
        const normalizedX = (x / rect.width - 0.5) * 2;
        const normalizedY = (y / rect.height - 0.5) * 2;

        setMousePosition({
          x: normalizedX,
          y: normalizedY,
        });

        // Animate blob with mouse
        if (blobRef.current) {
          // Adjust blob movement sensitivity
          const blobX = 50 + normalizedX * 15; // Increased sensitivity
          const blobY = 50 + normalizedY * 15; // Increased sensitivity
          blobRef.current.style.transform = `translate(${blobX}%, ${blobY}%)`;
        }
      }
    };

    // Add event listener only if formRef is available
    const currentFormRef = formRef.current;
    if (currentFormRef) {
      currentFormRef.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      // Clean up event listener
      if (currentFormRef) {
        currentFormRef.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [mousePosition]); // Added mousePosition to dependency array to update blob position correctly

  // Floating particles animation
  const ParticleAnimation = () => {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-indigo-500/10"
            style={{
              width: `${Math.random() * 15 + 5}px`,
              height: `${Math.random() * 15 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${
                Math.random() * 10 + 10
              }s linear infinite, pulse ${
                Math.random() * 5 + 2
              }s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    );
  };

  // Social login button component
  const SocialButton = ({ icon: Icon, delay }) => {
    return (
      <button
        className="relative flex justify-center items-center py-3 px-4 bg-white/80 backdrop-blur-sm hover:bg-white rounded-xl transition-all duration-300 group border border-slate-200/50 overflow-hidden w-full" // Made button full width on small screens
        style={{
          animationDelay: `${delay}ms`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/0 to-violet-500/0 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
        <Icon size={20} className="text-slate-700 relative z-10" />
        <div className="absolute -inset-2 bg-violet-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-150" />
      </button>
    );
  };

  return (
    <div className="client-container min-h-screen flex items-center justify-center p-4 md:p-8">
      {" "}
      {/* Added padding and centering */}
      <div className="w-full max-w-4xl relative">
        {/* Background gradients */}
        <div className="absolute -z-10 inset-0 overflow-hidden rounded-3xl">
          <div className="absolute top-0 left-1/3 w-48 h-48 md:w-64 md:h-64 bg-indigo-300/30 rounded-full blur-3xl" />{" "}
          {/* Adjusted size */}
          <div className="absolute bottom-0 right-1/4 w-48 h-48 md:w-64 md:h-64 bg-violet-400/20 rounded-full blur-3xl" />{" "}
          {/* Adjusted size */}
          <div className="absolute top-1/2 right-0 w-48 h-48 md:w-64 md:h-64 bg-fuchsia-300/20 rounded-full blur-3xl" />{" "}
          {/* Adjusted size */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-3xl overflow-hidden bg-white/70 backdrop-blur-xl border border-white/50">
          {/* Left Panel */}
          <div className="relative custom-welcome-bg p-8 md:p-10 flex flex-col justify-between overflow-hidden">
            {" "}
            {/* Adjusted padding */}
            {/* Dynamic blob animation */}
            <div className="absolute inset-0">
              <div className="absolute w-2/3 h-2/3 md:w-3/4 md:h-3/4 bg-indigo-400/30 rounded-full filter blur-3xl animate-blob" />{" "}
              {/* Adjusted size */}
              <div
                ref={blobRef}
                className="absolute top-1/2 left-1/2 w-64 h-64 md:w-96 md:h-96 bg-violet-500/30 rounded-full filter blur-3xl" // Adjusted size
                style={{
                  transform: "translate(50%, 50%)",
                  transition:
                    "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              />
            </div>
            <ParticleAnimation />
            {/* Content */}
            <div className="relative z-10 text-center md:text-left">
              {" "}
              {/* Center text on small screens */}
              <div
                className="flex items-center justify-center md:justify-start space-x-2 mb-2 opacity-0 animate-fadeSlideUp" // Center on small screens
                style={{
                  animationDelay: "200ms",
                  animationFillMode: "forwards",
                }}
              >
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Fingerprint size={18} className="text-white" />
                </div>
                <h2 className="text-white/80 font-medium">Pulse Auth</h2>
              </div>
              <h1
                className="text-3xl md:text-4xl font-bold text-white mb-4 opacity-0 animate-fadeSlideUp" // Adjusted font size
                style={{
                  animationDelay: "300ms",
                  animationFillMode: "forwards",
                }}
              >
                {activeTab === "login" ? "Welcome Back!" : "Join Pulse"}
              </h1>
              {/* <p
                className="text-white/80 mb-6 text-sm md:text-base opacity-0 animate-fadeSlideUp" // Adjusted font size
                style={{
                  animationDelay: "400ms",
                  animationFillMode: "forwards",
                }}
              >
                {activeTab === "login"
                  ? "Sign in with biometric verification or traditional methods to access your secured dashboard."
                  : "Create your account with our advanced security system and enjoy personalized experiences."}
              </p> */}
              {/* <div
                className="mt-6 opacity-0 animate-fadeSlideUp flex justify-center md:justify-start" // Center button on small screens
                style={{
                  animationDelay: "500ms",
                  animationFillMode: "forwards",
                }}
              > */}
              {/* <button className="group flex items-center space-x-2 py-2 px-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300"> */}
              {/* <div className="flex items-center justify-center md:justify-start mt-6 opacity-0 animate-fadeSlideUp"
                style={{
                  animationDelay: "500ms",
                  animationFillMode: "forwards",
                }}
              >
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-indigo-500 transition-colors duration-300">
                  <Fingerprint size={16} className="text-white" />
                </div>
                <span className="text-white/90 text-sm font-medium ml-2">
                  {activeTab === "login"
                    ? "Use Biometric Login"
                    : "Enable Biometric"}
                </span>
              </div> */}
              {/* </button> */}
            </div>
            <div
              className="relative z-10 opacity-0 animate-fadeSlideUp text-center md:text-left mt-8 md:mt-0" // Center text on small screens and adjust margin
              style={{ animationDelay: "600ms", animationFillMode: "forwards" }}
            >
              <div className="flex flex-col space-y-2">
                <p className="text-white/70 text-sm">
                  Trusted by major tech leaders
                </p>
                <div className="flex space-x-3 justify-center md:justify-start">
                  {" "}
                  {/* Center icons on small screens */}
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-300 cursor-pointer">
                    <Github size={20} className="text-white/80" />
                  </div>
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-300 cursor-pointer">
                    <Twitter size={20} className="text-white/80" />
                  </div>
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-300 cursor-pointer">
                    <Facebook size={20} className="text-white/80" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div
            ref={formRef}
            className="bg-white/80 backdrop-blur-md p-8 md:p-10 relative" // Adjusted padding
            style={{
              transform: `perspective(2000px) rotateX(${
                mousePosition.y * 3
              }deg) rotateY(${mousePosition.x * 3}deg)`,
              transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <div className="relative z-10">
              {/* Tabs */}
              <div
                className="inline-flex p-1 bg-slate-100/70 backdrop-blur-sm rounded-xl mb-8 opacity-0 animate-fadeIn w-full justify-center md:w-auto md:justify-start" // Made tabs full width and centered on small screens
                style={{
                  animationDelay: "300ms",
                  animationFillMode: "forwards",
                }}
              >
                <button
                  onClick={() => handleTabChange("login")}
                  className={`relative py-2 px-4 md:px-6 rounded-lg text-sm font-medium transition-all duration-300 overflow-hidden flex-1 text-center ${
                    // Made buttons flexible and centered text
                    activeTab === "login"
                      ? "bg-white text-indigo-600 shadow-md"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {activeTab === "login" && (
                    <div className="absolute inset-0 bg-indigo-50 animate-pulseLight" />
                  )}
                  <span className="relative z-10">Sign In</span>
                </button>
                <button
                  onClick={() => handleTabChange("register")}
                  className={`relative py-2 px-4 md:px-6 rounded-lg text-sm font-medium transition-all duration-300 overflow-hidden flex-1 text-center ${
                    // Made buttons flexible and centered text
                    activeTab === "register"
                      ? "bg-white text-indigo-600 shadow-md"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {activeTab === "register" && (
                    <div className="absolute inset-0 bg-indigo-50 animate-pulseLight" />
                  )}
                  <span className="relative z-10">Sign Up</span>
                </button>
              </div>

              <h2
                className="text-xl md:text-2xl font-semibold text-slate-800 mb-6 flex items-center justify-center md:justify-start opacity-0 animate-fadeIn" // Adjusted font size and centered on small screens
                style={{
                  animationDelay: "400ms",
                  animationFillMode: "forwards",
                }}
              >
                {activeTab === "login" ? "Access Account" : "Create Account"}
                <Sparkles
                  className="ml-2 text-indigo-500 animate-sparkle"
                  size={18}
                />
              </h2>

              {/* Social Login */}
              <div
                className="grid grid-cols-3 gap-3 mb-6 opacity-0 animate-fadeIn"
                style={{
                  animationDelay: "500ms",
                  animationFillMode: "forwards",
                }}
              >
                <SocialButton icon={Github} delay={0} />
                <SocialButton icon={Twitter} delay={100} />
                <SocialButton icon={Mail} delay={200} />
              </div>

              <div
                className="relative mb-6 opacity-0 animate-fadeIn"
                style={{
                  animationDelay: "600ms",
                  animationFillMode: "forwards",
                }}
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">
                    or continue with
                  </span>
                </div>
              </div>

              {isFirebaseConfigured() && (
                <div
                  className="mb-6 opacity-0 animate-fadeIn"
                  style={{ animationDelay: "620ms", animationFillMode: "forwards" }}
                >
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200 text-slate-700 font-medium text-sm shadow-sm"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in with Google
                  </button>
                </div>
              )}

              {/* Form */}
              <div
                className={`transition-all duration-500 ${
                  isAnimating
                    ? "opacity-0 transform scale-95"
                    : "opacity-100 transform scale-100"
                }`}
              >
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Error and Success Messages */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                      {success}
                    </div>
                  )}
                  {activeTab === "register" && (
                    <div
                      className="opacity-0 animate-fadeSlideUp"
                      style={{
                        animationDelay: "200ms",
                        animationFillMode: "forwards",
                      }}
                    >
                      <label className="block text-slate-700 text-sm font-medium mb-2">
                        Full Name
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User
                            size={18}
                            className="text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200"
                          />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50/70 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm" // Adjusted font size
                          placeholder="Enter your name"
                          required
                        />
                        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-indigo-500 group-focus-within:w-full transition-all duration-300" />
                      </div>
                    </div>
                  )}

                  <div
                    className="opacity-0 animate-fadeSlideUp"
                    style={{
                      animationDelay:
                        activeTab === "register" ? "300ms" : "200ms",
                      animationFillMode: "forwards",
                    }}
                  >
                    <label className="block text-slate-700 text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail
                          size={18}
                          className="text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200"
                        />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50/70 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm" // Adjusted font size
                        placeholder="name@example.com"
                        required
                      />
                      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-indigo-500 group-focus-within:w-full transition-all duration-300" />
                    </div>
                  </div>

                  <div
                    className="opacity-0 animate-fadeSlideUp"
                    style={{
                      animationDelay:
                        activeTab === "register" ? "400ms" : "300ms",
                      animationFillMode: "forwards",
                    }}
                  >
                    <label className="block text-slate-700 text-sm font-medium mb-2">
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock
                          size={18}
                          className="text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200"
                        />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-12 py-3 bg-slate-50/70 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm" // Adjusted font size
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-indigo-600 transition-colors duration-200"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-indigo-500 group-focus-within:w-full transition-all duration-300" />
                    </div>
                  </div>

                  {activeTab === "register" && (
                    <div
                      className="opacity-0 animate-fadeSlideUp"
                      style={{
                        animationDelay: "500ms",
                        animationFillMode: "forwards",
                      }}
                    >
                      <label className="block text-slate-700 text-sm font-medium mb-2">
                        Confirm Password
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock
                            size={18}
                            className="text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200"
                          />
                        </div>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50/70 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm" // Adjusted font size
                          placeholder="••••••••"
                          required
                        />
                        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-indigo-500 group-focus-within:w-full transition-all duration-300" />
                      </div>
                    </div>
                  )}

                  {activeTab === "login" && (
                    <div
                      className="flex flex-col md:flex-row items-center justify-between opacity-0 animate-fadeSlideUp gap-2" // Stack on small, row on medium+
                      style={{
                        animationDelay: "400ms",
                        animationFillMode: "forwards",
                      }}
                    >
                      <div className="flex items-center">
                        <div className="relative">
                          <input
                            type="checkbox"
                            id="remember"
                            className="sr-only"
                          />
                          <div className="w-4 h-4 border border-slate-300 rounded flex items-center justify-center">
                            <div className="w-2 h-2 bg-indigo-500 rounded-sm opacity-0 transition-opacity duration-200 peer-checked:opacity-100" />
                          </div>
                        </div>
                        <label
                          htmlFor="remember"
                          className="ml-2 block text-sm text-slate-600"
                        >
                          Remember me
                        </label>
                      </div>
                      <div>
                        <button
                          type="button"
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200 bg-transparent border-0 cursor-pointer p-0"
                        >
                          Forgot password?
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 relative overflow-hidden ${
                      isSubmitting ? "cursor-wait" : ""
                    } opacity-0 animate-fadeSlideUp text-sm md:text-base`} // Adjusted font size
                    style={{
                      animationDelay:
                        activeTab === "register" ? "600ms" : "500ms",
                      animationFillMode: "forwards",
                    }}
                  >
                    {isSubmitting && (
                      <div className="absolute inset-0 flex items-center justify-center bg-indigo-600">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    <span>
                      {activeTab === "login" ? "Sign In" : "Create Account"}
                    </span>
                    <ArrowRight size={18} className="animate-bounce-x" />
                  </button>
                </form>

                <p
                  className="mt-6 text-center text-slate-600 text-sm opacity-0 animate-fadeIn"
                  style={{
                    animationDelay:
                      activeTab === "register" ? "700ms" : "600ms",
                    animationFillMode: "forwards",
                  }}
                >
                  {activeTab === "login" ? (
                    <>
                      Don't have an account?{" "}
                      <button
                        onClick={() => handleTabChange("register")}
                        className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors duration-200"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        onClick={() => handleTabChange("login")}
                        className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors duration-200"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes blob {
          0%,
          100% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
          25% {
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
          }
          50% {
            border-radius: 50% 60% 30% 60% / 40% 50% 60% 40%;
          }
          75% {
            border-radius: 40% 60% 70% 30% / 60% 40% 30% 70%;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulseLight {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.2;
          }
        }

        @keyframes sparkle {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        @keyframes bounce-x {
          0%,
          100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(3px);
          }
        }

        .animate-blob {
          animation: blob 10s infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-fadeSlideUp {
          animation: fadeSlideUp 0.6s ease-out forwards;
        }

        .animate-pulseLight {
          animation: pulseLight 2s infinite;
        }

        .animate-sparkle {
          animation: sparkle 2s infinite;
        }

        .animate-bounce-x {
          animation: bounce-x 1s infinite;
        }
      `}</style>
    </div>
  );
};

export default Client;
