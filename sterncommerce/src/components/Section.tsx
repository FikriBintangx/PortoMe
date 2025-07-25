import React from "react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ children, className }) => {
  return (
    <section className={`py-16 px-4 md:px-8 ${className}`}>
      <div className="container mx-auto">{children}</div>
    </section>
  );
};

export default Section;
