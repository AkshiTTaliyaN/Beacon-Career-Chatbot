import { motion } from "framer-motion";

export default function MetricCard({ icon, label, value, accentColor = "#00d4ff" }) {
  return (
    <motion.div
      className="apt-metric-card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -2 }}
      style={{ borderColor: `${accentColor}40` }}
    >
      <div className="apt-metric-top">
        {icon ? <span className="apt-metric-icon" style={{ color: accentColor }}>{icon}</span> : null}
        <div className="apt-metric-label">{label}</div>
      </div>
      <div className="apt-metric-value">{value}</div>
    </motion.div>
  );
}

