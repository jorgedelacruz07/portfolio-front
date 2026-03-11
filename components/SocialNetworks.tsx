import { FC } from "react";
import { LinkedinIcon } from "./svgs/Linkedin";
import { GithubIcon } from "./svgs/Github";

export const socialNetworks = [
  {
    id: 1,
    slug: "linkedin",
    name: "Linkedin",
    icon: LinkedinIcon,
    url: "https://www.linkedin.com/in/jorgedelacruz07",
  },
  {
    id: 2,
    slug: "github",
    name: "GitHub",
    icon: GithubIcon,
    url: "https://github.com/jorgedelacruz07",
  },
];

export const SocialNetworks: FC = () => {
  return (
    <div className="flex flex-wrap justify-start gap-3">
      {socialNetworks.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-foreground/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:bg-white/[0.08] hover:text-primary"
            aria-label={`Visit my ${social.name} profile`}
          >
            <Icon width={22} height={22} />
          </a>
        );
      })}
    </div>
  );
};
