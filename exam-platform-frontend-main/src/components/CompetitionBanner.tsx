import React from "react";

interface CompetitionBannerProps {
  hasTopMargin?: boolean;
}

const CompetitionBanner: React.FC<CompetitionBannerProps> = ({
  hasTopMargin = false,
}) => {
  return (
    <div
      className={`bg-opacity-0 relative z-40 ${hasTopMargin ? "mt-20" : ""}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Left Sponsor - Optiver */}
          <div className="flex items-center">
            <img
              src="/Optiver.png"
              alt="Optiver"
              className="h-8 sm:h-10 w-auto object-contain"
            />
          </div>

          {/* Center - Competition Name (moved slightly left) */}
          <div className="text-center flex-1 mr-16">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              The Integral Cup
            </h1>
          </div>

          {/* Right Sponsor - QRT */}
          <div className="flex items-center">
            <img
              src="/QRT.png"
              alt="QRT"
              className="h-12 sm:h-14 md:h-16 w-auto object-contain"
              style={{ objectPosition: "center" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionBanner;
