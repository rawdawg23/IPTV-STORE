import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

import "./i18n";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {" "}
    <BrowserRouter>
      {" "}
      {/* This is the single, top-level Router */}{" "}
      {/* Wrap your App component with I18nextProvider */}
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>{" "}
    </BrowserRouter>{" "}
  </React.StrictMode>
);

reportWebVitals();
