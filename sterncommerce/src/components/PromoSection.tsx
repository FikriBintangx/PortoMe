"use client";
import React from "react";
import Section from "./Section";
import { motion } from "framer-motion";

const PromoSection: React.FC = () => {
  return (
    <Section className="bg-gray-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-center mb-8">
          Limited Time Offers
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold mb-2">20% Off Everything</h3>
            <p className="text-gray-600">
              Use code <span className="font-bold">GENZ20</span> at checkout.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold mb-2">Buy 1 Get 1 Free</h3>
            <p className="text-gray-600">On selected items.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold mb-2">Free Shipping</h3>
            <p className="text-gray-600">On orders over $50.</p>
          </div>
        </div>
      </motion.div>
    </Section>
  );
};

export default PromoSection;
