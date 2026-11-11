import { FC } from "react";
import { LinkedinIcon } from "./svgs/Linkedin";
import { GithubIcon } from "./svgs/Github";
import { XIcon } from "./svgs/X";

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
  {
    id: 3,
    slug: "x",
    name: "X",
    icon: XIcon,
    url: "https://x.com/jorgedlcpdev",
  },
];

export const SocialNetworks: FC = () => {
  return (
    <div className="flex flex-wrap justify-start gap-2">
      {socialNetworks.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={`Visit my ${social.name} profile`}
          >
            <Icon width={16} height={16} />
          </a>
        );
      })}
    </div>
  );
};
