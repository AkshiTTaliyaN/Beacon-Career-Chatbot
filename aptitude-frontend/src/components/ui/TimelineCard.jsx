import { motion } from "framer-motion";

export default function TimelineCard({ icon, phaseTitle, items, accentColor = "#2C5492" }) {
  return (
    <motion.div
      className="apt-timeline-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -2 }}
      style={{ borderColor: `${accentColor}40` }}
    >
      <div className="apt-timeline-head" style={{ borderColor: `${accentColor}55` }}>
        {icon ? <span className="apt-timeline-icon" style={{ color: accentColor }}>{icon}</span> : null}
        <h4 className="apt-timeline-title">{phaseTitle}</h4>
      </div>
      <ul className="apt-timeline-list">
        {(items || []).map((it, idx) => (
          <li key={idx} className="apt-timeline-item">
            <span className="apt-timeline-bullet" style={{ background: accentColor }} />
            <span className="apt-timeline-text">{it}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

