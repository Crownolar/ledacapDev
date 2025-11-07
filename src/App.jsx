import Dashboard from "./components/views/Dashboard";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./Route/PrivateRoute";
import Layout from "./Route/Layout";
import AuthModal from "./components/auth/AuthModal";
import InviteCodeGenerate from "./pages/InviteCodeGenerate";
import { useState } from "react";
import { useAuth } from "./context/AuthContext";

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

const App = () => {
  const { currentUser, handleLogout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <div>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthModal theme={theme} />} />

        {/* Protected routes */}
        <Route
          path="/invitecodes"
          element={
            <PrivateRoute>
              <InviteCodeGenerate theme={theme} />
            </PrivateRoute>
          }
        />

        {/* ✅ Layout wraps protected pages */}
        <Route
          element={
            <Layout
              theme={theme}
              currentUser={currentUser}
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
              handleLogout={handleLogout}
            />
          }
        >
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
