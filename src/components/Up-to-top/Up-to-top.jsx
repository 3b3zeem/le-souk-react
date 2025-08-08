import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

const Up_top = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <React.Fragment>
      <motion.button
        className="fixed bottom-8 right-8 bg-[#333e2c] border border-[#fff] text-white p-3 rounded shadow-lg hover:bg-[#808080] transition duration-300 z-100 cursor-pointer"
        onClick={scrollToTop}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        title="Arrow Up"
      >
        <ArrowUp size={25} />
      </motion.button>
    </React.Fragment>
  );
};

export default Up_top;
