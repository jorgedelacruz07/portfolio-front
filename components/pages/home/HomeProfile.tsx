import Image from "next/image";
import { profile } from "../../../data/content";
import { LinkedinIcon } from "../../svgs/Linkedin";
import { GithubIcon } from "../../svgs/Github";
import classNames from "classnames";

const socialNetworks = [
  {
    id: 1,
    slug: "linkedin",
    name: "Linkedin",
    icon: <LinkedinIcon />,
    image: {
      src: "/images/linkedin.png",
    },
    url: "https://www.linkedin.com/in/jorgedelacruz07",
  },
  {
    id: 2,
    slug: "github",
    name: "GitHub",
    icon: <GithubIcon />,
    image: {
      src: "/images/github.png",
    },
    url: "https://github.com/jorgedelacruz07",
  },
];

export const HomeProfile = () => {
  return (
    <div className="md:flex items-center justify-between gap-8">
      <div className="flex-none w-full md:w-2/3">
        <h1 className="text-2xl md:text-3xl lg:text-4xl text-center md:text-left font-bold text-gray-900 dark:text-gray-100 mb-4">
          {profile.name}
        </h1>
        <div className="text-base md:text-lg my-4 text-justify text-gray-700 dark:text-gray-300 leading-relaxed">
          {profile.description}
        </div>
        <div className="my-6">
          <a
            className={classNames(
              "inline-flex items-center px-4 py-2.5 rounded-lg hover:shadow-md transition-colors duration-300",
              "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
            href="/documents/jorgedelacruz_cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="mr-2 font-medium">View my CV</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>
        <div className="hidden my-4 md:flex gap-4">
          {socialNetworks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className={classNames(
                  "w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-200",
                  "bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700"
                )}
              >
                {Icon}
              </a>
            );
          })}
        </div>
      </div>
      <div className="flex-1 px-8 text-center w-full">
        <div className="relative inline-block">
          <Image
            src="/images/jorge.jpg"
            className="rounded-full shadow-lg"
            alt="Jorge de la Cruz"
            width={200}
            height={200}
          />
        </div>
      </div>
      <div className="md:hidden my-6 flex justify-center gap-4">
        {socialNetworks.map((social) => {
          const Icon = social.icon;
          return (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className={classNames(
                "w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-200",
                "bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700"
              )}
            >
              {Icon}
            </a>
          );
        })}
      </div>
    </div>
  );
};
