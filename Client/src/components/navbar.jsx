import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FaUserCircle,
  FaBars,
  FaTimes,
  FaSearch,
  FaGlobe,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserPlus,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeLink, setActiveLink] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);

  const mobileMenuRef = useRef(null);
  const searchInputRef = useRef(null);
  const languageRef = useRef(null);
  const mobileMenuToggleRef = useRef(null);
  const navbarRef = useRef(null);
  const profileRef = useRef(null);

  const { t, i18n } = useTranslation();
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation(); // Get current location

  // Check if we're in the client area
  const isClientPage = location.pathname === "/client";

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsLanguageOpen(false);
    setIsProfileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsSearchOpen(false);
    setIsLanguageOpen(false);
    setIsProfileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    if (mobileMenuToggleRef.current) {
      mobileMenuToggleRef.current.focus();
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsMobileMenuOpen(false);
    setIsLanguageOpen(false);
    setIsProfileMenuOpen(false);
  };

  const toggleLanguage = () => {
    setIsLanguageOpen(!isLanguageOpen);
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsProfileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsLanguageOpen(false);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLanguageOpen(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsProfileMenuOpen(false);
    navigate("/client"); // Navigate to the /client route
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsProfileMenuOpen(false);
    navigate("/"); // Navigate to home page on logout
  };

  const handleProfileClick = () => {
    console.log("Viewing profile...");
    setIsProfileMenuOpen(false);
    // Optional: Navigate to the user's profile page
    navigate("/profile");
  };

  // Handle navigation differently based on whether we're in client page or home page
  const handleNavigation = (linkId) => {
    setActiveLink(linkId);
    closeMobileMenu();

    if (isClientPage) {
      // If we're in client page, navigate to home with hash
      navigate(`/#${linkId}`);
    } else {
      // If we're already on home page, just scroll to the section
      const element = document.getElementById(linkId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollTop = window.scrollY;
      setScrollProgress(scrollHeight > 0 ? scrollTop / scrollHeight : 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the mobile menu and its toggle button
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !mobileMenuToggleRef.current.contains(event.target) // Check the toggle button
      ) {
        setIsMobileMenuOpen(false);
      }

      // Check if the click is outside the search input and its toggle button
      if (
        isSearchOpen &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target) &&
        !event.target.closest(".search-toggle") // Use closest for the toggle button
      ) {
        setIsSearchOpen(false);
      }

      // Check if the click is outside the language menu and its toggle button
      if (
        isLanguageOpen &&
        languageRef.current &&
        !languageRef.current.contains(event.target) &&
        !event.target.closest(".language-toggle") // Use closest for the toggle button
      ) {
        setIsLanguageOpen(false);
      }

      // Check if the click is outside the profile menu and its toggle button
      if (
        isProfileMenuOpen &&
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        !event.target.closest(".profile-toggle") // Use closest for the toggle button
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen, isSearchOpen, isLanguageOpen, isProfileMenuOpen]); // Added all relevant states to dependency array

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    // Only observe sections if we're on the homepage
    if (!isClientPage) {
      const handleIntersection = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
            const rect = entry.target.getBoundingClientRect();
            // Check if the section is roughly in the middle of the viewport
            if (
              rect.top <= window.innerHeight * 0.5 && // Adjusted threshold
              rect.bottom >= window.innerHeight * 0.5 // Adjusted threshold
            ) {
              setActiveLink(entry.target.id);
            }
          }
        });
      };

      const observer = new IntersectionObserver(handleIntersection, {
        threshold: [0.1, 0.5, 0.9],
      });

      const sections = document.querySelectorAll("section[id]");
      sections.forEach((section) => observer.observe(section));

      return () => {
        sections.forEach((section) => observer.unobserve(section));
      };
    }
  }, [isClientPage]);

  const navLinks = [
    { name: t("home"), href: "#home", id: "home" },
    { name: t("pricing"), href: "#pricing", id: "pricing" },
    { name: t("channels"), href: "#channels", id: "channels" },
    { name: t("tutorial"), href: "#tutorial", id: "tutorial" },
    { name: t("faq"), href: "#faq", id: "faq" },
  ];

  const languages = [
    { code: "en", name: t("english"), flag: "🇺🇸" },
    { code: "ar", name: t("arabic"), flag: "🇸🇦" },
    { code: "fr", name: t("french"), flag: "🇫🇷" },
    { code: "es", name: t("spanish"), flag: "🇪🇸" },
  ];

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  };

  const linkVariants = {
    initial: { y: 0 },
    hover: { y: -2, transition: { duration: 0.2 } },
  };

  const underlineVariants = {
    initial: { scaleX: 0, originX: 0 },
    hover: { scaleX: 1, transition: { duration: 0.3 } },
    active: { scaleX: 1, originX: 0 },
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1],
      },
    }),
  };

  const buttonHoverVariants = {
    initial: { scale: 1, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" },
    hover: {
      scale: 1.03,
      boxShadow: "0 10px 25px rgba(0, 100, 255, 0.3)",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.97 },
  };

  // Logo click handler
  const handleLogoClick = () => {
    if (isClientPage) {
      navigate("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      ref={navbarRef}
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gray-900/60 backdrop-blur-lg border-b border-gray-800/40 shadow-xl"
          : "bg-transparent"
      }`}
      aria-label={t("main_navigation")}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:p-3 focus:rounded-md focus:bg-white focus:text-gray-900 focus:shadow-lg"
      >
        {t("skip_to_main_content")}
      </a>

      <div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500" // Changed to bottom for better visibility
        style={{ width: `${scrollProgress * 100}%` }}
      ></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4 flex items-center justify-between">
        {" "}
        {/* Adjusted vertical padding */}
        <motion.div
          className="flex items-center group cursor-pointer"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          onClick={handleLogoClick}
        >
          <div className="relative">
            <div className="absolute -inset-1 rounded-full blur opacity-40 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 group-hover:opacity-70 transition duration-300"></div>
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-full">
              {" "}
              {/* Adjusted size for sm breakpoint */}
              <span className="text-base sm:text-lg md:text-lg font-bold text-white">
                📺
              </span>{" "}
              {/* Adjusted font size for sm breakpoint */}
            </div>
          </div>
          <div
            className="ml-2 text-lg sm:text-xl md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 hover:from-blue-300 hover:to-teal-300 transition-all duration-300" // Adjusted font size for sm breakpoint
            aria-label="Evo Media home"
          >
            Evo Media
          </div>
        </motion.div>
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
          {" "}
          {/* Adjusted horizontal spacing */}
          {navLinks.map((link) => (
            <motion.div
              key={link.href}
              onClick={() => handleNavigation(link.id)}
              className="text-gray-300 hover:text-white transition-colors duration-200 relative group cursor-pointer text-sm lg:text-base" // Adjusted font size
              variants={linkVariants}
              initial="initial"
              whileHover="hover"
              aria-label={link.name}
            >
              {link.name}
              <motion.span
                className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400"
                variants={underlineVariants}
                initial="initial"
                animate={activeLink === link.id ? "active" : "initial"}
                whileHover="hover"
              />
            </motion.div>
          ))}
        </div>
        {/* Desktop Action Buttons and Icons */}
        <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
          {" "}
          {/* Adjusted horizontal spacing */}
          <motion.a
            href={isClientPage ? "/" : "#freetrial"}
            onClick={(e) => {
              if (isClientPage) {
                e.preventDefault();
                navigate("/#freetrial");
              }
            }}
            className="relative overflow-hidden group bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 px-4 lg:py-2.5 lg:px-6 rounded-full shadow-md text-sm lg:text-base" // Adjusted padding and font size
            variants={buttonHoverVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            aria-label={t("free_trial")}
          >
            <span className="absolute inset-0 w-0 bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-[400ms] ease-out group-hover:w-full"></span>
            <span className="relative flex items-center justify-center gap-1 lg:gap-2">
              {" "}
              {/* Adjusted gap */}
              {t("free_trial")}
              <span className="transform transition-transform duration-300 group-hover:translate-x-1">
                ➔
              </span>
            </span>
          </motion.a>
          <motion.a
            href={isClientPage ? "/" : "#contact"}
            onClick={(e) => {
              if (isClientPage) {
                e.preventDefault();
                navigate("/#contact");
              }
            }}
            className="relative overflow-hidden group bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-4 lg:py-2.5 lg:px-6 rounded-full shadow-md text-sm lg:text-base" // Adjusted padding and font size
            variants={buttonHoverVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            aria-label={t("contact_us")}
          >
            <span className="absolute inset-0 w-0 bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-[400ms] ease-out group-hover:w-full"></span>
            <span className="relative flex items-center justify-center gap-1 lg:gap-2">
              {" "}
              {/* Adjusted gap */}
              {t("contact_us")}
              <span className="transform transition-transform duration-300 group-hover:translate-x-1">
                ➔
              </span>
            </span>
          </motion.a>
          <motion.button
            onClick={toggleSearch}
            className="search-toggle relative p-2 rounded-full bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/70 text-gray-300 hover:text-white transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={t("search")}
            aria-expanded={isSearchOpen}
            aria-controls="search-input-container"
          >
            <span className="sr-only">{t("search")}</span>
            <FaSearch className="w-5 h-5" />
          </motion.button>
          <div className="relative">
            <motion.button
              onClick={toggleLanguage}
              className="language-toggle relative p-2 rounded-full bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/70 text-gray-300 hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={t("language")}
              aria-expanded={isLanguageOpen}
              aria-haspopup="menu"
            >
              <span className="sr-only">{t("language")}</span>
              <FaGlobe className="w-5 h-5" />
            </motion.button>

            <AnimatePresence>
              {isLanguageOpen && (
                <motion.div
                  ref={languageRef}
                  id="language-menu"
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="absolute top-full right-0 mt-2 w-44 bg-gray-800/90 backdrop-blur-md rounded-xl shadow-2xl py-2 z-50 border border-gray-700/50 overflow-hidden"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="language-icon-button"
                >
                  {languages.map((lang) => (
                    <motion.button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 focus:outline-none transition-colors duration-200"
                      whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.7)" }}
                      role="menuitem"
                    >
                      <span className="mr-3 text-lg">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="relative">
            <motion.button
              onClick={toggleProfileMenu}
              className="profile-toggle relative p-2 rounded-full bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/70 text-gray-300 hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={t("profile")}
              aria-expanded={isProfileMenuOpen}
              aria-haspopup="menu"
            >
              <span className="sr-only">{t("profile")}</span>
              <FaUserCircle className="w-5 h-5" />
            </motion.button>

            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div
                  ref={profileRef}
                  id="profile-menu"
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="absolute top-full right-0 mt-2 w-48 bg-gray-800/90 backdrop-blur-md rounded-xl shadow-2xl py-2 z-50 border border-gray-700/50 overflow-hidden"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="profile-icon-button"
                >
                  {!isLoggedIn ? (
                    <>
                      <motion.button
                        onClick={handleLogin}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 focus:outline-none transition-colors duration-200"
                        whileHover={{
                          backgroundColor: "rgba(55, 65, 81, 0.7)",
                        }}
                        role="menuitem"
                      >
                        <FaSignInAlt className="mr-3 w-4 h-4" />
                        <span>{t("login")}</span>
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <motion.button
                        onClick={handleProfileClick}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 focus:outline-none transition-colors duration-200"
                        whileHover={{
                          backgroundColor: "rgba(55, 65, 81, 0.7)",
                        }}
                        role="menuitem"
                      >
                        <FaUserCircle className="mr-3 w-4 h-4" />
                        <span>{t("profile")}</span>
                      </motion.button>
                      <motion.button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 focus:outline-none transition-colors duration-200"
                        whileHover={{
                          backgroundColor: "rgba(55, 65, 81, 0.7)",
                        }}
                        role="menuitem"
                      >
                        <FaSignOutAlt className="mr-3 w-4 h-4" />
                        <span>{t("logout")}</span>
                      </motion.button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        {/* Mobile Menu Toggle and Icons (Visible on small and medium screens) */}
        <div className="flex md:hidden items-center space-x-3">
          {" "}
          {/* Changed to flex md:hidden */}
          {/* Search Icon */}
          <motion.button
            onClick={toggleSearch}
            className="search-toggle relative p-2 rounded-full bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/70 text-gray-300 hover:text-white transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={t("search")}
            aria-expanded={isSearchOpen}
            aria-controls="search-input-container-mobile"
          >
            <span className="sr-only">{t("search")}</span>
            <FaSearch className="w-5 h-5" />
          </motion.button>
          {/* Language Icon */}
          <div className="relative">
            <motion.button
              onClick={toggleLanguage}
              className="language-toggle relative p-2 rounded-full bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/70 text-gray-300 hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={t("language")}
              aria-expanded={isLanguageOpen}
              aria-haspopup="menu"
            >
              <span className="sr-only">{t("language")}</span>
              <FaGlobe className="w-5 h-5" />
            </motion.button>
            <AnimatePresence>
              {isLanguageOpen && (
                <motion.div
                  ref={languageRef}
                  id="language-menu-mobile"
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="absolute top-full right-0 mt-2 w-44 bg-gray-800/90 backdrop-blur-md rounded-xl shadow-2xl py-2 z-50 border border-gray-700/50 overflow-hidden"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="language-icon-button"
                >
                  {languages.map((lang) => (
                    <motion.button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 focus:outline-none transition-colors duration-200"
                      whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.7)" }}
                      role="menuitem"
                    >
                      <span className="mr-3 text-lg">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Profile Icon */}
          <div className="relative">
            <motion.button
              onClick={toggleProfileMenu}
              className="profile-toggle relative p-2 rounded-full bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/70 text-gray-300 hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={t("profile")}
              aria-expanded={isProfileMenuOpen}
              aria-haspopup="menu"
            >
              <span className="sr-only">{t("profile")}</span>
              <FaUserCircle className="w-5 h-5" />
            </motion.button>

            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div
                  ref={profileRef}
                  id="profile-menu-mobile"
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="absolute top-full right-0 mt-2 w-48 bg-gray-800/90 backdrop-blur-md rounded-xl shadow-2xl py-2 z-50 border border-gray-700/50 overflow-hidden"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="profile-icon-button"
                >
                  {!isLoggedIn ? (
                    <>
                      <motion.button
                        onClick={handleLogin}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 focus:outline-none transition-colors duration-200"
                        whileHover={{
                          backgroundColor: "rgba(55, 65, 81, 0.7)",
                        }}
                        role="menuitem"
                      >
                        <FaSignInAlt className="mr-3 w-4 h-4" />
                        <span>{t("login")}</span>
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <motion.button
                        onClick={handleProfileClick}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 focus:outline-none transition-colors duration-200"
                        whileHover={{
                          backgroundColor: "rgba(55, 65, 81, 0.7)",
                        }}
                        role="menuitem"
                      >
                        <FaUserCircle className="mr-3 w-4 h-4" />
                        <span>{t("profile")}</span>
                      </motion.button>
                      <motion.button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 focus:outline-none transition-colors duration-200"
                        whileHover={{
                          backgroundColor: "rgba(55, 65, 81, 0.7)",
                        }}
                        role="menuitem"
                      >
                        <FaSignOutAlt className="mr-3 w-4 h-4" />
                        <span>{t("logout")}</span>
                      </motion.button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Mobile Menu Toggle */}
          <motion.button
            ref={mobileMenuToggleRef}
            onClick={toggleMobileMenu}
            className="mobile-menu-toggle relative p-2 rounded-full bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/70 text-gray-300 hover:text-white transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={t("toggle_mobile_menu")}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="sr-only">{t("toggle_mobile_menu")}</span>
            {isMobileMenuOpen ? (
              <FaTimes className="w-5 h-5" />
            ) : (
              <FaBars className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            id="search-input-container"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-gray-800/80 backdrop-blur-md border-b border-gray-700/50 px-4 py-3 shadow-lg"
          >
            <div className="container mx-auto max-w-3xl relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="w-5 h-5 text-gray-400" />
              </div>
              <label htmlFor="search-input" className="sr-only">
                {t("search")}
              </label>
              <input
                id="search-input"
                ref={searchInputRef}
                type="text"
                placeholder={t("search_placeholder")}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-700/70 text-white border border-gray-600/50 focus:border-blue-500 focus:ring focus:ring-blue-500/30 shadow-inner transition-all duration-300 text-sm" // Adjusted font size
                aria-label={t("search_input")}
              />
              <motion.button
                onClick={() => setIsSearchOpen(false)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={t("close_search")}
              >
                <span className="sr-only">{t("close")}</span>
                <FaTimes className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            id="mobile-menu"
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{
              opacity: 1,
              height: "auto",
              y: 0,
              transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
            }}
            exit={{
              opacity: 0,
              height: 0,
              y: -10,
              transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] },
            }}
            className="md:hidden bg-gray-900/95 backdrop-blur-xl border-b border-gray-800/70 overflow-hidden px-4 shadow-2xl"
            role="navigation"
            aria-label={t("mobile_navigation")}
          >
            <motion.div
              className="py-6 space-y-6"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.07 } },
              }}
            >
              <div className="space-y-2">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      handleNavigation(link.id); // Use the unified navigation handler
                    }}
                    className={`block py-3 px-4 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/70 transition-all duration-200 text-base ${
                      // Adjusted font size
                      activeLink === link.id
                        ? "bg-gray-800/90 text-white border-l-4 border-blue-500 pl-3"
                        : ""
                    }`}
                    custom={index}
                    variants={mobileItemVariants}
                    aria-label={link.name}
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>

              <div className="space-y-3 pt-2">
                <motion.a
                  href={isClientPage ? "/" : "#freetrial"} // Ensure correct href based on page
                  onClick={(e) => {
                    if (isClientPage) {
                      e.preventDefault();
                      navigate("/#freetrial");
                    }
                    closeMobileMenu();
                  }}
                  className="block w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3.5 px-4 rounded-xl text-center shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all duration-300 text-base" // Adjusted font size
                  custom={navLinks.length}
                  variants={mobileItemVariants}
                  aria-label={t("free_trial")}
                >
                  <span className="flex items-center justify-center gap-2">
                    {t("free_trial")}
                    <span className="transform transition-transform duration-300 group-hover:translate-x-1">
                      ➔
                    </span>
                  </span>
                </motion.a>

                <motion.a
                  href={isClientPage ? "/" : "#contact"} // Ensure correct href based on page
                  onClick={(e) => {
                    if (isClientPage) {
                      e.preventDefault();
                      navigate("/#contact");
                    }
                    closeMobileMenu();
                  }}
                  className="block w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3.5 px-4 rounded-xl text-center shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 text-base" // Adjusted font size
                  custom={navLinks.length + 1}
                  variants={mobileItemVariants}
                  aria-label={t("contact_us")}
                >
                  <span className="flex items-center justify-center gap-2">
                    {t("contact_us")}
                    <span className="transform transition-transform duration-300 group-hover:translate-x-1">
                      ➔
                    </span>
                  </span>
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
