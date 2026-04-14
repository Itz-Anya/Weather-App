import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const GlassCard = ({ children, className, delay = 0 }: GlassCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
    className={cn(
      "rounded-2xl border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass-bg))] backdrop-blur-xl shadow-glass p-6",
      className
    )}
  >
    {children}
  </motion.div>
);

export default GlassCard;
