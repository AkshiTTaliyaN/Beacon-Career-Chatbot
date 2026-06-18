export default function ConfettiBurst({ colors = ["#2C5492", "#00d4ff", "#8b5cf6", "#10b981"] }) {
  const pieces = Array.from({ length: 28 }).map((_, i) => {
    const left = (i * 100) / 28;
    const delay = (i % 7) * 0.06;
    const duration = 0.9 + (i % 5) * 0.12;
    const color = colors[i % colors.length];
    const size = 6 + (i % 4) * 2;
    return { left, delay, duration, color, size, i };
  });

  return (
    <div className="apt-confetti" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.i}
          className="apt-confetti-piece"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            background: p.color,
            width: `${p.size}px`,
            height: `${Math.max(6, p.size - 2)}px`,
          }}
        />
      ))}
    </div>
  );
}

