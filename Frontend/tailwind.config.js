import plugin from "tailwindcss/plugin"
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette.js";

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        kanit: ["Kanit", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
      animation: {
        'pulse-fast': 'pulse 500ms linear infinite',
      }
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      const colors = flattenColorPalette(theme("colors"));

      matchUtilities(
        {
          "scrollbar-color": (value) => ({
            "--scrollbar-thumb": value,
          }),
        },
        { values: colors }
      );

      matchUtilities(
        {
          "scrollbar-track-color": (value) => ({
            "--scrollbar-track": value,
          }),
        },
        { values: colors }
      );
    }),
  ],
};
