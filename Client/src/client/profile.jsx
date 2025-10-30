import { useState, useEffect, useRef } from "react";
import {
  User,
  Settings,
  CreditCard,
  LogOut,
  Package,
  History,
  ChevronRight,
  Bell,
  Edit,
  Plus,
  X,
  Camera,
} from "lucide-react";
// Assuming you have a CSS file for styles
import "./profile.css"; // Assuming you have a CSS file for styles
import api from "../api";

// Main User Profile Component
export default function Profile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const fileInputRef = useRef(null);

  // Animation classes for tab transitions
  const getTabAnimationClass = (tabId) => {
    // Use absolute positioning and transitions for smoother tab switching
    return activeTab === tabId
      ? "absolute inset-0 opacity-100 transition-opacity duration-500 ease-in-out"
      : "absolute inset-0 opacity-0 pointer-events-none"; // Hide and disable interaction
  };

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // Redirect to login if no token
          window.location.href = "/client";
          return;
        }

        // Set auth header
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const response = await api.get("/api/auth/profile");

        if (response.data.success) {
          setUserData(response.data.user);
          setLoading(false);
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
        if (error.response?.status === 401) {
          // Token expired or invalid, redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/client";
        } else {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, []);

  // Handle avatar upload
  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserData((prev) => ({
          ...prev,
          avatar: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    setRedirecting(true);
    setTimeout(() => {
      window.location.href = "/client"; // Redirect to client page
    }, 1000);
  };

  // Handle plan upgrade
  const handleUpgradePlan = () => {
    setRedirecting(true);
    setTimeout(() => {
      window.location.href = "/pricing"; // Redirect to pricing page
    }, 100);
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setUserData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((notif) => ({
        ...notif,
        read: true,
      })),
    }));
  };

  // Loading state UI
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-700 h-24 w-24 mb-4 animate-glow"></div>
          <div className="h-4 bg-gray-700 rounded w-48 mb-2 animate-glow"></div>
          <div className="h-3 bg-gray-700 rounded w-32 animate-glow"></div>
        </div>
      </div>
    );
  }

  // Redirecting overlay
  if (redirecting) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
          <p className="mt-4 text-xl text-white">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Tab content components
  const TabContent = () => {
    // Wrap tab content in a relative container for absolute positioning
    return (
      <div className="relative min-h-[500px]">
        {" "}
        {/* Added min-height to prevent layout shifts */}
        <OverviewTab
          userData={userData}
          setUserData={setUserData}
          animationClass={getTabAnimationClass("overview")}
        />
        <SubscriptionTab
          userData={userData}
          handleUpgradePlan={handleUpgradePlan}
          animationClass={getTabAnimationClass("subscription")}
        />
        <HistoryTab
          userData={userData}
          animationClass={getTabAnimationClass("history")}
        />
        <DevicesTab
          userData={userData}
          setUserData={setUserData}
          animationClass={getTabAnimationClass("devices")}
        />
        <SettingsTab
          userData={userData}
          setUserData={setUserData}
          animationClass={getTabAnimationClass("settings")}
        />
      </div>
    );
  };

  // Notifications panel
  const NotificationsPanel = () => {
    // Use absolute positioning for the dropdown, adjust positioning for smaller screens
    return (
      <div
        className={`absolute right-0 mt-2 w-full md:w-80 bg-gray-900/90 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 ${
          showNotifications ? "block" : "hidden"
        }`}
      >
        <div className="p-3 border-b border-gray-800 flex justify-between items-center">
          <h3 className="font-medium text-white">Notifications</h3>
          <div className="flex gap-2 items-center">
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Mark all as read
            </button>
            <button
              onClick={() => setShowNotifications(false)}
              className="text-gray-400 hover:text-white"
              aria-label="Close notifications"
            >
              <X size={14} />
            </button>
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {userData.notifications.length > 0 ? (
            <div>
              {userData.notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start p-3 border-b border-gray-800 ${
                    notification.read ? "bg-transparent" : "bg-blue-900/20"
                  } hover:bg-gray-800 transition-colors duration-200 cursor-pointer`}
                  onClick={() =>
                    setUserData((prev) => ({
                      ...prev,
                      notifications: prev.notifications.map((n) =>
                        n.id === notification.id ? { ...n, read: true } : n
                      ),
                    }))
                  } // Mark as read on click
                >
                  <Bell
                    size={16}
                    className={`mt-1 mr-3 ${
                      notification.read ? "text-gray-500" : "text-blue-400"
                    }`}
                  />
                  <div>
                    <p
                      className={`${
                        notification.read ? "text-gray-400" : "text-gray-200"
                      } text-sm`}
                    >
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No notifications
            </div>
          )}
        </div>
      </div>
    );
  };

  // Get unread notification count
  const unreadCount = userData.notifications.filter((n) => !n.read).length;

  return (
    <div className="profile-container min-h-screen bg-black text-white p-4 md:p-8">
      {" "}
      {/* Added padding for different screens */}
      {/* Ambient background effects */}
      <div className="fixed inset-0 bg-gradient-radial from-gray-900 to-black -z-10"></div>
      <div className="fixed top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-700/10 rounded-full blur-3xl animate-float -z-10"></div>
      <div className="fixed bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-700/10 rounded-full blur-3xl animate-float-delay -z-10"></div>
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl shadow-glow mb-8 border border-blue-800/50 backdrop-blur-sm p-4 md:p-6">
        {" "}
        {/* Adjusted padding */}
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-purple-500/50 shadow-neon transition-transform duration-300 transform group-hover:scale-105">
                <img
                  src={userData.avatar}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/100x100/000000/FFFFFF?text=AJ";
                  }} // Fallback image
                />
              </div>
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2 shadow-neon hover:bg-purple-500 transition-colors duration-300"
                aria-label="Upload new avatar"
              >
                <Camera size={14} className="text-white" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarUpload}
                className="hidden"
                accept="image/*"
              />
            </div>
            <div className="ml-4 text-center md:text-left">
              {" "}
              {/* Center text on small screens */}
              <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                {" "}
                {/* Adjusted font size */}
                {userData.name}
              </h1>
              <p className="text-blue-300 text-sm md:text-base">
                {userData.email}
              </p>{" "}
              {/* Adjusted font size */}
            </div>
          </div>
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 w-full md:w-auto items-center">
            {" "}
            {/* Stack buttons on small screens */}
            <div className="relative w-full md:w-auto">
              {" "}
              {/* Make notification button full width on small screens */}
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="bg-white/10 hover:bg-white/20 transition-all duration-300 rounded-lg px-4 py-2 text-sm font-medium backdrop-blur-sm flex items-center justify-center w-full" // Center content and make full width
                aria-expanded={showNotifications}
                aria-controls="notifications-panel"
              >
                <Bell size={16} className="inline mr-2" />
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <NotificationsPanel />
            </div>
            <button
              onClick={handleSignOut}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white transition-all duration-300 rounded-lg px-4 py-2 text-sm font-medium shadow-neon w-full md:w-auto" // Make sign out button full width on small screens
            >
              <LogOut size={16} className="inline mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </header>
      {/* Main content */}
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="md:w-64 space-y-4 w-full">
            {" "}
            {/* Make sidebar full width on small screens */}
            <nav className="bg-gray-900/80 rounded-xl shadow-lg backdrop-blur-md border border-gray-800/50 overflow-hidden animate-fadeIn">
              {[
                {
                  id: "overview",
                  label: "Overview",
                  icon: <User size={18} />,
                },
                {
                  id: "subscription",
                  label: "Subscription",
                  icon: <CreditCard size={18} />,
                },
                {
                  id: "history",
                  label: "Watch History",
                  icon: <History size={18} />,
                },
                {
                  id: "devices",
                  label: "My Devices",
                  icon: <Package size={18} />,
                },
                {
                  id: "settings",
                  label: "Settings",
                  icon: <Settings size={18} />,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center w-full px-4 py-3 md:py-4 hover:bg-gray-800 transition-all duration-300 text-sm md:text-base ${
                    // Adjusted padding and font size
                    activeTab === tab.id
                      ? "text-blue-400 bg-blue-900/20 border-l-4 border-blue-500 font-medium"
                      : "text-gray-300 border-l-4 border-transparent"
                  }`}
                >
                  <span
                    className={`mr-3 ${
                      activeTab === tab.id ? "text-blue-400" : "text-gray-400"
                    }`}
                  >
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  <ChevronRight
                    size={16}
                    className={`ml-auto ${
                      activeTab === tab.id ? "opacity-100" : "opacity-50"
                    }`}
                  />
                </button>
              ))}
            </nav>
            <div className="bg-gradient-to-br from-blue-900/80 to-purple-900/80 backdrop-blur-md text-white p-5 rounded-xl shadow-glow border border-purple-800/30 animate-fadeIn text-center md:text-left">
              {" "}
              {/* Center text on small screens */}
              <h3 className="font-medium mb-1 text-purple-300 text-base md:text-lg">
                {" "}
                {/* Adjusted font size */}
                Current Plan:{" "}
                <span className="text-white">{userData.plan}</span>
              </h3>
              <p className="text-sm text-blue-300 mb-3">
                Expires: {userData.planExpiry}
              </p>
              <button
                onClick={handleUpgradePlan}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white transition-all duration-300 rounded-lg px-3 py-2 text-sm font-medium w-full shadow-neon transform hover:translate-y-px"
              >
                Upgrade Plan
              </button>
            </div>
          </aside>

          {/* Main content area */}
          <main className="flex-1 bg-gray-900/80 rounded-xl shadow-glow p-4 md:p-6 backdrop-blur-md border border-gray-800/50 animate-fadeIn w-full">
            {" "}
            {/* Adjusted padding and made full width */}
            <TabContent />
          </main>
        </div>
      </div>
    </div>
  );
}

// Tab components
const OverviewTab = ({ userData, setUserData, animationClass }) => {
  // Mark notification as read
  const markAsRead = (id) => {
    setUserData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      ),
    }));
  };

  return (
    <div className={`space-y-6 ${animationClass}`}>
      <h2 className="text-xl font-bold mb-4 text-blue-400">Account Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {" "}
        {/* Use 1 column on small, 2 on medium+ */}
        <div className="bg-gray-800/50 rounded-lg p-5 hover:shadow-glow transition-all duration-500 border border-gray-700/50 backdrop-blur-sm">
          <h3 className="font-medium text-gray-300 mb-2">
            Subscription Status
          </h3>
          <div className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full mr-2 ${
                userData.subscriptionActive
                  ? "bg-green-500 animate-pulse"
                  : "bg-red-500"
              }`}
            ></div>
            <span
              className={
                userData.subscriptionActive ? "text-green-400" : "text-red-400"
              }
            >
              {userData.subscriptionActive ? "Active" : "Inactive"}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Next payment: {userData.planExpiry}
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-5 hover:shadow-glow transition-all duration-500 border border-gray-700/50 backdrop-blur-sm">
          <h3 className="font-medium text-gray-300 mb-2">Payment Method</h3>
          <div className="flex items-center">
            <CreditCard size={16} className="mr-2 text-blue-400" />
            <span className="text-gray-300">{userData.paymentMethod}</span>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            <button className="text-blue-400 hover:text-blue-300 transition-colors">
              Update payment method
            </button>
          </p>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-5 hover:shadow-glow transition-all duration-500 border border-gray-700/50 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
          {" "}
          {/* Allow items to wrap on small screens */}
          <h3 className="font-medium text-gray-300">Recent Activity</h3>
          <div className="bg-blue-900/30 rounded-full h-1 w-24">
            <div className="bg-blue-500 h-1 rounded-full w-2/3 animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-3">
          {userData.watchHistory.slice(0, 2).map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row items-start md:items-center justify-between py-3 border-b border-gray-700/50 last:border-0 gap-2" // Stack on small, row on medium+
            >
              <div>
                <p className="font-medium text-gray-200">{item.name}</p>
                <p className="text-sm text-gray-500">{item.lastWatched}</p>
              </div>
              <button className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 px-3 py-1 rounded-full text-sm transition-colors duration-300 self-start md:self-center">
                {" "}
                {/* Align button */}
                Resume
              </button>
            </div>
          ))}
        </div>
        <button className="text-blue-400 hover:text-blue-300 transition-colors text-sm mt-3 flex items-center">
          View all activity
          <ChevronRight size={14} className="ml-1" />
        </button>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-5 hover:shadow-glow transition-all duration-500 border border-gray-700/50 backdrop-blur-sm">
        <h3 className="font-medium text-gray-300 mb-3">Notifications</h3>
        {userData.notifications.length > 0 ? (
          <div className="space-y-3">
            {userData.notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start p-3 rounded-lg ${
                  notification.read
                    ? "bg-transparent"
                    : "bg-blue-900/20 animate-glow-subtle"
                } transition-all duration-300 cursor-pointer`}
                onClick={() => markAsRead(notification.id)}
              >
                <Bell
                  size={16}
                  className={`mt-1 mr-2 ${
                    notification.read ? "text-gray-500" : "text-blue-400"
                  }`}
                />
                <div>
                  <p
                    className={`${
                      notification.read ? "text-gray-500" : "text-gray-300"
                    }`}
                  >
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-600">{notification.date}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No new notifications</p>
        )}
      </div>
    </div>
  );
};

const SubscriptionTab = ({ userData, handleUpgradePlan, animationClass }) => {
  return (
    <div className={`space-y-6 ${animationClass}`}>
      <h2 className="text-xl font-bold mb-4 text-blue-400">
        Your Subscription
      </h2>

      <div className="bg-gradient-to-r from-blue-900/80 to-purple-900/80 text-white rounded-lg p-6 relative overflow-hidden shadow-glow border border-blue-800/30">
        <div className="absolute top-0 right-0 w-32 h-32 md:w-40 md:h-40 bg-white/5 rounded-full -mr-16 -mt-16 animate-float"></div>{" "}
        {/* Adjusted size */}
        <div className="absolute bottom-0 left-0 w-24 h-24 md:w-32 md:h-32 bg-white/5 rounded-full -ml-12 -mb-12 animate-float-delay"></div>{" "}
        {/* Adjusted size */}
        <h3 className="text-xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300">
          Premium Plan
        </h3>
        <p className="text-blue-300 mb-3">All features included</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl md:text-3xl font-bold">$19.99</span>{" "}
          {/* Adjusted font size */}
          <span className="text-blue-300">/month</span>
        </div>
        <div className="mt-4 flex items-center">
          <div className="bg-white/20 rounded-full h-2 flex-1">
            <div className="bg-gradient-to-r from-blue-400 to-purple-400 rounded-full h-2 w-2/3 animate-pulse"></div>
          </div>
          <span className="text-sm ml-2 text-blue-300 min-w-[80px] text-right">
            20 days left
          </span>{" "}
          {/* Ensure text doesn't wrap */}
        </div>
        <div className="mt-4 flex flex-col md:flex-row gap-2">
          {" "}
          {/* Stack buttons on small, row on medium+ */}
          <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 transition-all duration-300 rounded-lg px-4 py-2 text-sm font-medium flex-1 shadow-neon-sm">
            Renew Now
          </button>
          <button
            onClick={handleUpgradePlan}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white transition-all duration-300 rounded-lg px-4 py-2 text-sm font-medium flex-1 shadow-neon-sm"
          >
            Upgrade
          </button>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700/50 backdrop-blur-sm">
        <h3 className="font-medium text-gray-300 mb-3">Plan Features</h3>
        <ul className="space-y-3">
          {[
            "500+ Live TV Channels",
            "Full HD and 4K streaming",
            "Access on up to 5 devices",
            "7-day catch-up TV",
            "Premium sports and movies",
            "24/7 customer support",
          ].map((feature, index) => (
            <li key={index} className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mr-3 flex items-center justify-center shadow-neon-sm flex-shrink-0">
                {" "}
                {/* Prevent icon from shrinking */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-gray-300 text-sm md:text-base">
                {feature}
              </span>{" "}
              {/* Adjusted font size */}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700/50 backdrop-blur-sm">
        <h3 className="font-medium text-gray-300 mb-3">Payment History</h3>
        <div className="space-y-3">
          {[
            { date: "Apr 17, 2026", amount: "$19.99", status: "Paid" },
            { date: "Mar 17, 2026", amount: "$19.99", status: "Paid" },
            { date: "Feb 17, 2026", amount: "$19.99", status: "Paid" },
          ].map((payment, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-gray-700/50 last:border-0 flex-wrap gap-2" // Allow wrapping
            >
              <div>
                <p className="font-medium text-gray-300">{payment.date}</p>
                <p className="text-sm text-gray-500">{payment.amount}</p>
              </div>
              <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-full border border-green-700/30">
                {payment.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const HistoryTab = ({ userData, animationClass }) => {
  const [filterType, setFilterType] = useState("All Content");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock history data (consider fetching this from an API in a real app)
  const mockHistory = [
    {
      id: 1,
      type: "Live TV",
      name: "Sports Channel",
      channel: "Sports HD",
      thumbnail: "https://placehold.co/240x135/000000/FFFFFF?text=Sports",
      progress: 100,
      lastWatched: "2 hours ago",
      duration: "2h 30m",
    },
    {
      id: 2,
      type: "Movie",
      name: "Galaxy Raiders",
      channel: "Movie Network",
      thumbnail: "https://placehold.co/240x135/000000/FFFFFF?text=Movie",
      progress: 75,
      lastWatched: "Yesterday",
      duration: "2h 28m",
    },
    {
      id: 3,
      type: "News",
      name: "Evening News",
      channel: "News 24/7",
      thumbnail: "https://placehold.co/240x135/000000/FFFFFF?text=News",
      progress: 100,
      lastWatched: "3 days ago",
      duration: "1h",
    },
    {
      id: 4,
      type: "Series",
      name: "Quantum Leap S03E05",
      channel: "Drama Plus",
      thumbnail: "https://placehold.co/240x135/000000/FFFFFF?text=Series",
      progress: 50,
      lastWatched: "Last week",
      duration: "45m",
    },
    {
      id: 5,
      type: "Live TV",
      name: "Music Awards Live",
      channel: "Music Channel",
      thumbnail: "https://placehold.co/240x135/000000/FFFFFF?text=Music",
      progress: 100,
      lastWatched: "4 days ago",
      duration: "3h",
    },
    {
      id: 6,
      type: "Movie",
      name: "The Space Odyssey",
      channel: "Sci-Fi Channel",
      thumbnail: "https://placehold.co/240x135/000000/FFFFFF?text=SciFi",
      progress: 90,
      lastWatched: "5 days ago",
      duration: "2h 15m",
    },
  ];

  // Filtered history based on search and filter
  const filteredHistory = mockHistory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.channel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "All Content" || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className={`space-y-6 ${animationClass}`}>
      <h2 className="text-xl font-bold mb-4 text-blue-400">Watch History</h2>

      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800/70 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-200 placeholder-gray-500 text-sm" // Adjusted font size
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute right-3 top-2.5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex items-center w-full md:w-auto">
          <span className="text-sm text-gray-400 mr-2">Filter:</span>
          <select
            className="px-3 py-2 bg-gray-800/70 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-200 w-full md:w-auto text-sm" // Adjusted font size
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All Content">All Content</option>
            <option value="Live TV">Live TV</option>
            <option value="Movie">Movie</option>
            <option value="News">News</option>
            <option value="Series">Series</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((historyItem) => (
            <HistoryItem key={historyItem.id} historyItem={historyItem} />
          ))
        ) : (
          <div className="text-center text-gray-500">
            No history found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};
const HistoryItem = ({ historyItem }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg p-3 md:p-5 border border-gray-700/50 backdrop-blur-sm flex flex-col md:flex-row items-start md:items-center gap-3">
      {" "}
      {/* Stack on small, row on medium+ */}
      <img
        src={historyItem.thumbnail}
        alt={historyItem.name}
        className="w-full md:w-24 h-auto md:h-14 rounded-lg flex-shrink-0 object-cover" // Make image responsive
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "https://placehold.co/240x135/000000/FFFFFF?text=Image";
        }} // Fallback image
      />
      <div className="flex-1 w-full">
        {" "}
        {/* Ensure text container takes full width on small screens */}
        <h3 className="font-medium text-gray-300 text-base md:text-lg">
          {historyItem.name}
        </h3>{" "}
        {/* Adjusted font size */}
        <p className="text-sm text-gray-500">{historyItem.channel}</p>
        <p className="text-xs text-gray-400 mt-1">
          Last watched: {historyItem.lastWatched} | Duration:{" "}
          {historyItem.duration}
        </p>
      </div>
      <ProgressBar progress={historyItem.progress} />
    </div>
  );
};

const ProgressBar = ({ progress }) => {
  return (
    <div className="flex items-center gap-2 w-full md:w-32 md:ml-4 mt-2 md:mt-0">
      {" "}
      {/* Adjust width and margin */}
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 min-w-[40px] text-right">
        {progress}%
      </span>
    </div>
  );
};
// Add these components after the HistoryTab component

const DevicesTab = ({ userData, setUserData, animationClass }) => {
  return (
    <div className={`space-y-6 ${animationClass}`}>
      <h2 className="text-xl font-bold mb-4 text-blue-400">
        Connected Devices
      </h2>

      <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700/50 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
          {" "}
          {/* Stack on small, row on medium+ */}
          <h3 className="font-medium text-gray-300">Active Sessions</h3>
          <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center self-start md:self-center">
            {" "}
            {/* Align button */}
            <Plus size={16} className="mr-1" />
            Add Device
          </button>
        </div>

        <div className="space-y-4">
          {userData.devices.map((device) => (
            <div
              key={device.id}
              className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg hover:bg-gray-800/50 transition-colors flex-wrap gap-2" // Allow wrapping
            >
              <div>
                <p className="font-medium text-gray-200">{device.name}</p>
                <p className="text-sm text-gray-500">{device.lastActive}</p>
              </div>
              <button className="text-red-400 hover:text-red-300 text-sm">
                Revoke
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700/50 backdrop-blur-sm">
        <h3 className="font-medium text-gray-300 mb-3">Security Settings</h3>
        <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg flex-wrap gap-2">
          {" "}
          {/* Allow wrapping */}
          <span className="text-gray-300">Two-factor Authentication</span>
          <button className="text-blue-400 hover:text-blue-300 text-sm">
            Enable
          </button>
        </div>
      </div>
    </div>
  );
};

const SettingsTab = ({ userData, setUserData, animationClass }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...userData });

  const handleSave = () => {
    setUserData(formData);
    setEditMode(false);
  };

  return (
    <div className={`space-y-6 ${animationClass}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        {" "}
        {/* Stack on small, row on medium+ */}
        <h2 className="text-xl font-bold text-blue-400">Account Settings</h2>
        {editMode ? (
          <div className="flex gap-2 flex-wrap">
            {" "}
            {/* Allow buttons to wrap */}
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm flex items-center self-start md:self-center" // Align button
          >
            <Edit size={16} className="mr-2" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700/50 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {" "}
          {/* Use 1 column on small, 2 on medium+ */}
          <div>
            <label className="text-gray-400 text-sm">Full Name</label>
            {editMode ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-gray-900/70 border border-gray-700 rounded-lg p-2 text-gray-200 mt-1 text-sm" // Adjusted font size
              />
            ) : (
              <p className="text-gray-200 mt-1 text-sm md:text-base">
                {userData.name}
              </p> // Adjusted font size
            )}
          </div>
          <div>
            <label className="text-gray-400 text-sm">Email Address</label>
            {editMode ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-gray-900/70 border border-gray-700 rounded-lg p-2 text-gray-200 mt-1 text-sm" // Adjusted font size
              />
            ) : (
              <p className="text-gray-200 mt-1 text-sm md:text-base">
                {userData.email}
              </p> // Adjusted font size
            )}
          </div>
        </div>

        {editMode && (
          <div className="mt-4">
            <label className="text-gray-400 text-sm">Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full bg-gray-900/70 border border-gray-700 rounded-lg p-2 text-gray-200 mt-1 text-sm" // Adjusted font size
            />
          </div>
        )}
      </div>

      <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700/50 backdrop-blur-sm">
        <h3 className="text-gray-300 font-medium mb-3">Danger Zone</h3>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 bg-red-900/20 rounded-lg gap-3">
          {" "}
          {/* Stack on small, row on medium+ */}
          <div>
            <p className="text-red-400 font-medium">Delete Account</p>
            <p className="text-red-500 text-sm">
              This will permanently remove all your data
            </p>
          </div>
          <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm self-start md:self-center">
            {" "}
            {/* Align button */}
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};
