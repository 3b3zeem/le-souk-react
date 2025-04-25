import React from "react";
import { BeatLoader } from "react-spinners";

import { hourglass } from "ldrs";
hourglass.register();

export default function Loader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <l-hourglass
        size="40"
        bg-opacity="0.1"
        speed="1.75"
        color="#1e70d0"
      ></l-hourglass>
    </div>
  );
}
