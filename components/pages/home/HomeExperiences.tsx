import { memo } from "react";
import { TExperience } from "../../../types/experience";
import Link from "next/link";
import Image from "next/image";
import { ExternalLinkIcon } from "../../icons/ExternalLinkIcon";

type Props = {
  experiences: TExperience[];
};

const HomeExperiencesComponent = ({ experiences }: Props) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          Work Experience
        </h2>
        <div className="text-cyan-800 dark:text-gray-400 hover:text-cyan-700 dark:hover:text-gray-100 transition-colors duration-300 font-semibold">
          <Link href="/experiences">View All</Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiences.slice(0, 3).map((experience) => (
          <div key={experience.slug} className="group">
            <div className="h-full relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                    <Image
                      src={experience.image.src}
                      alt={experience.company}
                      width={48}
                      height={48}
                      sizes="(max-width: 768px) 48px, 48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="text-lg font-semibold text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors duration-300">
                    <Link href={`/experiences/${experience.slug}`}>
                      {experience.company}
                    </Link>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {experience.jobTitle}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>
                      {experience.from} -{" "}
                      {experience.to ? experience.to : "Present"}
                    </span>
                  </div>
                </div>

                {experience.technologies &&
                  experience.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {experience.technologies.map((tech) => (
                        <span
                          key={tech.id}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300"
                        >
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  )}

                {experience.companyUrl && (
                  <div className="mt-4">
                    <a
                      href={experience.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-cyan-800 dark:text-gray-400 hover:text-cyan-700 dark:hover:text-gray-100 transition-colors duration-300 font-semibold"
                    >
                      Visit Company
                      <ExternalLinkIcon className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

HomeExperiencesComponent.displayName = 'HomeExperiences';
const HomeExperiences = memo(HomeExperiencesComponent);
export default HomeExperiences;
