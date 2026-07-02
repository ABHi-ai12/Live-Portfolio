import React from 'react';
import { motion } from 'framer-motion';

const SplitTextReveal = ({ 
  text, 
  className = '', 
  as: Tag = 'span',
  splitBy = 'word', // 'word' | 'char'
  staggerDelay = 0.04,
  duration = 0.6,
  delay = 0,
  once = true 
}) => {
  const items = splitBy === 'char' 
    ? text.split('') 
    : text.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 40, 
      rotateX: -40,
      filter: 'blur(4px)'
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      filter: 'blur(0px)',
      transition: { 
        duration,
        ease: [0.25, 0.46, 0.45, 0.94] 
      } 
    },
  };

  return (
    <Tag className={className} style={{ perspective: '800px' }}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: '-50px' }}
        className="inline"
      >
        {items.map((item, i) => (
          <motion.span
            key={i}
            variants={itemVariants}
            className="inline-block"
            style={{ 
              transformOrigin: 'bottom center',
              willChange: 'transform, opacity, filter'
            }}
          >
            {item}
            {splitBy === 'word' && i < items.length - 1 ? '\u00A0' : ''}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
};

export default SplitTextReveal;
