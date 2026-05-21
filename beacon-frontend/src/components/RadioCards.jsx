export default function RadioCards({ name, options, value, onChange, error }) {
  return (
    <div>
      <div className="radio-grid" role="radiogroup" aria-label={name}>
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`radio-card ${value === opt.value ? "selected" : ""}`}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
            />
            <span className="radio-card-label">{opt.label}</span>
            {opt.description && (
              <span className="radio-card-desc">{opt.description}</span>
            )}
          </label>
        ))}
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
