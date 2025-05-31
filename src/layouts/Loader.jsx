import { Helix } from "ldrs/react";
import "ldrs/react/Helix.css";

import { DotPulse } from "ldrs/react";
import "ldrs/react/DotPulse.css";
import { useLanguage } from "../context/Language/LanguageContext";

export default function Loader() {
  const { language } = useLanguage();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        padding: "2rem 0",
      }}
    >
      <div
        style={{
          padding: "2.5rem 2.5rem 1.5rem 2.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Helix size="70" speed="2.2" color="#1e70d0" />
        <span
          style={{
            marginTop: "1.5rem",
            color: "#1e70d0",
            fontWeight: 600,
            fontSize: "1.1rem",
            letterSpacing: "1px",
            opacity: 0.85,
          }}
        >
          {language === "ar" ? "جاري التحميل" : "Loading"}{" "}
          <DotPulse size="25" speed="1.3" color="#1e70d0" />
        </span>
      </div>
    </div>
  );
}
