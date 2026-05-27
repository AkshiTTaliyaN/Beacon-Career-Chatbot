import { useState } from 'react';
import MessageBubble from './MessageBubble.jsx';
import RecommendationCard from './RecommendationCard.jsx';
import HandoffModal from './HandoffModal.jsx';

function ChatWindow({ messages, isTyping, currentNode, started, onStart, onReset }) {
  const [handoffOpen, setHandoffOpen] = useState(false);

  const handleHandoff = () => setHandoffOpen(true);

  if (!started) {
    return (
      <div className="chat-window welcome-screen">
        <div className="welcome-card">
          <div className="welcome-icon">🧭</div>
          <h1>Hi, I am your Career Assistant</h1>
          <p>I will help you find the right career path in just a few questions.</p>
          <button className="welcome-start-button" onClick={onStart}>
            Get Started
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="messages-wrapper">
        {messages.map((message) => (
          <MessageBubble key={message.id} role={message.role} text={message.text} />
        ))}
        {isTyping && (
          <div className="typing-indicator">
            <span />
            <span />
            <span />
          </div>
        )}
      </div>

      {currentNode && currentNode.type === 'recommendation' && (
        <RecommendationCard node={currentNode} onHandoff={handleHandoff} onReset={onReset} />
      )}

      {currentNode && currentNode.type === 'handoff' && (
        <div className="handoff-grid">
          {currentNode.contact_options?.map((item) => {
            const lower = item.type?.toLowerCase();
            return (
              <a
                key={item.type}
                href={item.value}
                target="_blank"
                rel="noreferrer"
                className={`handoff-card handoff-card-${lower}`}
              >
                <div className="handoff-card-icon">{lower === 'whatsapp' ? '💬' : lower === 'call' ? '📞' : '✉️'}</div>
                <div>
                  <strong>{item.label}</strong>
                  <p>{item.value}</p>
                </div>
              </a>
            );
          })}
        </div>
      )}

      <HandoffModal open={handoffOpen} onClose={() => setHandoffOpen(false)} node={currentNode} />
    </div>
  );
}

export default ChatWindow;
