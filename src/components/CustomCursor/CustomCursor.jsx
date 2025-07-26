import { useEffect, useState } from "react";
import "./CustomCursor.css";

const CustomCursor = () => {
  const [ripples, setRipples] = useState([]);

  const createRipple = (e) => {
    const newRipple = {
      x: e.clientX,
      y: e.clientY,
      id: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  useEffect(() => {
    window.addEventListener("click", createRipple);
    return () => window.removeEventListener("click", createRipple);
  }, []);

  return (
    <>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}
    </>
  );
};

export default CustomCursor;
