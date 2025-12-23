"use client";

import "@/src/i18n/i18n";
import { User } from "lucide-react";
import type { Testimonial } from "@/src/lib/api";
import { useTranslation } from "react-i18next";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const { t } = useTranslation();
  
  // Map role to translation key
  const getRoleTranslation = (role: string) => {
    if (role.includes("thân thiết") || role.includes("Loyal")) {
      const translated = t("testimonial.role.loyal");
      return translated === "testimonial.role.loyal" ? role : translated;
    }
    if (role.includes("ẩm thực") || role.includes("Culinary")) {
      const translated = t("testimonial.role.chef");
      return translated === "testimonial.role.chef" ? role : translated;
    }
    if (role.includes("sưu tầm") || role.includes("collector")) {
      const translated = t("testimonial.role.collector");
      return translated === "testimonial.role.collector" ? role : translated;
    }
    return role; // Fallback to original if no match
  };
  
  // Map content to translation key based on ID
  const getContentTranslation = (id: string, content: string) => {
    const key = `testimonial.content.${id}`;
    const translated = t(key);
    // If translation doesn't exist, i18next returns the key, so fallback to original content
    return translated !== key ? translated : content;
  };
  
  const displayRole = getRoleTranslation(testimonial.role);
  const displayContent = getContentTranslation(testimonial.id, testimonial.content);

  return (
    <div className="bg-yellow-100 rounded-lg p-6 lg:p-8 max-w-md mx-auto text-center">
      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center">
        <User className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
      </div>
      <p className="text-gray-700 mb-4 text-sm lg:text-base leading-relaxed">
        &quot;{displayContent}&quot;
      </p>
      <div className="font-semibold text-sm lg:text-base">
        {testimonial.name}
      </div>
      <div className="text-xs lg:text-sm text-gray-600">{displayRole}</div>
    </div>
  );
}
