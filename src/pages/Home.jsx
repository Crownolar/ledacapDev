import { useAuth } from "../hooks/useAuth";
import { useSamples } from "../hooks/useSamples";
import { useTheme } from "../hooks/useTheme";
import AuthModal from "../components/auth/AuthModal";
import Dashboard from "../components/views/Dashboard";
import Database from "../components/views/Database";
import MapView from "../components/views/MapView";
import Reports from "../components/views/Reports";
import Agents from "../components/views/Agents";
import SampleFormModal from "../components/modals/SampleFormModal";
import SampleDetailModal from "../components/modals/SampleDetailModal";
import { useRef, useState } from "react";

const Home = () => {
  const {
    isAuthenticated,
    setIsAuthenticated,
    currentUser,
    setCurrentUser,
    authForm,
    setAuthForm,
    showPassword,
    setShowPassword,
    authMode,
    setAuthMode,
    handleLogin,
    handleSignup,
  } = useAuth();

  const { theme } = useTheme();
  const { analytics, filteredSamples, addSample } = useSamples(currentUser);
  const [currentView, setCurrentView] = useState("dashboard");
  const [showForm, setShowForm] = useState(false);
  const [selectedSample, setSelectedSample] = useState(null);
  const excelImportRef = useRef(null);

  const handleFormSubmit = (formData) => addSample(formData);

  if (!isAuthenticated) {
    return (
      <div className={`${theme.bg} min-h-screen`}>
        <AuthModal
          theme={theme}
          authMode={authMode}
          setAuthMode={setAuthMode}
          authForm={authForm}
          setAuthForm={setAuthForm}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          handleLogin={handleLogin}
          handleSignup={handleSignup}
          setCurrentUser={setCurrentUser}
          setIsAuthenticated={setIsAuthenticated}
        />
      </div>
    );
  }

  return (
    <>
      {currentView === "dashboard" && (
        <Dashboard analytics={analytics} theme={theme} />
      )}
      {currentView === "database" && <Database theme={theme} />}
      {currentView === "map" && <MapView theme={theme} />}
      {currentView === "reports" && <Reports theme={theme} />}
      {currentView === "agents" && <Agents theme={theme} />}
      {showForm && (
        <SampleFormModal
          theme={theme}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}
      {selectedSample && (
        <SampleDetailModal
          theme={theme}
          sample={selectedSample}
          onClose={() => setSelectedSample(null)}
        />
      )}
    </>
  );
};

export default Home;
