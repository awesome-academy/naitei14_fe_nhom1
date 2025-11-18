import React from "react";
import Image from "next/image";
import TestimonialCard from "@/src/components/products/TestimonialCard";
import TestimonialSkeleton from "@/src/components/products/TestimonialSkeleton";
import { UI_TEXT } from "@/src/constants/ui"; // Assuming import from constants file

interface TestimonialSectionProps {
  testimonials: any[];
  title?: string;
  imageUrl?: string;
}

export default function TestimonialSection({
  testimonials,
  imageUrl = "/Image_Rudu/title-dark.png",
  // C024: Use UI_TEXT constant
  title = UI_TEXT.CUSTOMER_TESTIMONIALS,
}: TestimonialSectionProps) {
  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">{title}</h2>
          <Image
            className="block mx-auto"
            alt="Decorative title image"
            src={imageUrl}
            width={200}
            height={20}
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
