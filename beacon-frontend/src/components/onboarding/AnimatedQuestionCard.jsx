import BilingualText from "../BilingualText";

export default function AnimatedQuestionCard({ question, children, delay = 0, className = "" }) {
  return (
    <div
      className={`onboard-section glass-card ${className}`.trim()}
    >
      {question != null && question !== "" && (
        <h3 className="question-heading"><BilingualText text={question} /></h3>
      )}
      {children}
    </div>
  );
}

