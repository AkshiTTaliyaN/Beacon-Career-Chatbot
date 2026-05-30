import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sendChatChoice, startChat } from "../api/client";
import "./ChatScreen.css";

function navigate(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function MessageBubble({ role, text }) {
  return (
    <div className={`chat-message ${role}`}>
      {role === "bot" && <div className="chat-avatar">B</div>}
      <div className="chat-bubble">{text}</div>
    </div>
  );
}

function ProfileStrip({ profile }) {
  const chips = useMemo(() => {
    if (!profile) return [];
    return [
      profile.current_class ? `Class ${profile.current_class}` : null,
      profile.stream && profile.stream !== "none" ? profile.stream.toUpperCase() : null,
      profile.city || null,
      profile.career_clarity ? `Clarity: ${profile.career_clarity.replaceAll("_", " ")}` : null,
      profile.has_riasec_scores ? "RIASEC ready" : null,
    ].filter(Boolean);
  }, [profile]);

  if (!chips.length) return null;

  return (
    <div className="profile-strip" aria-label="Profile context used by chat">
      <span>Using saved profile</span>
      {chips.map((chip) => (
        <strong key={chip}>{chip}</strong>
      ))}
    </div>
  );
}

function OptionBar({ options, onSelect, loading }) {
  if (!options?.length) return null;

  return (
    <div className="chat-options" aria-label="Chat choices">
      {options.map((option) => (
        <button
          key={option.letter}
          type="button"
          className="chat-option"
          disabled={loading}
          onClick={() => onSelect(option)}
        >
          <span>{option.letter}</span>
          <em>{option.text}</em>
        </button>
      ))}
    </div>
  );
}

function RecommendationPanel({ node, onRestart }) {
  if (!node || !["recommendation", "handoff"].includes(node.type)) return null;

  if (node.type === "handoff") {
    return (
      <section className="chat-result">
        <div className="chat-result-header">
          <span>Handoff</span>
          <h2>Talk to a counsellor</h2>
        </div>
        <p>{node.handoff_message || node.question}</p>
        <div className="handoff-actions">
          {(node.contact_options || []).map((item) => (
            <a key={item.type} href={item.value} target="_blank" rel="noreferrer">
              {item.label}
            </a>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="chat-result">
      <div className="chat-result-header">
        <span>Recommended path</span>
        <h2>{node.title || node.question}</h2>
      </div>

      {!!node.description?.length && (
        <div className="fit-notes">
          {node.description.slice(0, 3).map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      )}

      {!!node.careers?.length && (
        <div className="result-section">
          <h3>Suggested careers</h3>
          <div className="career-grid">
            {node.careers.slice(0, 5).map((career) => (
              <article key={career.name} className="career-tile">
                <div>
                  <h4>{career.name}</h4>
                  <p>{career.description}</p>
                </div>
                <div className="tile-tags">
                  <span>{career.stream || "Any"}</span>
                  <span>{career.salary || "Salary varies"}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {!!node.exams?.length && (
        <div className="result-section">
          <h3>Relevant exams</h3>
          <div className="exam-list">
            {node.exams.slice(0, 5).map((exam) => (
              <article key={exam.name}>
                <strong>{exam.name}</strong>
                <span>{exam.month || exam.conducting_body || "Timeline varies"}</span>
                <p>{exam.what_it_leads_to || exam.eligibility}</p>
              </article>
            ))}
          </div>
        </div>
      )}

      {!!node.next_steps?.length && (
        <div className="result-section">
          <h3>Next steps</h3>
          <ol className="next-steps">
            {node.next_steps.slice(0, 4).map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      <div className="result-actions">
        <button type="button" onClick={onRestart}>Start another chat</button>
        <button type="button" className="secondary" onClick={() => navigate("/dashboard")}>
          Back to dashboard
        </button>
      </div>
    </section>
  );
}

export default function ChatScreen() {
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
    bootChat();
  }, [bootChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, currentNode]);

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

  return (
    <div className="chat-page">
      <header className="chat-topbar">
        <button type="button" className="back-button" onClick={() => navigate("/dashboard")}>
          Back
        </button>
        <div>
          <p>Beacon</p>
          <h1>AI Career Counsellor</h1>
        </div>
        <button type="button" className="restart-button" onClick={bootChat} disabled={loading}>
          Restart
        </button>
      </header>

      <ProfileStrip profile={profile} />

      <main className="chat-main">
        <section className="message-panel" aria-live="polite">
          {messages.map((message) => (
            <MessageBubble key={message.id} role={message.role} text={message.text} />
          ))}
          {loading && (
            <div className="typing-row">
              <span />
              <span />
              <span />
            </div>
          )}
          {error && (
            <div className="chat-error">
              <strong>Chat unavailable</strong>
              <p>{error}</p>
              <button type="button" onClick={bootChat}>Try again</button>
            </div>
          )}
          <div ref={messagesEndRef} />
        </section>

        <RecommendationPanel node={currentNode} onRestart={bootChat} />
      </main>

      {currentNode?.type === "question" && (
        <OptionBar options={currentNode.options} onSelect={handleSelect} loading={loading} />
      )}
    </div>
  );
}
