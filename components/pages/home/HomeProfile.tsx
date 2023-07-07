import Image from "next/image";
import { profile } from "../../../data/content";
import { LinkedinIcon } from "../../svgs/Linkedin";
import { GithubIcon } from "../../svgs/Github";

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
    <div className="md:flex items-center justify-between gap-4">
      <div className="flex-none w-full md:w-2/3">
        <h1 className="text-xl md:text-2xl lg:text-3xl text-center md:text-left font-semibold uppercase">
          {profile.name}
        </h1>
        <div className="text-sm md:text-base my-2 text-justify italic">
          {profile.description}
        </div>
        <div className="my-4">
          <span className="text-xs md:text-sm italic">
            For more information, please see my{" "}
            <a
              className="underline"
              href="/documents/jorgedelacruz_cv.pdf"
              target="_blank"
            >
              CV
            </a>
          </span>
        </div>
        <div className="my-2 flex gap-2">
          {socialNetworks.map((social) => {
            const Icon = social.icon;
            return (
              <div key={social.id} className="w-[40px] h-[40px]">
                <a href={social.url} target="_blank" rel="noreferrer">
                  {Icon}
                </a>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex-1 px-8 text-center w-full">
        <Image
          src="/images/jorge.jpg"
          className="rounded-full"
          alt=""
          width={180}
          height={180}
        />
      </div>
    </div>
  );
};
