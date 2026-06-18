import { motion } from "framer-motion";

export default function AnimatedButton({
  className = "",
  children,
  whileHover = { y: -2, scale: 1.01 },
  whileTap = { scale: 0.98 },
  type,
  ...rest
}) {
  return (
    <motion.button
      type={type}
      className={className}
      whileHover={whileHover}
      whileTap={whileTap}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

