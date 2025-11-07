import React, { useState } from "react";
import { AlertTriangle, Eye, EyeOff, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const API_BASE_URL = "/api";

const AuthModal = ({ theme }) => {
  const {
    authForm,
    setAuthForm,
    showPassword,
    setShowPassword,
    authMode,
    setAuthMode,
    handleLogin,
    handleSignup,
    loading,
    currentUser,
  } = useAuth();

  const [message, setMessage] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (authMode === "login") {
      const res = await handleLogin(authForm.email, authForm.password);
      if (res.success) {
        setMessage(
          `Welcome back, ${res.user.fullName || "User"}! Redirecting...`
        );
             setTimeout(() => {
              const role = res.user?.role?.toLowerCase();
      if (role === "super_admin" || role === "superadmin") {
        navigate("/invitecodes", { state: { user: res.user } });
      } else {
        navigate("/dashboard", { state: { user: res.user } });
      }
    }, 1000);
  } else {
    setMessage(res.message);
  }
  
    } else {
      const res = await handleSignup(authForm);
      setMessage(res.message);
      if (res.success) setAuthMode("login");
    }
  };

  const handleGenerateInviteCode = async (role) => {
    setInviteLoading(true);
    setGeneratedCode("");
    setMessage("");

    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post(
        `${API_BASE_URL}/invite-codes`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const code = res.data.data.code;
      setGeneratedCode(code);
      await navigator.clipboard.writeText(code);
      setMessage(`Invite code for ${role} copied to clipboard!`);
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Failed to generate invite code. Check your token or permissions."
      );
    } finally {
      setInviteLoading(false);
    }
  };

  const isSuperAdmin =
    currentUser?.role?.toLowerCase?.() === "super_admin" ||
    currentUser?.role?.toLowerCase?.() === "superadmin";

  return (
    <div
      className={`min-h-screen ${theme.bg} ${theme.text} flex items-center justify-center p-4`}
    >
      <div
        className={`${theme.card} rounded-lg shadow-xl max-w-md w-full p-8 border ${theme.border}`}
      >
        <div className="text-center mb-8">
          <div className="bg-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-white">LEDAcap</h1>
          <p className={`text-sm ${theme.textMuted}`}>
            Lead Exposure Detection & Capacity Platform
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          {["login", "signup"].map((mode) => (
            <button
              key={mode}
              onClick={() => setAuthMode(mode)}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                authMode === mode
                  ? "bg-emerald-500 text-white"
                  : `${theme.hover}`
              }`}
            >
              {mode === "login" ? "Login" : "Sign Up"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === "signup" && (
            <>
              <Input
                label="Full Name"
                value={authForm.name || ""}
                onChange={(e) =>
                  setAuthForm({ ...authForm, name: e.target.value })
                }
                placeholder="John Doe"
                theme={theme}
              />
              <Input
                label="Invite Code"
                value={authForm.inviteCode || ""}
                onChange={(e) =>
                  setAuthForm({ ...authForm, inviteCode: e.target.value })
                }
                placeholder="Enter invite code"
                theme={theme}
              />
            </>
          )}

          <Input
            label="Email"
            type="email"
            value={authForm.email}
            onChange={(e) =>
              setAuthForm({ ...authForm, email: e.target.value })
            }
            placeholder="user@ledacap.ng"
            theme={theme}
          />

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme.text}`}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={authForm.password}
                onChange={(e) =>
                  setAuthForm({ ...authForm, password: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg ${theme.input}`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme.textMuted}`}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-lg transition-colors ${
              loading && "opacity-60 cursor-not-allowed"
            }`}
          >
            {loading
              ? authMode === "login"
                ? "Logging in..."
                : "Signing up..."
              : authMode === "login"
              ? "Login"
              : "Sign Up"}
          </button>
        </form>

        {message && (
          <p className="text-sm text-center mt-3 text-emerald-400">{message}</p>
        )}

      </div>
    </div>
  );
};

// Reusable Input Component
const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  theme,
}) => (
  <div>
    <label className={`block text-sm font-medium mb-2 ${theme.text}`}>
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-2 border rounded-lg ${theme.input}`}
      required
    />
  </div>
);

export default AuthModal;
