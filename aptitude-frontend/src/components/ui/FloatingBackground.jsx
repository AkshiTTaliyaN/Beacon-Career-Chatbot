import { motion } from "framer-motion";

export default function FloatingBackground() {
  return (
    <div className="apt-floating-bg" aria-hidden="true">
      <div className="apt-floating-bg-grid" />

      <motion.div
        className="apt-orb apt-orb--cyan"
        animate={{ y: [0, -18, 0], x: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="apt-orb apt-orb--purple"
        animate={{ y: [0, 14, 0], x: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="apt-orb apt-orb--blue"
        animate={{ y: [0, -10, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

