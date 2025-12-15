import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PulseDotProps {
  className?: string;
  color?: string;
}

const PulseDot = ({ className, color = "bg-primary" }: PulseDotProps) => {
  return (
    <div className={cn("relative inline-flex", className)}>
      <motion.span
        className={cn("absolute inline-flex h-full w-full rounded-full opacity-75", color)}
        animate={{
          scale: [1, 2, 2, 1],
          opacity: [0.75, 0, 0, 0.75],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <span className={cn("relative inline-flex rounded-full h-3 w-3", color)} />
    </div>
  );
};

export default PulseDot;
