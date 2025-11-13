import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AppcontextProvider } from "./contexts/Appcontext";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppcontextProvider>
        <App />
      </AppcontextProvider>
    </BrowserRouter>
  </StrictMode>
);
