// src/components/shared/ThemeToggle.jsx

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

function ThemeToggle() {
  // نبدأ بالوضع المظلم كافتراضي
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    // عند تحميل المكون، نطبق الثيم على عنصر `html`
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <div className="flex items-center justify-center rounded-md bg-[#20212C] p-3">
      <Sun className="h-5 w-5 text-gray-400" />
      <button
        onClick={toggleTheme}
        className="mx-4 flex h-5 w-10 items-center rounded-full bg-[#635FC7] p-1 transition-colors"
      >
        <span
          className={`h-4 w-4 rounded-full bg-white transition-transform ${
            theme === "dark" ? "translate-x-4" : "translate-x-0"
          }`}
        ></span>
      </button>
      <Moon className="h-5 w-5 text-gray-400" />
    </div>
  );
}

export default ThemeToggle;
