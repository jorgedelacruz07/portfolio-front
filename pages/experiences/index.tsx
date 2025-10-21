import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { addHours, format } from "date-fns";
import { useGetExperiences } from "../../hooks/queries";
import { LoadingSpinner } from "../../components/LoadingSpinner";

const Experiences: NextPage = () => {
  const { data: experiences = [], isLoading, error } = useGetExperiences();

  if (isLoading) {
    return (
      <div className="container mx-auto flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error loading experiences</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-cyan-600 hover:text-cyan-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          My Experiences
        </h1>
        <div className="space-y-6">
          {experiences.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No experiences available at the moment.</p>
            </div>
          ) : (
            experiences.map((experience) => (
              <div key={experience.slug} className="group">
                <div className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      {experience.image?.src && (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                          <Image
                            src={experience.image.src}
                            alt={experience.company || 'Company'}
                            width={48}
                            height={48}
                            className="object-cover"
                            sizes="48px"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h2 className="text-lg md:text-xl font-semibold text-black dark:text-gray-300 group-hover:text-gray-600 dark:group-hover:text-white transition-colors duration-300">
                          <Link href={`/experiences/${experience.slug}`}>
                            {experience.jobTitle || 'Position'}
                          </Link>
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 font-semibold">
                          {experience.company || 'Company'}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {experience.from ? `${format(
                          addHours(new Date(experience.from), 5),
                          "MMM yyyy"
                        )} - ${
                          experience.to
                            ? format(
                                addHours(new Date(experience.to), 5),
                                "MMM yyyy"
                              )
                            : "Present"
                        }` : 'No dates available'}
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300">
                      {experience.jobDescription || 'No description available'}
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Experiences;
