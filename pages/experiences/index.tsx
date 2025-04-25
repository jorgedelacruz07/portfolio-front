import type { GetStaticProps, NextPage } from "next";
import { TExperience } from "../../types/experience";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { addHours, format } from "date-fns";

export const getStaticProps: GetStaticProps = async () => {
  let experiences: TExperience[] = [];

  const url = process.env.NEXT_PUBLIC_API_URL;

  try {
    experiences = await axios
      .get(`${url}/client/experiences`)
      .then((res) => res.data);
  } catch (error) {
    let message = "";
    if (axios.isAxiosError(error)) {
      message = error?.response?.statusText as string;
    }
    console.error({ error: message });
  }

  return {
    props: {
      experiences,
    },
    revalidate: 60,
  };
};

type Props = {
  experiences: TExperience[];
};

const Experiences: NextPage<Props> = ({ experiences }) => {
  return (
    <div>
      <div className="space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          My Experiences
        </h1>
        <div className="space-y-6">
          {experiences.map((experience) => (
            <div key={experience.slug} className="group">
              <div className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    {experience.image?.src && (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                        <Image
                          src={experience.image.src}
                          alt={experience.company}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h2 className="text-lg md:text-xl font-semibold text-black dark:text-gray-300 group-hover:text-gray-600 dark:group-hover:text-white transition-colors duration-300">
                        <Link href={`/experiences/${experience.slug}`}>
                          {experience.jobTitle}
                        </Link>
                      </h2>
                      <div className="text-sm text-gray-600 dark:text-gray-300 font-semibold">
                        {experience.company}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {`${format(
                        addHours(new Date(experience.from), 5),
                        "MMM yyyy"
                      )} - ${
                        experience.to
                          ? format(
                              addHours(new Date(experience.to), 5),
                              "MMM yyyy"
                            )
                          : "Present"
                      }`}
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300">
                    {experience.jobDescription}
                  </p>

                  {experience.technologies &&
                    experience.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
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
                    <div className="pt-2">
                      <a
                        href={experience.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-cyan-800 dark:text-gray-400 hover:text-cyan-700 dark:hover:text-gray-100 transition-colors duration-300 font-semibold"
                      >
                        Visit Company Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experiences;
