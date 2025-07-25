"use client";
import React from "react";
import Section from "./Section";
import { motion } from "framer-motion";

const ContactSection: React.FC = () => {
  return (
    <Section className="bg-gray-800 text-white">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>
        <div className="text-center">
          <p className="mb-2">
            Email:{" "}
            <a href="mailto:hello@sterncommerce.com" className="underline">
              hello@sterncommerce.com
            </a>
          </p>
          <p className="mb-2">Phone: (123) 456-7890</p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="#" className="underline">
              Instagram
            </a>
            <a href="#" className="underline">
              Twitter
            </a>
            <a href="#" className="underline">
              TikTok
            </a>
          </div>
        </div>
      </motion.div>
    </Section>
  );
};

export default ContactSection;
