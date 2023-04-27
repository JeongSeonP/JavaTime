import daisyui from "daisyui";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {},
    extend: {
      colors: {
        "base-color": "efeae6",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    styled: true,
    themes: [
      "cupcake",
      {
        mytheme: {
          base: "efeae6",
        },
      },
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
  },
};
