import { motion } from "framer-motion";

export default function AgreeScale({ items, value, onChange, color = "#2C5492" }) {
  const safeItems = items && items.length ? items : [1, 2, 3, 4, 5].map((v) => ({ value: v, label: String(v) }));

  return (
    <div className="apt-likert" role="radiogroup" aria-label="Question answer scale">
      <div className="apt-likert-grid">
        {safeItems.map((it, idx) => {
          const selected = value === it.value;
          return (
            <motion.button
              key={`${it.value}-${idx}`}
              type="button"
              className={`apt-likert-option${selected ? " selected" : ""}`}
              onClick={() => onChange(it.value)}
              aria-pressed={selected}
              aria-label={`${it.value} — ${it.label}`}
              style={{ ["--opt-color"]: color }}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.16 }}
            >
              <div className="apt-likert-num">{it.value}</div>
            </motion.button>
          );
        })}
      </div>

      <div className="apt-likert-legend" aria-hidden="true">
        {safeItems.map((it) => (
          <div key={`legend-${it.value}`} className="apt-likert-scale-label">
            {it.value} = {it.label}
          </div>
        ))}
      </div>
    </div>
  );
}
