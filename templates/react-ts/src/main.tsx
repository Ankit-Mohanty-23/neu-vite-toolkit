import React from "react";
import ReactDOM from "react-dom/client";
import { init } from "@neutralinojs/lib";
import App from "./App";
import "./index.css";

// Initialize Neutralinojs before rendering the app
init();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
