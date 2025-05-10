module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        customBlue: "#1a76d1",
        crimson: "#a70000",
      },
      spacing: {
        "40px": "40px",
      },
      transitionProperty: {
        width: "width",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".tab": {
          position: "relative",
          cursor: "pointer",
          fontWeight: "bold",
          transition: "color 0.3s ease-in-out",
          color: "var(--tab-color, #1a76d1)",
        },
        ".tab::after": {
          content: '""',
          position: "absolute",
          left: "0",
          bottom: "var(--tab-border-bottom, -40px)",
          width: "0",
          height: "2px",
          backgroundColor: "var(--tab-hover-color, #1a76d1)",
          transition: "width 0.3s ease-in-out",
        },
        ".tab:hover::after, .tab-selected::after": {
          width: "100%",
        },
        ".tab:hover, .tab-selected": {
          color: "var(--tab-hover-color, #1a76d1)",
        },
      };

      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
