import React from "react";
import { motion, Transition, Variants } from "framer-motion";
import styles from "./LoadingIndicator.module.css";

const ContainerVariants = {
  initial: {
    transition: {
      staggerChildren: 0.2,
    },
  },
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const DotVariants: Variants = {
  initial: {
    y: "0%",
  },
  animate: {
    y: "100%",
  },
};

const DotTransition: Transition = {
  duration: 0.5,
  repeat: Infinity,
  repeatType: "reverse",
  ease: "easeInOut",
};

interface ILoadingIndicatorProps {
  className?: string;
  light?: boolean;
}

const LoadingIndicator = ({ light, className }: ILoadingIndicatorProps) => {
  const dotClasses = `${styles.loadingDot} ${
    light ? styles.light : styles.dark
  }`;
  return (
    <div className={`${className || ""} ${styles.animationContainer}`}>
      <motion.div
        className={styles.dotContainer}
        variants={ContainerVariants}
        initial="initial"
        animate="animate">
        <motion.span
          className={dotClasses}
          variants={DotVariants}
          transition={DotTransition}
        />
        <motion.span
          className={dotClasses}
          variants={DotVariants}
          transition={DotTransition}
        />
        <motion.span
          className={dotClasses}
          variants={DotVariants}
          transition={DotTransition}
        />
      </motion.div>
    </div>
  );
};

export default LoadingIndicator;
