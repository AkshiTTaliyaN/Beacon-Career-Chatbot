function MessageBubble({ role, text }) {
  return (
    <div className={`message-bubble ${role}`}>
      {role === 'bot' && (
        <div className="bubble-avatar">
          <span>B</span>
        </div>
      )}
      <div className="bubble-content">{text}</div>
    </div>
  );
}

export default MessageBubble;
