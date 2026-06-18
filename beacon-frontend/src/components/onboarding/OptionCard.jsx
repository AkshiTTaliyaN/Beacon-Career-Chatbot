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
    <label
      className={`option-card${checked ? " selected" : ""}`}
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
    </label>
  );
}

