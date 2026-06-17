import { motion } from "framer-motion";

export default function FloatingBackground() {
  return (
    <div className="onboard-bg" aria-hidden="true">
      <div className="onboard-bg-grid" />
      <motion.div
        className="onboard-orb onboard-orb--cyan"
        animate={{ y: [0, -18, 0], x: [0, 12, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="onboard-orb onboard-orb--purple"
        animate={{ y: [0, 14, 0], x: [0, -10, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="onboard-orb onboard-orb--blue"
        animate={{ y: [0, -10, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
