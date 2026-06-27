/**
 * FuturisticCharts.jsx
 * ════════════════════════════════════════════════════════════════════
 * Reusable visualization component library for the Manzil Career
 * Dashboard's futuristic dark-themed UI.
 *
 * Design language:
 *  - Glassmorphism (frosted glass, semi-transparent panels)
 *  - Neon glow accents (cyan, magenta, green, amber)
 *  - Animated SVG gauges and chart primitives
 *  - Custom Recharts renderers
 *
 * All visual styling lives in `../styles/futuristic.css`.
 * Components only reference CSS class names — no inline colour values
 * unless they are dynamic and cannot be expressed as classes.
 *
 * @module FuturisticCharts
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import '../styles/futuristic.css';
import BilingualText from './BilingualText.jsx';

/* ═══════════════════════════════════════════════════════════════════
   RIASEC_THEME — colour & icon map for Holland / RIASEC types
   ═══════════════════════════════════════════════════════════════════ */

/**
 * Mapping of RIASEC personality types to their futuristic neon theme.
 * Each entry contains:
 *  - `color`  — primary neon hex colour
 *  - `label`  — single-character abbreviation
 *  - `icon`   — representative emoji
 *
 * @type {Record<string, { color: string, label: string, icon: string }>}
 */
export const RIASEC_THEME = {
  Realistic:     { color: '#ff006e', label: 'R', icon: '🔧' },
  Investigative: { color: '#00d4ff', label: 'I', icon: '🔬' },
  Artistic:      { color: '#8b5cf6', label: 'A', icon: '🎨' },
  Social:        { color: '#00ff88', label: 'S', icon: '🤝' },
  Enterprising:  { color: '#f59e0b', label: 'E', icon: '📈' },
  Conventional:  { color: '#14b8a6', label: 'C', icon: '📋' },
};

/* ═══════════════════════════════════════════════════════════════════
   useCountUp — animated number counter hook
   ═══════════════════════════════════════════════════════════════════ */

/**
 * Animates a numeric value from 0 → `target` over `duration` ms using
 * `requestAnimationFrame` with an easeOutQuad easing curve.
 *
 * @param   {number} target   - The final value to count up to.
 * @param   {number} duration - Animation duration in milliseconds (default 1200).
 * @returns {number} The current display value (integer).
 *
 * @example
 * const count = useCountUp(87, 1500);
 * return <span>{count}%</span>;
 */
export function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  /**
   * easeOutQuad: decelerating curve for a natural feel.
   * @param {number} t - Progress 0‥1
   * @returns {number}  Eased progress 0‥1
   */
  const easeOutQuad = useCallback((t) => t * (2 - t), []);

  useEffect(() => {
    // Guard: nothing to animate
    if (target == null || target === 0) {
      setValue(0);
      return;
    }

    const numericTarget = Number(target);
    if (Number.isNaN(numericTarget)) {
      setValue(0);
      return;
    }

    startTimeRef.current = null;

    const animate = (timestamp) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuad(progress);

      setValue(Math.round(easedProgress * numericTarget));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [target, duration, easeOutQuad]);

  return value;
}

/* ═══════════════════════════════════════════════════════════════════
   GlassCard — glassmorphism container
   ═══════════════════════════════════════════════════════════════════ */

/**
 * A reusable glassmorphism container panel.
 *
 * Renders a `<div>` with the `.ft-glass-card` base class and optional
 * modifier classes for elevation, borders, and glow accents.
 *
 * @param {object}  props
 * @param {React.ReactNode}  props.children   - Card content.
 * @param {string}  [props.className]         - Additional CSS classes.
 * @param {boolean} [props.elevated=false]    - Apply `.ft-glass-card--elevated` for stronger shadow.
 * @param {boolean} [props.bordered=false]    - Apply `.ft-glass-card--bordered` for visible border.
 * @param {string}  [props.glowColor]         - Neon glow accent: 'cyan' | 'magenta' | 'green' | 'amber'.
 * @param {object}  [props.style]             - Inline style overrides.
 * @param {object}  [props...rest]            - Forwarded to the root `<div>`.
 *
 * @example
 * <GlassCard elevated bordered glowColor="cyan">
 *   <h3>Score Overview</h3>
 * </GlassCard>
 */
export function GlassCard({
  children,
  className = '',
  elevated = false,
  bordered = false,
  glowColor,
  style,
  ...props
}) {
  const classes = [
    'ft-glass-card',
    elevated && 'ft-glass-card--elevated',
    bordered && 'ft-glass-card--bordered',
    glowColor && `ft-glow-${glowColor}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} style={style} {...props}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   RadialGauge — SVG arc gauge for RIASEC scores
   ═══════════════════════════════════════════════════════════════════ */

/**
 * Draws a 270-degree radial arc gauge with animated fill.
 *
 * The arc spans from 135° (lower-left) to 405° (lower-right) leaving
 * a 90° gap at the bottom. A glow SVG filter is applied to the
 * progress arc for a neon effect.
 *
 * @param {object} props
 * @param {number} props.value          - Current value (0 – max).
 * @param {number} [props.max=100]      - Maximum value.
 * @param {string} props.label          - Label displayed below the percentage.
 * @param {string} [props.sublabel]     - Secondary label (e.g. full type name).
 * @param {string} props.color          - Hex colour for the progress arc.
 * @param {number} [props.size=140]     - SVG viewBox / element size in px.
 * @param {number} [props.strokeWidth=10] - Arc stroke width.
 *
 * @example
 * <RadialGauge value={72} label="I" sublabel="Investigative" color="#00d4ff" />
 */
export function RadialGauge({
  value = 0,
  max = 100,
  label = '',
  sublabel,
  color = '#00d4ff',
  size = 140,
  strokeWidth = 10,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger the CSS transition after initial render
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Clamp value between 0 and max
  const safeValue = Math.max(0, Math.min(Number(value) || 0, max));
  const percentage = max > 0 ? Math.round((safeValue / max) * 100) : 0;

  const center = size / 2;
  const radius = (size - strokeWidth) / 2 - 4; // 4px inset for glow clearance
  const circumference = 2 * Math.PI * radius;

  // 270° arc
  const arcLength = (270 / 360) * circumference;
  const progressLength = (safeValue / max) * arcLength;

  // Offset so the "empty" part is the gap
  const dashArray = `${arcLength} ${circumference}`;
  const progressDashArray = `${mounted ? progressLength : 0} ${circumference}`;

  // Sanitise label for SVG filter id (remove non-alphanumeric)
  const filterId = `glow-${(label || 'gauge').replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <div className="ft-radial-gauge" style={{ width: size, height: size }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="ft-radial-gauge__svg"
      >
        {/* ── SVG filter for neon glow ── */}
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Background track ── */}
        <circle
          className="ft-radial-gauge__track"
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--ft-border-subtle)"
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform={`rotate(135 ${center} ${center})`}
        />

        {/* ── Progress arc ── */}
        <circle
          className="ft-radial-gauge__progress"
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={progressDashArray}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform={`rotate(135 ${center} ${center})`}
          filter={`url(#${filterId})`}
          style={{
            transition: 'stroke-dasharray 1.2s ease-out',
          }}
        />

        {/* ── Center percentage text ── */}
        <text
          x={center}
          y={center - 6}
          className="ft-radial-gauge__value"
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--ft-text-primary)"
          fontSize={size * 0.22}
          fontWeight="700"
          fontFamily="Inter, system-ui, sans-serif"
        >
          {percentage}%
        </text>

        {/* ── Label ── */}
        <text
          x={center}
          y={center + size * 0.16}
          className="ft-radial-gauge__label"
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--ft-text-secondary)"
          fontSize={size * 0.1}
          fontFamily="Inter, system-ui, sans-serif"
        >
          {label}
        </text>

        {/* ── Sublabel ── */}
        {sublabel && (
          <text
            x={center}
            y={center + size * 0.28}
            className="ft-radial-gauge__sublabel"
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--ft-text-muted)"
            fontSize={size * 0.075}
            fontFamily="Inter, system-ui, sans-serif"
          >
            {sublabel}
          </text>
        )}
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   KPICard — animated key performance indicator card
   ═══════════════════════════════════════════════════════════════════ */

/**
 * Displays a single KPI metric inside a glass card with an animated
 * count-up number, coloured icon badge, and accent left border.
 *
 * @param {object} props
 * @param {string|React.ReactNode} props.icon    - Emoji or icon element.
 * @param {string} props.label                   - KPI description.
 * @param {number} props.value                   - Numeric KPI value.
 * @param {string} [props.suffix='']             - Unit suffix (e.g. '%', 'pts').
 * @param {string} [props.color='cyan']          - Accent colour name.
 * @param {string} [props.subtitle]              - Secondary description.
 *
 * @example
 * <KPICard icon="📊" label="Total Score" value={87} suffix="%" color="cyan" />
 */
export function KPICard({
  icon,
  label,
  value,
  suffix = '',
  color = 'cyan',
  subtitle,
  isText = false,
}) {
  const animatedValue = useCountUp(isText ? 0 : value);
  const displayValue = isText ? value : animatedValue;

  /** Map colour name → CSS custom property for the accent border */
  const colorMap = {
    cyan:    '#00d4ff',
    magenta: '#ff006e',
    green:   '#00ff88',
    amber:   '#f59e0b',
    purple:  '#8b5cf6',
    teal:    '#14b8a6',
  };
  const accentHex = colorMap[color] || colorMap.cyan;

  return (
    <GlassCard
      className={`ft-kpi-card ft-kpi-card--${color}`}
      style={{ borderLeft: `3px solid ${accentHex}` }}
    >
      {/* Icon badge */}
      <div
        className="ft-kpi-card__icon"
        style={{
          background: `${accentHex}1a`,
          boxShadow: `0 0 12px ${accentHex}33`,
        }}
      >
        {icon}
      </div>

      {/* Animated value */}
      <div className="ft-kpi-card__value" style={{ color: accentHex, fontSize: isText ? '1.15rem' : undefined, lineHeight: isText ? 1.25 : undefined }}>
        {isText ? <BilingualText text={displayValue} /> : displayValue}
        {suffix && <span className="ft-kpi-card__suffix">{suffix}</span>}
      </div>

      {/* Label */}
      <div className="ft-kpi-card__label">
        <BilingualText text={label} />
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div className="ft-kpi-card__subtitle">
          <BilingualText text={subtitle} />
        </div>
      )}
    </GlassCard>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FuturisticTooltip — custom recharts tooltip
   ═══════════════════════════════════════════════════════════════════ */

/**
 * Custom Recharts `<Tooltip content={…} />` renderer styled as a dark
 * glassmorphism popover with neon accents.
 *
 * @param {object}  props
 * @param {boolean} props.active   - Whether the tooltip is visible.
 * @param {Array}   props.payload  - Data items at the hovered point.
 * @param {string}  props.label    - Category / x-axis label.
 *
 * @example
 * <Tooltip content={<FuturisticTooltip />} />
 */
export function FuturisticTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="ft-tooltip">
      {/* Header label */}
      {label != null && (
        <div className="ft-tooltip__label">{label}</div>
      )}

      {/* Payload items */}
      <ul className="ft-tooltip__list">
        {payload.map((item, idx) => (
          <li key={idx} className="ft-tooltip__item">
            <span
              className="ft-tooltip__dot"
              style={{ background: item.color || '#00d4ff' }}
            />
            <span className="ft-tooltip__name">
              {item.name || item.dataKey}
            </span>
            <span className="ft-tooltip__value">
              {item.value != null ? item.value : '—'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SectionHeader — titled section divider
   ═══════════════════════════════════════════════════════════════════ */

/**
 * Renders a section heading with a coloured left accent bar, optional
 * subtitle, and an optional right-aligned action element.
 *
 * @param {object} props
 * @param {string} props.title                    - Heading text.
 * @param {string} [props.subtitle]               - Muted description.
 * @param {string} [props.accentColor='cyan']     - Accent bar colour name.
 * @param {React.ReactNode} [props.action]        - Element on the right (button, link…).
 *
 * @example
 * <SectionHeader
 *   title="RIASEC Profile"
 *   subtitle="Your personality breakdown"
 *   accentColor="cyan"
 *   action={<button>Export</button>}
 * />
 */
export function SectionHeader({
  title,
  subtitle,
  accentColor = 'cyan',
  action,
}) {
  const colorMap = {
    cyan:    '#00d4ff',
    magenta: '#ff006e',
    green:   '#00ff88',
    amber:   '#f59e0b',
    purple:  '#8b5cf6',
    teal:    '#14b8a6',
  };
  const barColor = colorMap[accentColor] || colorMap.cyan;

  return (
    <div className="ft-section-header">
      <div className="ft-section-header__content">
        {/* Accent bar */}
        <div
          className="ft-section-header__bar"
          style={{
            background: `linear-gradient(180deg, ${barColor}, ${barColor}66)`,
          }}
        />

        <div>
          <h2 className="ft-heading-lg ft-section-header__title">
            <BilingualText text={title} />
          </h2>
          {subtitle && (
            <p className="ft-text-muted ft-section-header__subtitle">
              <BilingualText text={subtitle} />
            </p>
          )}
        </div>
      </div>

      {action && (
        <div className="ft-section-header__action">{action}</div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   AnimatedBar — custom recharts <Bar shape={…} /> renderer
   ═══════════════════════════════════════════════════════════════════ */

/** Internal counter for unique gradient IDs across multiple bars. */
let _barGradientCounter = 0;

/**
 * Custom bar shape for Recharts `<Bar shape={<AnimatedBar />} />`.
 *
 * Renders a rounded `<rect>` with a vertical linear gradient (lighter
 * shade → base fill colour) and a subtle glow filter. The width
 * animates in via a CSS transition.
 *
 * @param {object} props - Standard Recharts bar shape props.
 * @param {number} props.x
 * @param {number} props.y
 * @param {number} props.width
 * @param {number} props.height
 * @param {string} props.fill - Base fill colour.
 *
 * @example
 * <Bar dataKey="score" shape={<AnimatedBar />} />
 */
export function AnimatedBar(props) {
  const { x, y, width, height, fill } = props;

  // Unique ID per bar instance for gradient
  const gradientId = useMemo(
    () => `ft-bar-grad-${++_barGradientCounter}`,
    [],
  );
  const filterId = useMemo(
    () => `ft-bar-glow-${_barGradientCounter}`,
    [],
  );

  // Guard against invalid / zero-size bars
  if (!width || !height || height <= 0) return null;

  /**
   * Compute a lighter tint of `fill` for the gradient top stop.
   * We simply mix the hex colour with white at ~40% opacity.
   */
  const lighterFill = lightenHex(fill, 0.35);

  return (
    <g>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lighterFill} stopOpacity={0.95} />
          <stop offset="100%" stopColor={fill} stopOpacity={0.85} />
        </linearGradient>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect
        className="ft-animated-bar"
        x={x}
        y={y}
        width={width}
        height={height}
        rx={6}
        ry={6}
        fill={`url(#${gradientId})`}
        filter={`url(#${filterId})`}
        style={{
          transition: 'width 0.6s ease-out, height 0.6s ease-out, y 0.6s ease-out',
        }}
      />
    </g>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   GradientDefs — shared SVG gradient / filter definitions
   ═══════════════════════════════════════════════════════════════════ */

/**
 * Renders a zero-size hidden SVG element containing reusable gradient
 * and filter definitions for Recharts components.
 *
 * Place once at the top of your chart container or dashboard layout:
 * ```jsx
 * <GradientDefs />
 * <ResponsiveContainer>…</ResponsiveContainer>
 * ```
 *
 * Available gradient IDs:
 *  - `ft-grad-realistic`, `ft-grad-investigative`, …
 *  - Each is a vertical linear gradient from the RIASEC colour (top)
 *    to transparent (bottom).
 *
 * Available filter IDs:
 *  - `ft-glow-filter`     — general glow
 *  - `ft-glow-filter-lg`  — stronger glow (stdDeviation 5)
 */
export function GradientDefs() {
  return (
    <svg
      width={0}
      height={0}
      style={{ position: 'absolute', pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <defs>
        {/* ── RIASEC linear gradients (colour → transparent) ── */}
        {Object.entries(RIASEC_THEME).map(([key, { color }]) => (
          <linearGradient
            key={key}
            id={`ft-grad-${key.toLowerCase()}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={color} stopOpacity={0.8} />
            <stop offset="100%" stopColor={color} stopOpacity={0.1} />
          </linearGradient>
        ))}

        {/* ── General glow filter ── */}
        <filter id="ft-glow-filter" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* ── Large glow filter ── */}
        <filter id="ft-glow-filter-lg" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* ── Utility gradients ── */}
        <linearGradient id="ft-grad-cyan-horizontal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#00d4ff" stopOpacity={0.2} />
        </linearGradient>

        <linearGradient id="ft-grad-magenta-horizontal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff006e" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#ff006e" stopOpacity={0.2} />
        </linearGradient>

        <radialGradient id="ft-grad-radial-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.15} />
          <stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Internal utilities
   ═══════════════════════════════════════════════════════════════════ */

/**
 * Lighten a hex colour by mixing it towards white.
 *
 * @param   {string} hex    - Hex colour string (e.g. '#ff006e').
 * @param   {number} amount - Mix amount 0‥1 (0 = no change, 1 = white).
 * @returns {string} Lightened hex colour.
 * @private
 */
function lightenHex(hex, amount = 0.3) {
  if (!hex || typeof hex !== 'string') return '#ffffff';

  // Strip leading #
  let h = hex.replace(/^#/, '');

  // Expand shorthand (e.g. 'f0a' → 'ff00aa')
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }

  const num = parseInt(h, 16);
  if (Number.isNaN(num)) return '#ffffff';

  const r = Math.min(255, Math.round(((num >> 16) & 0xff) + (255 - ((num >> 16) & 0xff)) * amount));
  const g = Math.min(255, Math.round(((num >> 8) & 0xff) + (255 - ((num >> 8) & 0xff)) * amount));
  const b = Math.min(255, Math.round((num & 0xff) + (255 - (num & 0xff)) * amount));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
