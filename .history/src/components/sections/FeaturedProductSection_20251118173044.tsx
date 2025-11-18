import React from "react";
import FeaturedProduct from "@/src/components/products/FeaturedProduct";
import FeaturedProductSkeleton from "@/src/components/products/FeaturedProductSkeleton";
import styles from "./FeaturedProductSection.module.css";

interface FeaturedProductSectionProps {
  product: any;
  backgroundImage?: string;
}

export default function FeaturedProductSection({
  product,
  backgroundImage = "https://i.pravatar.cc/300?img=g1",
}: FeaturedProductSectionProps) {
  return (
    <section
      className={styles.featuredSection}
      style={{
        backgroundImage: `url('${backgroundImage}')`,
      }}
    >
      <div className={styles.overlay} />
      <div className={styles.container}>
        {product ? (
          <FeaturedProduct product={product} />
        ) : (
          <FeaturedProductSkeleton />
        )}
      </div>
    </section>
  );
}
