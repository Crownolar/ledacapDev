// import { useAuth } from "../hooks/useAuth";
// import { useSamples } from "../hooks/useSamples";
// import { useTheme } from "../hooks/useTheme";
// import AuthModal from "../components/auth/AuthModal";
// import Dashboard from "../components/views/Dashboard";
// import Sidebar from "../components/layout/Sidebar";
// import Header from "../components/layout/Header";
// import { useRef, useState } from "react";
// import Database from "../components/views/Database";
// import MapView from "../components/views/MapView";
// import Reports from "../components/views/Reports";
// import Agents from "../components/views/Agents";
// import SampleFormModal from "../components/modals/SampleFormModal";
// import SampleDetailModal from "../components/modals/SampleDetailModal";

// const Home = () => {
//   const {
//     isAuthenticated,
//     setIsAuthenticated,
//     currentUser,
//     setCurrentUser,
//     authForm,
//     setAuthForm,
//     showPassword,
//     setShowPassword,
//     authMode,
//     setAuthMode,
//     handleLogin,
//     handleSignup,
//     handleLogout,
//   } = useAuth();

//   const { theme, darkMode, toggleDarkMode } = useTheme();

//   const {
//     analytics,
//     filteredSamples,
//     addSample,
//     importSamples,
//     searchTerm,
//     setSearchTerm,
//     filterState,
//     setFilterState,
//     filterProduct,
//     setFilterProduct,
//     filterStatus,
//     setFilterStatus,
//     setSelectedSample,
//     selectedSample,
//     sample,
//   } = useSamples(currentUser);

//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [currentView, setCurrentView] = useState("dashboard");
//   const [showForm, setShowForm] = useState(false);
//   const excelImportRef = useRef(null);
//   const [samples, setSamples] = useState([]);

//   const handleFormSubmit = (formData) => {
//     addSample(formData);
//   };

//   if (!isAuthenticated) {
//     return (
//       <div className={`${theme.bg} min-h-screen`}>
//         <AuthModal
//           theme={theme}
//           authMode={authMode}
//           setAuthMode={setAuthMode}
//           authForm={authForm}
//           setAuthForm={setAuthForm}
//           showPassword={showPassword}
//           setShowPassword={setShowPassword}
//           handleLogin={handleLogin}
//           handleSignup={handleSignup}
//           setCurrentUser={setCurrentUser}
//           setIsAuthenticated={setIsAuthenticated}
//         />
//       </div>
//     );
//   }

//   return (
//     <div className={`${theme.bg} min-h-screen flex flex-col`}>
//       <Header
//         theme={theme}
//         currentUser={currentUser}
//         darkMode={darkMode}
//         toggleDarkMode={toggleDarkMode}
//         handleLogout={handleLogout}
//         mobileMenuOpen={mobileMenuOpen}
//         setMobileMenuOpen={setMobileMenuOpen}
//       />

//       <div className="flex flex-1">
//         <Sidebar
//           theme={theme}
//           mobileMenuOpen={mobileMenuOpen}
//           setMobileMenuOpen={setMobileMenuOpen}
//           currentView={currentView}
//           setCurrentView={setCurrentView}
//           darkMode={darkMode}
//           setShowForm={setShowForm}
//           excelImportRef={excelImportRef}
//         />

//         <main className={`flex-1 p-6 overflow-y-auto ${theme.bg}`}>
//           {currentView === "dashboard" && (
//             <Dashboard
//               analytics={analytics}
//               theme={theme}
//               darkMode={darkMode}
//             />
//           )}
//           {currentView === "database" && (
//             <Database
//               theme={theme}
//               searchTerm={searchTerm}
//               setSearchTerm={setSearchTerm}
//               filterState={filterState}
//               setFilterState={setFilterState}
//               filterProduct={filterProduct}
//               setFilterProduct={setFilterProduct}
//               filterStatus={filterStatus}
//               setFilterStatus={setFilterStatus}
//               filteredSamples={filteredSamples}
//               setSelectedSample={setSelectedSample}
//             />
//           )}
//           {currentView === "map" && (
//             <MapView theme={theme} samples={filteredSamples} />
//           )}
//           {currentView === "reports" && (
//             <Reports
//               theme={theme}
//               samples={filteredSamples}
//               analytics={analytics}
//             />
//           )}
//           {currentView === "agents" && (
//             <Agents theme={theme} samples={filteredSamples} />
//           )}
//           {showForm && (
//             <SampleFormModal
//               theme={theme}
//               onClose={() => setShowForm(false)}
//               onSubmit={handleFormSubmit}
//               samples={sample}
//             />
//           )}
//           ;
//           {selectedSample && (
//             <SampleDetailModal
//               theme={theme}
//               sample={selectedSample}
//               onClose={() => setSelectedSample(null)}
//             />
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Home;

// src/pages/Home.jsx
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
