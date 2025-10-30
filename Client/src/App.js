import "./App.css";
import { Routes, Route } from "react-router-dom";

import ContactUs from "./client/ContactUs";
import FAQ from "./client/faq";
import Footer from "./components/footer";
import FreeTrial from "./client/FreeTrial";
import Hero from "./client/hero";
import IPTVChannels from "./client/IPTVCHANNELS";
import Navbar from "./components/navbar";
import Pricing from "./client/pricing";
import Tutorial from "./client/tutorialSteps";
import Client from "./client/login-regiser";
import Profile from "./client/profile";

const HomePage = () => {
  return (
    <>
      {/* Ensure your sections have IDs matching Navbar links for smooth scrolling */}
      <Hero />
      <Pricing />
      <IPTVChannels />
      <FreeTrial />
      <Tutorial />
      <FAQ />
      <ContactUs />
      <Footer />
    </>
  );
};

function App() {
  return (
    // BrowserRouter is now in index.js, do NOT include it here
    <div className="App">
      {/* Navbar is placed here so it appears on all routes */}
      <Navbar />

      <main>
        <Routes>
          {/* Route for the Home page */}
          <Route path="/" element={<HomePage />} />

          {/* Route for the Client login/register page */}
          <Route path="/client" element={<Client />} />
          <Route path="/profile" element={<Profile />} />

          {/* Route for the Pricing page */}
          <Route path="/pricing" element={<Pricing />} />

          {/* Add more routes as needed */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
