module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0f1422",
        "bg-card": "#0b101a",
        "text-primary": "#e6eef6",
        "text-muted": "#94a3b8",
        accent: "#0ea5a4",
        "accent-2": "#7c3aed"
      },
      animation: {
        float: "float 6s ease-in-out infinite"
      },
      keyframes: {
        float: { "0%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" }, "100%": { transform: "translateY(0)" } }
      }
    }
  },
  plugins: []
}
