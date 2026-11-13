import type { ComponentType, FC } from "react";
import { ExternalLink } from "lucide-react";

import type { TProfile } from "@/types/portfolio";
import { GithubIcon } from "./svgs/Github";
import { LinkedinIcon } from "./svgs/Linkedin";
import { XIcon } from "./svgs/X";
import { safeHref } from "@/lib/safe-href";

const iconByLabel: Record<string, ComponentType<{ width?: number; height?: number }>> = {
  linkedin: LinkedinIcon,
  github: GithubIcon,
  x: XIcon,
  twitter: XIcon,
};

export const SocialNetworks: FC<{
  links?: TProfile["socialLinks"];
  variant?: "profile" | "footer";
  ariaLabelTemplate?: string;
}> = ({ links = [], variant = "profile", ariaLabelTemplate = "Visit my {name} profile" }) => {
  const isFooter = variant === "footer";

  return (
    <div className={`flex flex-wrap justify-start ${isFooter ? "gap-3" : "gap-2"}`}>
      {links.map((social, index) => {
        const href = safeHref(social.url);
        if (!href) return null;
        const Icon = iconByLabel[social.label.trim().toLowerCase()] || ExternalLink;
        return (
          <a
            key={`${social.label}-${index}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={
              isFooter
                ? "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
                : "inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
            }
            aria-label={ariaLabelTemplate.replace("{name}", social.label)}
          >
            <Icon width={16} height={16} />
          </a>
        );
      })}
    </div>
  );
};
