"use client";

import "@/src/i18n/i18n";
import BreadcrumbComponent from "@/src/components/breadcrumb/BreadcrumbComponent";
import Image from "next/image";
import titleleftdark from "@/public/Image_Rudu/titleleft-dark.png";
import plant from "@/public/Image_Rudu/plant.jpg";
import { useTranslation } from "react-i18next";

export default function RenderGioiThieuPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-start py-4">
      <BreadcrumbComponent
        items={[{ label: t("breadcrumb.home"), href: "/" }, { label: t("breadcrumb.about") }]}
      />

      <div className="my-6">
        <h1 className="text-2xl font-semibold mb-2">{t("about.title")}</h1>
        <Image src={titleleftdark} alt="Underline" width={70} height={20} />
      </div>

      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="w-full">
            <Image
              src={plant}
              alt="Wine grapes"
              width={600}
              height={400}
              className="w-full h-auto object-cover"
              priority
            />
          </div>

          <div className="space-y-6 text-xs">
            <h2 className="text-xl font-semibold text-gray-800 tracking-wider">
              {t("about.welcome")}
            </h2>

            <div className="space-y-0 text-gray-700 leading-relaxed">
              <p>{t("about.content")}</p>
              <p>{t("about.content2")}</p>
              <p>{t("about.content2")}</p>
              <p>{t("about.content3")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
