import { useState } from 'react';

function InputBar({ onSend }) {
  const [value, setValue] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue('');
  };

  return (
    <form className="input-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask about careers, exams, or colleges..."
      />
      <button type="submit" disabled={!value.trim()}>
        Send
      </button>
    </form>
  );
}

export default InputBar;
