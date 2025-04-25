import React from "react";
import { Star } from "lucide-react";

const renderStars = (rating) => {
  const totalStars = 5;
  const filledStars = Math.floor(rating);
  const decimalPart = rating - filledStars;
  const stars = [];

  for (let i = 0; i < filledStars; i++) {
    stars.push(
      <Star
        key={`filled-${i}`}
        size={16}
        className="inline-block text-yellow-400 fill-yellow-400"
      />
    );
  }

  if (decimalPart > 0 && filledStars < totalStars) {
    const fillPercentage = decimalPart * 100;
    stars.push(
      <span key="partial" className="relative inline-block">
        <Star
          size={16}
          className="absolute text-gray-300"
        />
        <Star
          size={16}
          className="text-yellow-400 fill-yellow-400"
          style={{
            clipPath: `inset(0 ${100 - fillPercentage}% 0 0)`,
          }}
        />
      </span>
    );
  }

  const remainingStars = totalStars - filledStars - (decimalPart > 0 ? 1 : 0);
  for (let i = 0; i < remainingStars; i++) {
    stars.push(
      <Star
        key={`empty-${i}`}
        size={16}
        className="inline-block text-gray-300"
      />
    );
  }

  return stars;
};

export { renderStars };