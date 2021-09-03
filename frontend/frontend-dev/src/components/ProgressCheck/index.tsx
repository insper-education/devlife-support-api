import React from "react";
import { motion } from "framer-motion";

interface ProgressCheckProps {
  className?: string;
  progress: number; // Should be in [0.0, 1.0]
}

const defaultProps = {
  progress: 1,
};

const ProgressCheck = ({ className, progress }: ProgressCheckProps) => {
  const length = 2 * 90 * Math.PI;
  if (progress < 0) progress = 0;
  if (progress > 1) progress = 1;

  const checkLength = 3 * 50 * Math.sqrt(2);

  const circleVariants = {
    start: {
      strokeDashoffset: length,
    },
    progress: {
      strokeDashoffset: length * (1 - progress),
      transition: {
        duration: 0.5,
      },
    },
  };
  const checkVariants = {
    start: {
      strokeDashoffset: checkLength,
    },
    progress: {
      strokeDashoffset: 0,
      transition: {
        duration: 0.5,
        delay: 0.2,
      },
    },
  };

  return (
    <svg
      className={className || ""}
      id="svg"
      width="200"
      height="200"
      viewBox="0 0 200 200"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg">
      <circle
        r="90"
        cx="100"
        cy="100"
        fill="transparent"
        stroke="#cad8ca"
        strokeWidth="20"
      />
      <motion.circle
        r="90"
        cx="100"
        cy="100"
        fill="transparent"
        stroke="#27A5A2"
        transform="rotate(-90 100 100)"
        strokeWidth="20"
        strokeDasharray={`${length}`}
        strokeDashoffset={`${length * (1 - progress)}`}
        variants={circleVariants}
        initial="start"
        animate="progress"
      />
      {progress === 1 && (
        <motion.path
          d="M50 80L100 130L200 20"
          fill="transparent"
          stroke="#27A5A2"
          strokeWidth="20"
          strokeDasharray={`${checkLength}`}
          strokeDashoffset={"0"}
          variants={checkVariants}
          initial="start"
          animate="progress"
        />
      )}
    </svg>
  );
};

ProgressCheck.defaultProps = defaultProps;

export default ProgressCheck;
