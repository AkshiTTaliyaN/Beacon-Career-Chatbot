import { motion } from "framer-motion";

export default function ProgressWidget({
  code,
  label,
  color = "#2C5492",
  completed,
  total,
  active = false,
  done = false,
  rightText,
}) {
  const pct = total ? Math.max(0, Math.min(100, (completed / total) * 100)) : 0;

  return (
    <motion.div
      className={`apt-kpi-card${active ? " active" : ""}${done ? " done" : ""}`.trim()}
      style={{ borderColor: active ? `${color}55` : undefined }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -2, scale: 1.01 }}
    >
      <div className="apt-kpi-top">
        <div className="apt-kpi-code" style={{ color }}>
          {code}
        </div>
        <div className="apt-kpi-label">{label}</div>
        {rightText ? (
          <div className="apt-kpi-right" style={{ color }}>
            {rightText}
          </div>
        ) : (
          <div className="apt-kpi-right">{completed}/{total}</div>
        )}
      </div>

      <div className="apt-kpi-bar">
        <motion.div
          className="apt-kpi-bar-fill"
          style={{ background: `linear-gradient(90deg, ${color} 0%, rgba(0,212,255,0.9) 100%)` }}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
      <div className="apt-kpi-pct">{Math.round(pct)}%</div>
    </motion.div>
  );
}

