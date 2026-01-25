import React from "react";

const PageLoader: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          {/* Outer ring */}
          <div className="absolute inset-0 border-4 border-border rounded-full"></div>
          {/* Spinning part */}
          <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
          {/* Inner glow */}
          <div className="absolute inset-4 bg-primary/20 rounded-full animate-pulse"></div>
        </div>
        <p className="text-subtext text-lg font-medium animate-pulse">
          جاري التحميل...
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
