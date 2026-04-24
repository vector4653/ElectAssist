import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

type AnimDirection = 'up' | 'down' | 'left' | 'right' | 'fade';

interface ScrollSectionProps {
  children: React.ReactNode;
  direction?: AnimDirection;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

const directionMap: Record<AnimDirection, { x: number; y: number }> = {
  up: { x: 0, y: 60 },
  down: { x: 0, y: -60 },
  left: { x: 60, y: 0 },
  right: { x: -60, y: 0 },
  fade: { x: 0, y: 0 },
};

export default function ScrollSection({
  children,
  direction = 'up',
  delay = 0,
  className = '',
  style = {},
}: ScrollSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const offset = directionMap[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay }}
    >
      {children}
    </motion.div>
  );
}
