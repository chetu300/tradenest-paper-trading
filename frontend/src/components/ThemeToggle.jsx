import { useTheme } from "../contexts/useTheme.js";

export default function ThemeToggle({ compact = false }) {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} mode`}
      aria-pressed={theme === "light"}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-violet-400/40 bg-violet-500/10 px-3 py-2 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/20"
    >
      <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
      {!compact && <span className="hidden xl:inline">{nextTheme === "light" ? "Light" : "Dark"}</span>}
    </button>
  );
}
