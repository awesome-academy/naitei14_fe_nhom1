"use client";

import "@/src/i18n/i18n";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  // Use state to avoid initial flicker and sync with localStorage
  const [currentLang, setCurrentLang] = useState<"vi" | "en">(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("i18nextLng");
      if (savedLang === "vi" || savedLang === "en") {
        return savedLang;
      }
    }
    const lang = i18n.language || "vi";
    return lang.startsWith("en") ? "en" : "vi";
  });

  // Ensure i18n uses the state value
  useEffect(() => {
    if (i18n.language !== currentLang) {
      i18n.changeLanguage(currentLang);
    }
  }, [i18n, currentLang]);

  const handleChange = (lang: "vi" | "en") => {
    if (lang === currentLang) return;
    setCurrentLang(lang);
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


