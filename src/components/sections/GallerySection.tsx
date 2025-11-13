import React from "react";
import Image from "next/image";
import GallerySkeleton from "@/src/components/products/GallerySkeleton";
interface GalleryItem {
  id: string | number;
  src: string;
  alt: string;
  width?: number;
  height?: number;
  gridClass?: string;
}
interface GallerySectionProps {
  gallery: GalleryItem[];
}

export default function GallerySection({ gallery }: GallerySectionProps) {
  return (
    <section className="py-12 lg:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {gallery.length > 0 ? (
          <div className="grid grid-cols-12 grid-rows-4 gap-2 h-[600px] lg:h-[800px]">
            {gallery.map((image, index) => (
              <div
                key={image.id}
                // SỬA: Nếu không có gridClass từ API thì tự tính hoặc dùng class mặc định
                className={
                  image.gridClass ||
                  (index === 0
                    ? "col-span-6 row-span-2"
                    : "col-span-3 row-span-1")
                }
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  // SỬA: Thêm giá trị mặc định nếu API không trả về width/height
                  width={image.width || 600}
                  height={image.height || 400}
                  className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        ) : (
          <GallerySkeleton />
        )}
      </div>
    </section>
  );
}
