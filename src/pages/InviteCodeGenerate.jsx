import {
  KeyRound,
  Users,
  Beaker,
  MessageSquare,
  Search,
  Filter,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const API_BASE_URL = "/api";

const InviteCodeGenerate = ({ theme = {} }) => {
  // Default theme if not provided
  const defaultTheme = {
    bg: "bg-gray-900",
    text: "text-gray-100",
    card: "bg-gray-800",
    border: "border-gray-700",
    textMuted: "text-gray-400",
  };

  const currentTheme = { ...defaultTheme, ...theme };

  const [activeTab, setActiveTab] = useState("invite");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Mock data for demonstration
  const [users] = useState([
    {
      id: 1,
      fullName: "John Doe",
      email: "john@example.com",
      role: "ADMIN",
      status: "active",
      joinedDate: "2024-01-15",
    },
    {
      id: 2,
      fullName: "Jane Smith",
      email: "jane@example.com",
      role: "HEAD_RESEARCHER",
      status: "active",
      joinedDate: "2024-02-20",
    },
    {
      id: 3,
      fullName: "Bob Johnson",
      email: "bob@example.com",
      role: "POLICY_MAKER",
      status: "inactive",
      joinedDate: "2024-03-10",
    },
    {
      id: 4,
      fullName: "Alice Williams",
      email: "alice@example.com",
      role: "ADMIN",
      status: "active",
      joinedDate: "2024-04-05",
    },
  ]);

  const [samples] = useState([
    {
      id: 1,
      name: "Sample A-001",
      type: "Water",
      location: "River Delta",
      status: "analyzed",
      submittedBy: "Jane Smith",
      date: "2024-10-15",
    },
    {
      id: 2,
      name: "Sample B-023",
      type: "Soil",
      location: "Industrial Zone",
      status: "pending",
      submittedBy: "John Doe",
      date: "2024-11-01",
    },
    {
      id: 3,
      name: "Sample C-045",
      type: "Air",
      location: "Urban Center",
      status: "in-progress",
      submittedBy: "Bob Johnson",
      date: "2024-11-05",
    },
    {
      id: 4,
      name: "Sample D-067",
      type: "Water",
      location: "Coastal Area",
      status: "analyzed",
      submittedBy: "Jane Smith",
      date: "2024-11-08",
    },
  ]);

  const [comments] = useState([
    {
      id: 1,
      user: "John Doe",
      sample: "Sample A-001",
      comment: "Results show elevated levels",
      date: "2024-10-16",
      status: "approved",
    },
    {
      id: 2,
      user: "Jane Smith",
      sample: "Sample B-023",
      comment: "Requires further analysis",
      date: "2024-11-02",
      status: "pending",
    },
    {
      id: 3,
      user: "Bob Johnson",
      sample: "Sample C-045",
      comment: "Data collection incomplete",
      date: "2024-11-06",
      status: "flagged",
    },
    {
      id: 4,
      user: "Alice Williams",
      sample: "Sample D-067",
      comment: "Within acceptable parameters",
      date: "2024-11-09",
      status: "approved",
    },
  ]);

  const handleGenerateInviteCode = async (role) => {
    setInviteLoading(true);
    setGeneratedCode("");
    setMessage("");

    try {
      const token = localStorage.getItem("accessToken");

      const res = await axios.post(
        `${API_BASE_URL}/auth/generate`,
        { role: role.toUpperCase() },
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

  const getStatusBadge = (status) => {
    const statusStyles = {
      active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
      inactive: "bg-red-500/20 text-red-400 border-red-500/50",
      analyzed: "bg-blue-500/20 text-blue-400 border-blue-500/50",
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
      "in-progress": "bg-purple-500/20 text-purple-400 border-purple-500/50",
      approved: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
      flagged: "bg-orange-500/20 text-orange-400 border-orange-500/50",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs border ${
          statusStyles[status] || statusStyles.pending
        }`}
      >
        {status}
      </span>
    );
  };

  const tabs = [
    { id: "invite", label: "Invite Codes", icon: KeyRound },
    { id: "users", label: "Users", icon: Users },
    { id: "samples", label: "Samples", icon: Beaker },
    { id: "comments", label: "Comments", icon: MessageSquare },
  ];

  return (
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent mb-2">
            Super Admin Dashboard
          </h1>
          <p className={currentTheme.textMuted}>
            Manage users, samples, and system settings
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                    : `${currentTheme.card} ${currentTheme.text} hover:bg-gray-700`
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div
          className={`${currentTheme.card} rounded-2xl shadow-xl border ${currentTheme.border} p-6`}
        >
          {/* Invite Codes Tab */}
          {activeTab === "invite" && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <KeyRound className="text-emerald-500" /> Generate Invite Codes
              </h2>
              <p className={`text-sm mb-6 ${currentTheme.textMuted}`}>
                Generate secure invite codes for different user roles.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                {["POLICY_MAKER", "HEAD_RESEARCHER", "ADMIN"].map((role) => (
                  <button
                    key={role}
                    onClick={() => handleGenerateInviteCode(role)}
                    disabled={inviteLoading}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
                  >
                    {inviteLoading
                      ? "Generating..."
                      : `Generate ${role.replace(/_/g, " ")}`}
                  </button>
                ))}
              </div>

              {generatedCode && (
                <div className="p-4 bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border border-emerald-500/50 rounded-lg">
                  <p className="text-xs text-emerald-400 mb-2">
                    Generated Code:
                  </p>
                  <p className="text-emerald-300 font-mono text-lg text-center">
                    {generatedCode}
                  </p>
                </div>
              )}

              <button
                onClick={() => navigate("/dashboard")}
                className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-medium"
              >
                Go to Dashboard
              </button>

              {message && (
                <p className="text-sm mt-4 text-center text-emerald-400">
                  {message}
                </p>
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Users className="text-emerald-500" /> User Management
                </h2>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-emerald-400">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-emerald-400">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-emerald-400">
                        Role
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-emerald-400">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-emerald-400">
                        Joined
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-emerald-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-700/50 hover:bg-gray-700/30 transition"
                      >
                        <td className="py-3 px-4">{user.fullName}</td>
                        <td className="py-3 px-4 text-sm text-gray-400">
                          {user.email}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-400">
                          {user.joinedDate}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2 justify-center">
                            <button className="p-1 hover:bg-emerald-500/20 rounded transition">
                              <Eye size={16} className="text-emerald-400" />
                            </button>
                            <button className="p-1 hover:bg-blue-500/20 rounded transition">
                              <Edit size={16} className="text-blue-400" />
                            </button>
                            <button className="p-1 hover:bg-red-500/20 rounded transition">
                              <Trash2 size={16} className="text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Samples Tab */}
          {activeTab === "samples" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Beaker className="text-emerald-500" /> Sample Management
                </h2>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg text-sm hover:bg-gray-600 transition">
                    <Filter size={16} />
                    Filter
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                {samples.map((sample) => (
                  <div
                    key={sample.id}
                    className="p-4 bg-gradient-to-r from-gray-700/50 to-gray-700/30 rounded-lg border border-gray-600 hover:border-emerald-500/50 transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{sample.name}</h3>
                        <p className="text-sm text-gray-400">
                          Type: {sample.type} | Location: {sample.location}
                        </p>
                      </div>
                      {getStatusBadge(sample.status)}
                    </div>
                    <div className="flex justify-between items-center mt-3 text-sm">
                      <span className="text-gray-400">
                        Submitted by:{" "}
                        <span className="text-emerald-400">
                          {sample.submittedBy}
                        </span>
                      </span>
                      <span className="text-gray-500">{sample.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === "comments" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MessageSquare className="text-emerald-500" /> Comment
                  Moderation
                </h2>
              </div>

              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 bg-gray-700/50 rounded-lg border border-gray-600"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                          {comment.user.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold">{comment.user}</p>
                          <p className="text-xs text-gray-400">
                            on {comment.sample}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(comment.status)}
                    </div>
                    <p className="text-gray-300 mb-3">{comment.comment}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {comment.date}
                      </span>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30 transition text-sm">
                          <CheckCircle size={14} />
                          Approve
                        </button>
                        <button className="flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition text-sm">
                          <XCircle size={14} />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InviteCodeGenerate;
