import { motion } from "framer-motion";

export default function OptionCard({
  name,
  value,
  checked,
  onChange,
  label,
  description,
  icon,
  index = 0,
}) {
  return (
    <motion.label
      className={`option-card${checked ? " selected" : ""}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <div className="option-card-inner">
        {icon && <span className="option-card-icon" aria-hidden="true">{icon}</span>}
        <div className="option-card-text">
          <span className="option-card-label">{label}</span>
          {description && <span className="option-card-desc">{description}</span>}
        </div>
        {checked && <span className="option-card-check" aria-hidden="true">✓</span>}
      </div>
    </motion.label>
  );
}
