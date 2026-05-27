export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101820",
        muted: "#61707f",
        line: "#d9e0e7",
        paper: "#f7f8fa",
        brandRed: "#c92337",
        teal: "#0a7c86",
        gold: "#d59b24",
        navy: "#14263d"
      },
      boxShadow: {
        panel: "0 22px 70px rgba(16, 24, 32, 0.14)"
      }
    }
  },
  plugins: []
};
