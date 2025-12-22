"use client";

import "@/src/i18n/i18n";
import React from "react";
import Image from "next/image";
import TestimonialCard from "@/src/components/products/TestimonialCard";
import TestimonialSkeleton from "@/src/components/products/TestimonialSkeleton";
import { useTranslation } from "react-i18next";
import type { Testimonial } from "@/src/lib/api";

interface TestimonialSectionProps {
  testimonials: Testimonial[];
  title?: string;
  imageUrl?: string;
}

export default function TestimonialSection({
  testimonials,
  imageUrl = "/Image_Rudu/title-dark.png",
  title,
}: TestimonialSectionProps) {
  const { t } = useTranslation();
  const defaultTitle = title || t("home.sections.customerTestimonials");

  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">{defaultTitle}</h2>
          <Image
            className="block mx-auto"
            alt="Decorative title image"
            src={imageUrl}
            width={200}
            height={200}
            style={{ width: "auto", height: "auto" }}
          />
        </div>
        {testimonials.length > 0 ? (
          <TestimonialCard testimonial={testimonials[0]} />
        ) : (
          <TestimonialSkeleton />
        )}
      </div>
    </section>
  );
}
