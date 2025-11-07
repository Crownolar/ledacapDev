import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";

const lightTheme = {
  bg: "bg-gray-100",
  text: "text-gray-900",
  textMuted: "text-gray-500",
  card: "bg-white",
  border: "border-gray-200",
  input: "bg-white text-gray-900 border-gray-300",
  hover: "hover:bg-gray-200",
};

const darkTheme = {
  bg: "bg-gray-900",
  text: "text-white",
  textMuted: "text-gray-400",
  card: "bg-gray-800",
  border: "border-gray-700",
  input: "bg-gray-700 text-white border-gray-600",
  hover: "hover:bg-gray-700",
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
