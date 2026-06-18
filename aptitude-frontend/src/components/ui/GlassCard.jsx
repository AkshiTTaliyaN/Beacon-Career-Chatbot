import { motion } from "framer-motion";

export default function GlassCard({
  className = "",
  children,
  hover = true,
  whileHoverScale = 1.02,
  ...rest
}) {
  return (
    <motion.div
      className={`apt-glass-card ${className}`.trim()}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      whileHover={
        hover
          ? { scale: whileHoverScale, y: -2, transition: { duration: 0.18 } }
          : undefined
      }
      {...rest}
    >
      {children}
    </motion.div>
  );
}

