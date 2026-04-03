import React from "react";
import { useNavigate } from "react-router-dom";

const BRAND = "#00477f";
const ACCENT = "#d06549";

const ExperienceSection = () => {
  const navigate = useNavigate();

  return (
    <section
      className="mt-20 flex items-center justify-center px-6 py-20"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="text-center max-w-2xl">
        {/* Heading */}
        <h1
          className="text-4xl md:text-5xl font-bold mb-6"
          style={{ color: BRAND }}
        >
          We’re Coming Soon
        </h1>

        {/* Accent line */}
        <div
          className="w-20 h-1 mx-auto mb-6 rounded-full"
          style={{ backgroundColor: ACCENT }}
        ></div>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-gray-600 mb-10">
          Exciting things are on the way. We’re working hard to bring you an
          amazing experience. Stay tuned!
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Notify Button */}
          <button
            className="px-6 py-3 rounded-2xl font-medium shadow-md transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: ACCENT,
              color: "#ffffff",
            }}
          >
            Notify Me
          </button>

          {/* Back to Home Button */}
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-2xl font-medium border-2 transition-all duration-300 hover:scale-105 hover:bg-opacity-10"
            style={{
              borderColor: BRAND,
              color: BRAND,
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;