"use client";

import "@/src/i18n/i18n";
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { useTranslation } from "react-i18next"

interface BackButtonProps {
    href: string
    text?: string
    variant?: "default" | "outline" | "ghost"
    className?: string
}

const BackButton = ({
    href,
    text,
    variant = "outline",
    className = ""
}: BackButtonProps) => {
    const { t } = useTranslation();
    const displayText = text || t("blog.backButton.default");
    
    return (
        <Link href={href}>
            <Button
                variant={variant}
                className={`bg-transparent ${className}`}
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {displayText}
            </Button>
        </Link>
    )
}

export default BackButton