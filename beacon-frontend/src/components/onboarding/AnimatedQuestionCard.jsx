export default function AnimatedQuestionCard({ question, children, delay = 0, className = "" }) {
  return (
    <div
      className={`onboard-section glass-card ${className}`.trim()}
    >
      {question != null && question !== "" && (
        <h3 className="question-heading">{question}</h3>
      )}
      {children}
    </div>
  );
}

