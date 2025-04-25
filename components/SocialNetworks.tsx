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
    <div className="flex justify-center gap-6">
      {socialNetworks.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 hover:scale-110 text-black dark:text-white hover:text-gray-900 dark:hover:text-white"
            aria-label={`Visit my ${social.name} profile`}
          >
            <Icon width={50} height={50} />
          </a>
        );
      })}
    </div>
  );
};
