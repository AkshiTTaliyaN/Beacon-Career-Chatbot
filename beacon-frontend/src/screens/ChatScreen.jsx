import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendChatChoice, startChat } from "../api/client";
import ChatMarkdown from "../components/ChatMarkdown";
import ManzilHeader from "../components/ManzilHeader";
import LanguageToggle from "../components/LanguageToggle.jsx";
import BilingualText from "../components/BilingualText.jsx";
import "./ChatScreen.css";

function navigate(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

const QUICK_ACTIONS = [
  { id: "career", icon: "🎯", label: "Career Guidance", message: "I want personalised career guidance for my stream." },
  { id: "exams", icon: "📝", label: "Exam Selection", message: "Help me understand which entrance exams I should target." },
  { id: "college", icon: "🎓", label: "College Guidance", message: "I need guidance on colleges and courses that fit me." },
  { id: "start", icon: "✨", label: "Not Sure Where To Start", message: "I'm not sure where to start with my career planning." },
];

function AIAvatar() {
  return (
    <div className="chat-avatar" aria-hidden="true">
      <span>A</span>
    </div>
  );
}

function MessageBubble({ role, text }) {
  return (
    <motion.div
      className={`chat-message ${role}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {role === "bot" && <AIAvatar />}
      <div className="chat-bubble">
        {role === "bot" && <div className="chat-bubble-label">Career AI</div>}
        {role === "bot" ? (
          <ChatMarkdown content={text} />
        ) : (
          <p className="chat-plain-text"><BilingualText text={text} /></p>
        )}
      </div>
    </motion.div>
  );
}

function ProfileChips({ profile }) {
  const chips = useMemo(() => {
    if (!profile) return [];
    return [
      profile.current_class
        ? { icon: "🎓", label: "Class", value: `Class ${profile.current_class}` }
        : null,
      profile.city
        ? { icon: "📍", label: "Location", value: profile.city }
        : null,
      profile.has_riasec_scores
        ? { icon: "🧠", label: "RIASEC Status", value: "Assessment complete" }
        : { icon: "🧠", label: "RIASEC Status", value: "Not taken yet" },
      profile.career_clarity
        ? { icon: "🎯", label: "Career Clarity", value: profile.career_clarity.replaceAll("_", " ") }
        : null,
      profile.stream && profile.stream !== "none"
        ? { icon: "📚", label: "Stream", value: profile.stream.toUpperCase() }
        : null,
    ].filter(Boolean);
  }, [profile]);

  if (!chips.length) return null;

  return (
    <div className="profile-chips" aria-label="Profile context used by chat">
      <span className="profile-chips-kicker">Your profile</span>
      <div className="profile-chips-row">
        {chips.map((chip) => (
          <div key={`${chip.label}-${chip.value}`} className="profile-chip">
            <span className="profile-chip-icon" aria-hidden="true">{chip.icon}</span>
            <div className="profile-chip-copy">
              <span className="profile-chip-label">{chip.label}</span>
              <strong className="profile-chip-value">{chip.value}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickActionBar({ onSelect, loading, visible }) {
  if (!visible) return null;

  return (
    <div className="quick-actions" aria-label="Quick actions">
      <p className="quick-actions-title"><BilingualText text="Quick actions" /></p>
      <div className="quick-actions-grid">
        {QUICK_ACTIONS.map((action) => (
          <motion.button
            key={action.id}
            type="button"
            className="quick-action-card"
            disabled={loading}
            onClick={() => onSelect(action.message)}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.18 }}
          >
            <span className="quick-action-icon" aria-hidden="true">{action.icon}</span>
            <span className="quick-action-label"><BilingualText text={action.label} /></span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function OptionBar({ options, onSelect, loading }) {
  if (!options?.length) return null;

  return (
    <div className="chat-suggestions" aria-label="Suggested replies">
      <p className="chat-suggestions-title"><BilingualText text="Suggested replies" /></p>
      <div className="chat-options">
        {options.map((option) => (
          <motion.button
            key={option.letter}
            type="button"
            className="chat-option"
            disabled={loading}
            onClick={() => onSelect(option)}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.18 }}
          >
            <span>{option.letter}</span>
            <em><BilingualText text={option.text} /></em>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function RecommendationPanel({ node, onRestart }) {
  if (!node || !["recommendation", "handoff"].includes(node.type)) return null;

  if (node.type === "handoff") {
    return (
      <motion.section
        className="chat-result"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="chat-result-header">
          <span className="section-badge"><BilingualText text="Handoff" /></span>
          <h2><BilingualText text="Talk to a counsellor" /></h2>
        </div>
        <p><BilingualText text={node.handoff_message || node.question} /></p>
        <div className="handoff-actions">
          {(node.contact_options || []).map((item) => (
            <a key={item.type} href={item.value} target="_blank" rel="noreferrer">
              <BilingualText text={item.label} />
            </a>
          ))}
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="chat-result"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="chat-result-header">
        <span className="section-badge"><BilingualText text="Recommended path" /></span>
        <h2><BilingualText text={node.title || node.question} /></h2>
      </div>

      {!!node.description?.length && (
        <div className="fit-notes">
          {node.description.slice(0, 3).map((line) => (
            <p key={line}><BilingualText text={line} /></p>
          ))}
        </div>
      )}

      {!!node.careers?.length && (
        <div className="result-section">
          <h3><BilingualText text="Suggested careers" /></h3>
          <div className="career-grid">
            {node.careers.slice(0, 5).map((career) => (
              <article key={career.name} className="career-tile">
                <div>
                  <h4><BilingualText text={career.name} /></h4>
                  <p><BilingualText text={career.description} /></p>
                </div>
                <div className="tile-tags">
                  <span><BilingualText text={career.stream || "Any"} /></span>
                  <span><BilingualText text={career.salary || "Salary varies"} /></span>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {!!node.exams?.length && (
        <div className="result-section">
          <h3><BilingualText text="Relevant exams" /></h3>
          <div className="exam-list">
            {node.exams.slice(0, 5).map((exam) => (
              <article key={exam.name}>
                <strong><BilingualText text={exam.name} /></strong>
                <span><BilingualText text={exam.month || exam.conducting_body || "Timeline varies"} /></span>
                <p><BilingualText text={exam.what_it_leads_to || exam.eligibility} /></p>
              </article>
            ))}
          </div>
        </div>
      )}

      {!!node.next_steps?.length && (
        <div className="result-section">
          <h3><BilingualText text="Next steps" /></h3>
          <ol className="next-steps">
            {node.next_steps.slice(0, 4).map((step) => (
              <li key={step}><BilingualText text={step} /></li>
            ))}
          </ol>
        </div>
      )}

      <div className="result-actions">
        <button type="button" onClick={onRestart}><BilingualText text="Start another chat" /></button>
        <button type="button" className="secondary" onClick={() => navigate("/dashboard")}>
          <BilingualText text="Back to dashboard" />
        </button>
      </div>
    </motion.section>
  );
}

export default function ChatScreen() {
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [textValue, setTextValue] = useState("");
  const messagesEndRef = useRef(null);

  const bootChat = useCallback(async () => {
    setLoading(true);
    setError("");
    setMessages([]);
    setCurrentNode(null);
    try {
      const data = await startChat();
      setSessionId(data.session_id);
      setCurrentNode(data);
      setProfile(data.profile_summary);
      setMessages([{ id: crypto.randomUUID(), role: "bot", text: data.question }]);
    } catch (err) {
      setError(err.message || "Unable to start chat.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      bootChat();
    }, 0);
    return () => clearTimeout(timer);
  }, [bootChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, currentNode]);

  const sendUserMessage = useCallback(async (trimmed) => {
    if (!trimmed || loading || !sessionId) return;

    setLoading(true);
    setError("");

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", text: trimmed },
    ]);

    try {
      const data = await sendChatChoice({ sessionId, message: trimmed });
      setCurrentNode(data);
      setProfile(data.profile_summary);
      const skipNote = data.skipped_profile_questions?.length
        ? " I used your saved profile to skip questions you already answered."
        : "";
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "bot", text: `${data.question}${skipNote}` },
      ]);
    } catch (err) {
      setError(err.message || "Unable to send message.");
    } finally {
      setLoading(false);
    }
  }, [loading, sessionId]);

  async function handleSelect(option) {
    if (!sessionId || loading) return;
    setLoading(true);
    setError("");
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", text: `${option.letter}. ${option.text}` },
    ]);

    try {
      const data = await sendChatChoice({ sessionId, choice: option.letter });
      setCurrentNode(data);
      setProfile(data.profile_summary);
      const skipNote = data.skipped_profile_questions?.length
        ? " I used your saved profile to skip questions you already answered."
        : "";
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "bot", text: `${data.question}${skipNote}` },
      ]);
    } catch (err) {
      setError(err.message || "Unable to continue chat.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSendText(e) {
    e.preventDefault();
    const trimmed = textValue.trim();
    if (!trimmed) return;
    setTextValue("");
    await sendUserMessage(trimmed);
  }

  const showQuickActions =
    !loading &&
    !error &&
    currentNode?.type === "question" &&
    (currentNode?.question_id === "Q1" || messages.length <= 2);

  const showSuggestions =
    currentNode?.type === "question" &&
    currentNode.options?.length > 0 &&
    !showQuickActions;

  return (
    <div className="chat-page">
      <ManzilHeader
        title="AI Career Counsellor"
        subtitle="Career · College · Exam guidance"
        showDefaultNav={false}
        right={(
          <>
            <LanguageToggle />
            <button type="button" className="manzil-header-btn" onClick={() => navigate("/dashboard")}>
              ← Dashboard
            </button>
            <button type="button" className="manzil-header-btn" onClick={bootChat} disabled={loading}>
              Restart
            </button>
          </>
        )} />
      <div className="chat-shell">
        <ProfileChips profile={profile} />

        <main className="chat-main">
          <section className="message-panel" aria-live="polite">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <MessageBubble key={message.id} role={message.role} text={message.text} />
              ))}
            </AnimatePresence>

            {loading && (
              <div className="typing-row" aria-label="AI is typing">
                <AIAvatar />
                <div className="typing-bubble">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            {error && (
              <div className="chat-error">
                <strong>Chat unavailable</strong>
                <p>{error}</p>
                <button type="button" onClick={bootChat}>Try again</button>
              </div>
            )}

            <RecommendationPanel node={currentNode} onRestart={bootChat} />
            <div ref={messagesEndRef} />
          </section>

          <QuickActionBar
            visible={showQuickActions}
            loading={loading}
            onSelect={sendUserMessage}
          />

          {showSuggestions && (
            <OptionBar options={currentNode.options} onSelect={handleSelect} loading={loading} />
          )}

          <form className="chat-input-bar" onSubmit={handleSendText}>
            <input
              type="text"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder="Ask anything about careers, colleges, streams, exams, or your future..."
              disabled={loading}
              aria-label="Message AI Career Counsellor"
            />
            <button type="submit" className="btn-send" disabled={loading || !textValue.trim()} aria-label="Send message">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
