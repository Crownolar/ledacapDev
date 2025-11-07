import React, { useState } from "react";
import { KeyRound } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ✅ Use full API URL (not relative)
const API_BASE_URL = "/api";

const InviteCodeGenerate = ({ theme }) => {
  const [inviteLoading, setInviteLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleGenerateInviteCode = async (role) => {
    setInviteLoading(true);
    setGeneratedCode("");
    setMessage("");

    try {
      const token = localStorage.getItem("accessToken");

      const res = await axios.post(
        `${API_BASE_URL}/auth/generate`,
        { role: role.toUpperCase() }, // ✅ Ensure uppercase as docs require
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const code = res.data.data.code;
      setGeneratedCode(code);

      await navigator.clipboard.writeText(code);
      setMessage(`✅ Invite code for ${role} copied to clipboard!`);
    } catch (err) {
      console.error("Error response:", err.response?.data);
      setMessage(
        err.response?.data?.message ||
          "❌ Failed to generate invite code. Check your token or permissions."
      );
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen ${theme.bg} ${theme.text} flex items-center justify-center p-6`}
    >
      <div
        className={`${theme.card} p-8 rounded-2xl shadow-xl border ${theme.border} max-w-md w-full`}
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <KeyRound className="text-emerald-500" /> Generate Invite Codes
        </h2>
        <p className={`text-sm mb-6 ${theme.textMuted}`}>
          Welcome, {currentUser?.fullName || "Super Admin"}.
          Generate invite codes for other roles below.
        </p>

        <div className="flex flex-col gap-2">
          {["POLICY_MAKER", "HEAD_RESEARCHER", "ADMIN"].map((role) => (
            <button
              key={role}
              onClick={() => handleGenerateInviteCode(role)}
              disabled={inviteLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm transition"
            >
              {inviteLoading ? "Generating..." : `Generate for ${role}`}
            </button>
          ))}
        </div>

        {generatedCode && (
          <div className="mt-4 p-3 bg-gray-800 text-green-400 rounded-lg text-center text-sm">
            {generatedCode}
          </div>
        )}

        {message && (
          <p className="text-sm mt-3 text-center text-emerald-400">{message}</p>
        )}

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-medium"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default InviteCodeGenerate;
