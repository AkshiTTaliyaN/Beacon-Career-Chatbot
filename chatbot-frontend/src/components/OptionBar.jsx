function OptionBar({ options, onSelect }) {
  const handleClick = (option) => {
    onSelect(option);
  };

  return (
    <div className="option-bar">
      {options.map((option) => (
        <button
          key={option.letter}
          type="button"
          className="option-button"
          onClick={() => handleClick(option)}
        >
          <span className="option-letter">{option.letter}</span>
          <span>{option.text}</span>
        </button>
      ))}
    </div>
  );
}

export default OptionBar;