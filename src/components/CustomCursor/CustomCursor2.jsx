import { useEffect, useState } from "react";
import "./CustomCursor.css";

const CustomCursor2 = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const move = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const hoverElements = () => {
      const elements = document.querySelectorAll("a, button, .hover-target");

      elements.forEach((el) => {
        el.addEventListener("mouseenter", () => setIsActive(true));
        el.addEventListener("mouseleave", () => setIsActive(false));
      });

      return () => {
        elements.forEach((el) => {
          el.removeEventListener("mouseenter", () => setIsActive(true));
          el.removeEventListener("mouseleave", () => setIsActive(false));
        });
      };
    };

    const selectionWatcher = () => {
      const handleSelection = () => {
        const selected = window.getSelection();
        setIsActive(selected && selected.toString().length > 0);
      };
      document.addEventListener("selectionchange", handleSelection);
      return () => document.removeEventListener("selectionchange", handleSelection);
    };

    window.addEventListener("mousemove", move);
    const cleanHover = hoverElements();
    const cleanSelection = selectionWatcher();

    return () => {
      window.removeEventListener("mousemove", move);
      cleanHover();
      cleanSelection();
    };
  }, []);

  return (
    <div
      className="custom-cursor"
      style={{ top: `${position.y}px`, left: `${position.x}px` }}
    >
      <div className={`cursor-inner ${isActive ? "active" : ""}`} />
      <div className={`cursor-ring ${isActive ? "active" : ""}`} />
    </div>
  );
};

export default CustomCursor2;
