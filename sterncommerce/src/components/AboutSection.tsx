"use client";
import React from "react";
import Section from "./Section";
import { motion } from "framer-motion";

const AboutSection: React.FC = () => {
  return (
    <Section>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-center mb-8">
          About STERNCOMMERCE
        </h2>
        <p className="text-lg text-center max-w-2xl mx-auto">
          STERNCOMMERCE is not just another e-commerce store. We are a
          community-driven platform that brings you the latest trends and styles,
          curated for the Gen Z lifestyle. Our mission is to empower you to
          express your unique identity through fashion.
        </p>
      </motion.div>
    </Section>
  );
};

export default AboutSection;
