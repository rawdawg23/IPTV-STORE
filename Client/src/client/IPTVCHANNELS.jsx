import React, { useState, useEffect } from "react";
import api from "../api";

// Default channel data to use if API fails (stable reference for useEffect)
const defaultChannels = [
    {
      id: "ch1",
      name: "Sports HD",
      logo: "https://via.placeholder.com/150?text=Sports+HD",
      description: "24/7 sports coverage from around the world",
      categories: ["sports"],
      languages: ["English"],
      quality: "HD",
      premium: true
    },
    {
      id: "ch2",
      name: "Movie Central",
      logo: "https://via.placeholder.com/150?text=Movie+Central",
      description: "Latest blockbusters and classic films",
      categories: ["movies", "entertainment"],
      languages: ["English", "Spanish"],
      quality: "FHD",
      premium: true
    },
    {
      id: "ch3",
      name: "News 24",
      logo: "https://via.placeholder.com/150?text=News+24",
      description: "Breaking news and current events",
      categories: ["news"],
      languages: ["English"],
      quality: "HD",
      premium: false
    },
    {
      id: "ch4",
      name: "Entertainment Plus",
      logo: "https://via.placeholder.com/150?text=Entertainment+Plus",
      description: "Reality shows, series and entertainment",
      categories: ["entertainment"],
      languages: ["English"],
      quality: "HD",
      premium: false
    }
  ];

const IPTVChannels = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [channelData, setChannelData] = useState([]);
  const [error, setError] = useState(null);

  const categories = [
    { id: "all", name: "All" },
    { id: "entertainment", name: "Entertainment" },
    { id: "sports", name: "Sports" },
    { id: "news", name: "News" },
    { id: "movies", name: "Movies" },
  ];

  // Fetch channel data from the backend API
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/api/channels");
        console.log("Channels data received:", response.data);
        if (Array.isArray(response.data) && response.data.length > 0) {
          setChannelData(response.data);
        } else {
          console.error("Invalid channel data format or empty array:", response.data);
          setChannelData(defaultChannels);
          setError("Using default channel data");
        }
      } catch (err) {
        console.error("API Error:", err);
        setChannelData(defaultChannels);
        setError("Failed to load channels from server. Using default data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchChannels();
  }, [defaultChannels]);

  const filteredChannels = channelData.filter((channel) => {
    const matchesCategory =
      activeCategory === "all" || channel.categories.includes(activeCategory);
    const matchesSearch = channel.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryCount = (categoryId) => {
    if (categoryId === "all") return channelData.length;
    return channelData.filter((channel) =>
      channel.categories.includes(categoryId)
    ).length;
  };

  const handleChannelClick = (channel) => {
    setSelectedChannel(channel);
  };

  const handleWatchNowClick = (e) => {
    e.stopPropagation();
    setSelectedChannel(null);
    window.location.href = "#pricing";
  };

  const handleRequestChannels = () => {
    window.location.href = "#contact";
  };

  const ChannelDetailModal = () => {
    if (!selectedChannel) return null;

    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-xl max-w-2xl w-full overflow-hidden border border-gray-700">
          <div className="relative h-48 bg-gray-800 flex items-center justify-center">
            <img
              src={selectedChannel.logo}
              alt={selectedChannel.name}
              className="max-h-full object-contain px-6"
            />
            {selectedChannel.premium && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-sm text-white px-3 py-1 rounded-full font-bold">
                PREMIUM
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">
                {selectedChannel.name}
              </h2>
              <div className="flex items-center text-sm text-gray-400">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {selectedChannel.viewers.toLocaleString()} viewers
              </div>
            </div>

            <p className="text-gray-300 mb-6">{selectedChannel.description}</p>

            <div className="flex items-center mb-6 bg-gray-800 p-3 rounded-lg">
              <div className="flex-shrink-0 w-3 h-3 rounded-full bg-green-500 mr-3 animate-pulse"></div>
              <span className="text-gray-300">
                Now Playing:{" "}
                <span className="text-white font-medium">
                  {selectedChannel.currentlyPlaying}
                </span>
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {selectedChannel.categories.map((cat) => {
                const category = categories.find((c) => c.id === cat);
                return (
                  <span
                    key={cat}
                    className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm"
                  >
                    {category ? category.name : cat}
                  </span>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2"
                onClick={handleWatchNowClick}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Watch Now
              </button>
              <button
                className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg"
                onClick={() => setSelectedChannel(null)}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Add default channels if API fails
  useEffect(() => {
    if (!isLoading && channelData.length === 0 && error) {
      // Create some default channels as fallback
      const defaultChannels = [
        {
          _id: "default1",
          name: "Sports Channel",
          logo: "https://via.placeholder.com/150",
          categories: ["sports"],
          currentlyPlaying: "Live Sports Event",
          description: "24/7 sports coverage",
          language: "English",
          viewers: 1500,
          premium: false
        },
        {
          _id: "default2",
          name: "Movie Central",
          logo: "https://via.placeholder.com/150",
          categories: ["movies", "entertainment"],
          currentlyPlaying: "Action Movie",
          description: "Premium movie channel",
          language: "English",
          viewers: 2500,
          premium: true
        },
        {
          _id: "default3",
          name: "News 24/7",
          logo: "https://via.placeholder.com/150",
          categories: ["news"],
          currentlyPlaying: "Breaking News",
          description: "Latest news coverage",
          language: "English",
          viewers: 1200,
          premium: false
        }
      ];
      setChannelData(defaultChannels);
      setError(""); // Clear error since we're using fallback data
    }
  }, [isLoading, error, channelData.length]);

  return (
    <section id="channels" className="py-16 relative bg-gray-950 min-h-screen">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            <span className="text-blue-400">Explore</span> Our Channels
          </h2>
          <p className="text-gray-300 max-w-lg mx-auto mb-6">
            Access over 1000+ live TV channels in HD quality.
          </p>

          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search channels..."
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <div className="md:w-48">
              <select
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({getCategoryCount(category.id)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="hidden md:flex flex-wrap justify-center gap-2 mt-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  px-4 py-1 rounded-lg font-medium transition-all duration-200
                  ${
                    activeCategory === category.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }
                `}
              >
                {category.name} ({getCategoryCount(category.id)})
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-blue-400 font-medium">Loading channels...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredChannels.map((channel) => (
                <div
                  key={channel._id} // Use _id from MongoDB
                  className="bg-gray-900/80 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-all duration-200 border border-gray-800 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10"
                  onClick={() => handleChannelClick(channel)}
                >
                  <div className="relative aspect-video bg-gray-800 flex items-center justify-center p-4">
                    {channel.premium && (
                      <div className="absolute top-2 right-2 bg-amber-500 text-xs text-white px-2 py-0.5 rounded-full font-medium z-10">
                        PREMIUM
                      </div>
                    )}

                    <img
                      src={channel.logo}
                      alt={channel.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>

                  <div className="p-3">
                    <h3 className="font-bold text-white mb-1 truncate">
                      {channel.name}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></div>
                      <span className="truncate">
                        {channel.currentlyPlaying}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredChannels.length === 0 && (
              <div className="text-center py-12 bg-gray-900/30 rounded-xl my-8">
                <svg
                  className="w-12 h-12 text-gray-500 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <h3 className="text-xl font-medium text-white mb-2">
                  No channels found
                </h3>
                <p className="text-gray-400 mb-4">
                  Try adjusting your search or filters
                </p>
                <button
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                >
                  Reset Filters
                </button>
              </div>
            )}

            {filteredChannels.length > 0 &&
              filteredChannels.length < channelData.length && (
                <div className="flex justify-center mt-8">
                  <button
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-all duration-200"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("all");
                    }}
                  >
                    Show All Channels
                  </button>
                </div>
              )}
          </>
        )}

        <div className="mt-12 bg-gray-900/50 border border-gray-800 rounded-lg p-6 max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="max-w-xl mx-auto text-center sm:text-left">
              <h3 className="text-xl font-bold text-white mb-2">
                Can't find what you're looking for?
              </h3>
              <p className="text-gray-400 mb-4">
                Our library includes over 1000+ channels. Request specific
                channels or packages.
              </p>
              <button
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white py-2 px-6 rounded-lg transition-all duration-200 mx-auto sm:mx-0"
                onClick={handleRequestChannels}
              >
                Request Channels
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedChannel && <ChannelDetailModal />}
    </section>
  );
};

export default IPTVChannels;
