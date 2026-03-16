import { motion, type HTMLMotionProps } from "framer-motion"

type AnimatedGradientTextProps = HTMLMotionProps<"span">

export function AnimatedGradientText({ className = "", children, ...props }: AnimatedGradientTextProps) {
  return (
    <motion.span
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`inline-flex items-center rounded-full border border-blue-200 bg-gradient-to-r from-blue-50/80 via-sky-50/80 to-indigo-50/80 px-3 py-1 text-xs font-medium text-blue-700 shadow-sm backdrop-blur ${className}`}
      {...props}
    >
      {children}
    </motion.span>
  )
}

