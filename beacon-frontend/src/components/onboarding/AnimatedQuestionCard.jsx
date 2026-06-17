import { motion } from "framer-motion";

export default function AnimatedQuestionCard({ question, children, delay = 0, className = "" }) {
  return (
    <motion.div
      className={`onboard-section glass-card ${className}`.trim()}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      {question != null && question !== "" && (
        <h3 className="question-heading">{question}</h3>
      )}
      {children}
    </motion.div>
  );
}
