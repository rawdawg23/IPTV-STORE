// src/Home.jsx
import React from 'react';
import Hero from './hero'; // Make sure these paths are correct relative to Home.jsx
import Pricing from './pricing';
import IPTVChannels from './IPTVCHANNELS';

const Home = () => {
  return (
    <>
      {/* Render the components that make up your home page */}
      <Hero />
      <Pricing />
      <IPTVChannels />
      {/* Add any other components you want on your home page */}
    </>
  );
};

export default Home;