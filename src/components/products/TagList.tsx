"use client";

import "@/src/i18n/i18n";
import { Badge } from "@/src/components/ui/badge";
import { useTranslation } from "react-i18next";

interface TagListProps {
    tags: string[];
}

export default function TagList({ tags }: TagListProps) {
    const { t } = useTranslation();

    const getTagLabel = (tag: string) => {
        const map: Record<string, string> = {
            "Rượu Ngoại": t("product.tags.importedWine"),
            "Tết": t("product.tags.lunarNewYear"),
            "Phụ kiện": t("product.tags.accessories"),
            "Cao cấp": t("product.tags.premium"),
            "Giá tốt": t("product.tags.goodPrice"),
            "Ấn tượng": t("product.tags.impressive"),
            "Thơm ngon": t("product.tags.delicious"),
            "Tết mới": t("product.tags.newYear"),
            "Đặc biệt": t("product.tags.special"),
        };

        // Allow passing translation key directly (e.g., "product.tags.importedWine")
        if (tag.startsWith("product.tags.")) {
            const translated = t(tag);
            return translated !== tag ? translated : tag;
        }

        return map[tag] || tag;
    };

    return (
        <div className="mb-6 lg:mb-8">
            <h3 className="text-lg font-bold mb-4 border-b pb-2">
                {t("product.sidebar.tags")}
                <img src="/Image_Rudu/titleleft-dark.png" alt="arrow-trang-tri" />
            </h3>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer hover:bg-yellow-100 text-xs">
                        {getTagLabel(tag)}
                    </Badge>
                ))}
            </div>
        </div>
    )
}
