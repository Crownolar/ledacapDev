import { useEffect, useState } from "react";
import { ArrowLeft, MessageSquare, Send, Loader, Lock, MapPin, Hash, Calendar, Tag } from "lucide-react";
import Comments from "./Comments";
import api from "../../utils/api";
import { useSelector } from "react-redux";

function CommentSection({ commentSectionView, setCommentSectionView }) {
  const { sample } = commentSectionView;
  const { currentUser } = useSelector((state) => state.auth);

  const COMMENT_ROLES = [
    "SUPER_ADMIN",
    "HEAD_RESEARCHER",
    "SUPERVISOR",
    "POLICY_MAKER_SON",
    "POLICY_MAKER_NAFDAC",
    "POLICY_MAKER_RESOLVE",
    "POLICY_MAKER_UNIVERSITY",
  ];

  const canComment = COMMENT_ROLES.includes(currentUser?.role);
  const [fetchedComments, setFetchedComments] = useState([]);
  const [requestMessage, setRequestMessage] = useState({ error: false, loading: false });
  const [writtenComment, setWrittenComment] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmitComment = async () => {
    if (!writtenComment.trim()) return;
    try {
      setRequestMessage((prev) => ({ ...prev, loading: true }));
      await api.post(`/samples/${sample.id}/comments`, { commentText: writtenComment });
      setWrittenComment("");
      await fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
      setRequestMessage((prev) => ({ ...prev, loading: false, error: true }));
    }
  };

  const fetchComments = async () => {
    setRequestMessage((prev) => ({ ...prev, loading: true }));
    try {
      await api
        .get(`/samples/${sample.id}/comments`)
        .then((result) => result.data.data)
        .then((comments) => setFetchedComments(comments));
      setRequestMessage((prev) => ({ ...prev, loading: false }));
    } catch {
      setRequestMessage((prev) => ({ ...prev, loading: false, error: true }));
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const metaFields = [
    {
      icon: <Hash className="w-3.5 h-3.5" />,
      label: "Sample ID",
      value: sample.sampleId,
      mono: true,
      span: "col-span-2 sm:col-span-1",
    },
    {
      icon: <Tag className="w-3.5 h-3.5" />,
      label: "Code",
      value: sample.code,
      mono: true,
      span: "col-span-2 sm:col-span-1",
    },
    {
      icon: <MapPin className="w-3.5 h-3.5" />,
      label: "Location",
      value: sample?.lga?.name
        ? `${sample.lga.name}, ${sample?.state?.name}`
        : sample?.state?.name,
      span: "col-span-2 sm:col-span-1",
    },
    {
      icon: <Calendar className="w-3.5 h-3.5" />,
      label: "GPS Coordinates",
      value:
        sample.gpsLatitude && sample.gpsLongitude
          ? `${parseFloat(sample.gpsLatitude).toFixed(6)}, ${parseFloat(sample.gpsLongitude).toFixed(6)}`
          : "—",
      mono: true,
      span: "col-span-2 sm:col-span-1",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">

      {/* Top nav bar */}
      <div className="sticky top-0 z-10 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <button
            onClick={() => setCommentSectionView({ isOpen: false, sample: null })}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-150 group"
          >
            <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors duration-150">
              <ArrowLeft className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-medium hidden sm:inline">Back to Samples</span>
          </button>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          <p className="text-xs text-gray-500 truncate hidden sm:block">
            Sample&nbsp;<span className="text-gray-300 font-mono">{sample.sampleId?.slice(0, 8)}…</span>
          </p>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {fetchedComments.length} {fetchedComments.length === 1 ? "comment" : "comments"}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-5">

        {/* Sample Meta Card */}
        <div className="rounded-2xl bg-gray-900 border border-white/5 overflow-hidden">
          {/* Card header */}
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white tracking-wide">Sample Information</h2>
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
              #{sample.id?.slice(-8)}
            </span>
          </div>

          {/* Fields grid */}
          <div className="p-5 grid grid-cols-2 sm:grid-cols-2 gap-4">
            {metaFields.map((field, i) => (
              <div key={i} className={`${field.span} space-y-1.5`}>
                <div className="flex items-center gap-1.5 text-gray-500">
                  {field.icon}
                  <span className="text-[10px] font-semibold uppercase tracking-widest">{field.label}</span>
                </div>
                <p
                  className={`text-sm font-medium text-gray-100 break-all leading-relaxed ${
                    field.mono ? "font-mono text-xs text-emerald-300" : ""
                  }`}
                >
                  {field.value || "—"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Comments Card */}
        <div className="rounded-2xl bg-gray-900 border border-white/5 overflow-hidden">

          {/* Card header */}
          <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <h2 className="text-sm font-semibold text-white">Comments & Remarks</h2>
          </div>

          {/* Comments list */}
          <div className="px-5 py-4 min-h-[220px] max-h-[420px] overflow-y-auto space-y-1 custom-scroll">

            {requestMessage.loading && (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader className="w-5 h-5 text-emerald-400 animate-spin" />
                <p className="text-xs text-gray-500">Loading comments…</p>
              </div>
            )}

            {requestMessage.error && !requestMessage.loading && (
              <div className="flex flex-col items-center justify-center py-16 gap-2">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-red-400 font-medium">Failed to load comments</p>
                <button
                  onClick={fetchComments}
                  className="text-xs text-gray-500 hover:text-white transition-colors underline underline-offset-2"
                >
                  Try again
                </button>
              </div>
            )}

            {!requestMessage.loading && !requestMessage.error && fetchedComments.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 gap-2">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                </div>
                <p className="text-sm text-gray-500 font-medium">No comments yet</p>
                <p className="text-xs text-gray-600">Be the first to leave a remark</p>
              </div>
            )}

            {!requestMessage.loading && fetchedComments.length > 0 && (
              <div className="space-y-2 py-1">
                {fetchedComments.map((comment) => (
                  <Comments key={comment.id} comment={comment} fetchComments={fetchComments} />
                ))}
              </div>
            )}
          </div>

          {/* Add Comment input */}
          <div className="px-5 pb-5 pt-3 border-t border-white/5">
            {!canComment ? (
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/15">
                <Lock className="w-4 h-4 text-amber-400/70 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-300/70 leading-relaxed">
                  Only supervisors, researchers, and policy makers can add comments.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
                  Add Remark
                </label>
                <div
                  className={`flex items-end gap-2 rounded-xl border transition-colors duration-150 bg-gray-800/60 px-3 py-2 ${
                    isFocused ? "border-emerald-500/40" : "border-white/5 hover:border-white/10"
                  }`}
                >
                  <textarea
                    rows={2}
                    placeholder="Write your comment or remark…"
                    className="flex-1 bg-transparent text-sm text-gray-100 placeholder-gray-600 resize-none outline-none leading-relaxed"
                    value={writtenComment}
                    onChange={(e) => setWrittenComment(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey && writtenComment.trim()) {
                        e.preventDefault();
                        handleSubmitComment();
                      }
                    }}
                  />
                  <button
                    onClick={handleSubmitComment}
                    disabled={!writtenComment.trim() || requestMessage.loading}
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-500 text-white shadow-lg shadow-emerald-500/20 disabled:shadow-none"
                  >
                    {requestMessage.loading
                      ? <Loader className="w-3.5 h-3.5 animate-spin" />
                      : <Send className="w-3.5 h-3.5" />
                    }
                  </button>
                </div>
                <p className="text-[10px] text-gray-600">Press Enter to submit · Shift+Enter for new line</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentSection;
