import { motion } from "framer-motion";

export default function ProgressHeader({ step, totalSteps }) {
  const progressPct = (Number(step) / (Number(totalSteps) - 1)) * 100;

  return (
    <div className="onboard-progress" aria-label="Form progress">
      <div className="onboard-progress-top">
        <p className="onboard-progress-step">Step {step} of {totalSteps - 1}</p>
        <p className="onboard-progress-pct">{Math.round(progressPct)}%</p>
      </div>
      <div className="onboard-progress-bar">
        <motion.div
          className="onboard-progress-fill"
          initial={false}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </div>
  );
}
