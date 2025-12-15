import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  hoverScale?: number;
  className?: string;
}

const AnimatedCard = ({ 
  children, 
  hoverScale = 1.02,
  className,
  ...props 
}: AnimatedCardProps) => {
  return (
    <motion.div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow",
        className
      )}
      whileHover={{ 
        scale: hoverScale,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
