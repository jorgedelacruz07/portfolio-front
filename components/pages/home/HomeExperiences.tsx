import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { TExperience } from "../../../types/experience";

type Props = {
  experiences: TExperience[];
};

export const HomeExperiences: FC<Props> = ({ experiences }) => {
  return (
    <div className="my-4 md:my-8">
      <h3 className="text-xl md:text-2xl">Experiences</h3>
      <div className="py-4 md:py-6">
        <ul>
          {experiences.map((experience) => (
            <li key={experience.slug}>
              <div className="flex gap-4 items-center">
                <div className="max-w-[40px] md:max-w-[90px]">
                  <Image
                    src={experience?.image?.src || "/images/placeholder.jpg"}
                    className="rounded-lg"
                    alt=""
                    width={180}
                    height={180}
                  />
                </div>
                <div>
                  <Link href={`/experiences#${experience.slug}`}>
                    <a className="text-sm md:text-base">{experience.company}</a>
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
