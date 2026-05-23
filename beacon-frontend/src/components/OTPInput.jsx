import { useRef, useEffect } from "react";

export default function OTPInput({ value, onChange, disabled }) {
  const refs = useRef([]);

  const digits = value.padEnd(6, " ").split("").slice(0, 6);

  useEffect(() => {
    if (!disabled) {
      refs.current[0]?.focus();
    }
  }, [disabled]);

  function updateDigit(index, char) {
    const onlyDigit = char.replace(/\D/g, "").slice(-1);
    const arr = digits.map((d) => (d === " " ? "" : d));
    arr[index] = onlyDigit;
    const next = arr.join("").replace(/\s/g, "");
    onChange(next);

    if (onlyDigit && index < 5) {
      refs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace") {
      const arr = digits.map((d) => (d === " " ? "" : d));
      if (arr[index]) {
        arr[index] = "";
        onChange(arr.join(""));
      } else if (index > 0) {
        refs.current[index - 1]?.focus();
        arr[index - 1] = "";
        onChange(arr.join(""));
      }
      e.preventDefault();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      onChange(pasted);
      const focusIdx = Math.min(pasted.length, 5);
      refs.current[focusIdx]?.focus();
    }
  }

  return (
    <div className="otp-row" onPaste={handlePaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="otp-box"
          value={d === " " ? "" : d}
          disabled={disabled}
          aria-label={`Digit ${i + 1}`}
          onChange={(e) => updateDigit(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
        />
      ))}
    </div>
  );
}