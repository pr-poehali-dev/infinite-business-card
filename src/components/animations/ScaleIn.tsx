import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface ScaleInProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  delay?: number;
  duration?: number;
}

const ScaleIn = ({ 
  children, 
  delay = 0, 
  duration = 0.4,
  ...props 
}: ScaleInProps) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0,
        scale: 0.9
      }}
      animate={{ 
        opacity: 1,
        scale: 1
      }}
      transition={{
        duration,
        delay,
        ease: [0.34, 1.56, 0.64, 1]
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default ScaleIn;
