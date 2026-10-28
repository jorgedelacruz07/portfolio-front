import { useState } from "react";
import type { TExperience } from "@/types/experience";
import { getCompanyMonogram, getCompanyTheme } from "@/lib/company-themes";
import { companyLogos } from "@/lib/company-logos";
import { cn } from "@/lib/utils";

type CompanyLogoProps = {
  experience: Pick<TExperience, "slug" | "company" | "companyLogo" | "image">;
  className?: string;
};

/** Explicit CMS logo, verified local asset, legacy image, then an accessible monogram. */
export function CompanyLogo({ experience, className }: CompanyLogoProps) {
  const [failed, setFailed] = useState<string[]>([]);
  const candidates = [experience.companyLogo, companyLogos[experience.slug], experience.image?.src];
  const source = candidates.find((candidate) => candidate && !failed.includes(candidate));
  const theme = getCompanyTheme(experience.slug, experience.company);

  return (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/80 shadow-sm",
        source ? "bg-white p-1" : theme.iconBg,
        className,
      )}
    >
      {source ? (
        <img
          src={source}
          alt={`${experience.company} logo`}
          width={44}
          height={44}
          className="h-full w-full object-contain"
          loading="lazy"
          decoding="async"
          onError={() => setFailed((previous) => [...previous, source])}
        />
      ) : (
        <span
          role="img"
          aria-label={`${experience.company} logo unavailable`}
          className="font-mono text-xs font-bold tracking-tight"
        >
          {getCompanyMonogram(experience.company)}
        </span>
      )}
    </div>
  );
}
