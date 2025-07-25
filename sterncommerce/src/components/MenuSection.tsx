"use client";
import React from "react";
import Section from "./Section";
import { motion } from "framer-motion";
import products from "../data/products.json";

const MenuSection: React.FC = () => {
  return (
    <Section>
      <h2 className="text-3xl font-bold text-center mb-12">Our Products</h2>
      <div className="bg-gray-800 rounded-2xl p-4 md:p-8 shadow-2xl">
        <div className="bg-black rounded-t-lg h-8 flex items-center justify-start px-4">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="bg-white p-4 md:p-8 rounded-b-lg overflow-y-auto h-96">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {products.map((product) => (
              <motion.div
                key={product.id}
                className="border rounded-lg p-4 text-center"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover mb-4"
                />
                <h3 className="font-bold">{product.name}</h3>
                <p className="text-gray-600">${product.price}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default MenuSection;
