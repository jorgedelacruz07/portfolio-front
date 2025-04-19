import Image from "next/image";
import { profile } from "../../../data/content";
import { LinkedinIcon } from "../../svgs/Linkedin";
import { GithubIcon } from "../../svgs/Github";
import classNames from "classnames";
import { motion } from "framer-motion";

const socialNetworks = [
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

export const HomeProfile = () => {
  return (
    <div className="md:flex items-center justify-between gap-8 lg:gap-12">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full xl:w-2/3"
      >
        <h1 className="text-3xl md:text-4xl text-center md:text-left font-bold mb-6">
          {profile.name}
        </h1>
        <div className="text-base md:text-lg my-6 text-justify text-gray-700 dark:text-gray-300 leading-relaxed">
          {profile.description}
        </div>
        <div className="my-8">
          <a
            className={classNames(
              "inline-flex items-center px-6 py-3 rounded-lg transition-all duration-300",
              "bg-black dark:bg-white border text-white dark:text-black border-gray-200 dark:border-gray-700"
            )}
            href="/documents/jorgedelacruz_cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="mr-2 font-semibold">View my CV</span>
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
        <div className="hidden my-6 md:flex gap-6">
          {socialNetworks.map((social) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={social.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className={classNames(
                  "w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300"
                )}
                aria-label={`Visit my ${social.name} profile`}
              >
                <Icon />
              </motion.a>
            );
          })}
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center w-full xl:w-1/3"
      >
        <div className="relative inline-block">
          <div className="rounded-full shadow-lg dark:shadow-gray-800/50 flex items-center justify-center overflow-hidden ring-4 ring-cyan-800/20 dark:ring-cyan-700/20">
            <Image
              className="rounded-full hover:scale-105 transition-transform duration-300"
              src="/images/jorge.jpg"
              alt="Jorge de la Cruz"
              width={250}
              height={250}
            />
          </div>
        </div>
      </motion.div>
      <div className="md:hidden my-8 flex justify-center gap-6">
        {socialNetworks.map((social) => {
          const Icon = social.icon;
          return (
            <motion.a
              key={social.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className={classNames(
                "w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300"
              )}
              aria-label={`Visit my ${social.name} profile`}
            >
              <Icon />
            </motion.a>
          );
        })}
      </div>
    </div>
  );
};
