"use client";

import "@/src/i18n/i18n";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const currentLang = i18n.language || "vi";

  // Load language from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("i18nextLng");
      if (savedLang && savedLang !== i18n.language) {
        i18n.changeLanguage(savedLang);
      }
    }
  }, [i18n]);

  const handleChange = (lang: "vi" | "en") => {
    if (lang === currentLang) return;
    i18n.changeLanguage(lang);
    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("i18nextLng", lang);
    }
  };

  return (
    <div className="flex items-center gap-1 text-xs sm:text-sm">
      <button
        type="button"
        onClick={() => handleChange("vi")}
        className={`px-2 py-1 rounded ${
          currentLang.startsWith("vi")
            ? "bg-black text-white"
            : "text-gray-600 hover:text-black"
        }`}
      >
        VI
      </button>
      <span className="text-gray-400">/</span>
      <button
        type="button"
        onClick={() => handleChange("en")}
        className={`px-2 py-1 rounded ${
          currentLang.startsWith("en")
            ? "bg-black text-white"
            : "text-gray-600 hover:text-black"
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;

