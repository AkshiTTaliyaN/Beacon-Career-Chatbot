import OptionCard from "./onboarding/OptionCard";

export default function RadioCards({ name, options, value, onChange, error, columns, iconMap = {} }) {
  return (
    <div>
      <div
        className={`option-grid${columns === 2 ? " option-grid--2col" : ""}`}
        role="radiogroup"
        aria-label={name}
      >
        {options.map((opt, i) => (
          <OptionCard
            key={opt.value}
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            label={opt.label}
            description={opt.description}
            icon={iconMap[opt.value] || opt.icon}
            index={i}
          />
        ))}
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
