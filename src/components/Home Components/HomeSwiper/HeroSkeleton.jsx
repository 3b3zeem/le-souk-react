const HeroSkeleton = () => {
  return (
    <div className="relative w-full h-[25vh] sm:h-[40vh] md:h-[45vh] lg:h-[80vh] max-h-[600px] mt-7 overflow-hidden bg-gray-200">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
          animation: "shimmer 1.5s infinite",
          backgroundSize: "200% 100%",
        }}
      />

      {/* Bottom Button Skeleton */}
      <div className="absolute bottom-10 left-7 sm:left-15 md:left-40 lg:left-43">
        <div className="w-28 md:w-36 h-10 rounded-full bg-gray-300 overflow-hidden relative">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
              animation: "shimmer 1.5s infinite",
              backgroundSize: "200% 100%",
            }}
          />
        </div>
      </div>

      {/* Keyframes in a style tag */}
      <style>
        {`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
      </style>
    </div>
  );
};

export default HeroSkeleton;
