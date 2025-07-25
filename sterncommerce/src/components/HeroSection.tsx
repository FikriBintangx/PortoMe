"use client";
import React from "react";
import Section from "./Section";
import { motion } from "framer-motion";

const HeroSection: React.FC = () => {
  const title = "STERNCOMMERCE";

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <Section className="text-center">
      <motion.h1
        className="text-5xl md:text-7xl font-bold"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {title.split("").map((char, index) => (
          <motion.span key={index} variants={item}>
            {char}
          </motion.span>
        ))}
      </motion.h1>
    </Section>
  );
};

export default HeroSection;
