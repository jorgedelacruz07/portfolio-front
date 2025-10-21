import Image from "next/image";
import { useRouter } from "next/router";
import { format } from "date-fns";
import Link from "next/link";
import { useGetExperienceBySlug } from "../../hooks/queries";
import { LoadingSpinner } from "../../components/LoadingSpinner";

const ExperiencePage = () => {
  const router = useRouter();
  const { slug } = router.query;
  
  const { data: experience, isLoading, error } = useGetExperienceBySlug(slug);

  if (router.isFallback || isLoading) {
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error loading experience</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
          <Link href="/experiences" className="text-cyan-600 hover:text-cyan-700">
            Back to Experiences
          </Link>
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="container mx-auto flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Experience not found</h1>
          <Link href="/experiences" className="text-cyan-600 hover:text-cyan-700">
            Back to Experiences
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="space-y-8">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-4">
            {experience.image?.src && (
              <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                <Image
                  src={experience.image.src}
                  alt={experience.company}
                  width={64}
                  height={64}
                  className="object-cover"
                  sizes="64px"
                  priority
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {experience.jobTitle}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <h2 className="text-xl text-gray-600 dark:text-gray-300">
                  {experience.company}
                </h2>
                {experience.companyUrl && (
                  <a
                    href={experience.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-cyan-800 dark:text-gray-400 hover:text-cyan-700 dark:hover:text-gray-100 transition-colors duration-300 font-semibold"
                  >
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
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <time>
              {format(new Date(experience.from), "MMMM yyyy")} -{" "}
              {experience.to
                ? format(new Date(experience.to), "MMMM yyyy")
                : "Present"}
            </time>
          </div>
        </header>

        {/* Description */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-300">
            {experience.jobDescription}
          </p>
        </div>

        {/* Company Description */}
        {experience.companyDescription && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              About {experience.company}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {experience.companyDescription}
            </p>
          </div>
        )}

        {/* Technologies */}
        {experience.technologies && experience.technologies.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Technologies Used
            </h2>
            <div className="flex flex-wrap gap-2">
              {experience.technologies.map((tech) => (
                <span
                  key={tech.id}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300"
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="inline-flex items-center text-cyan-800 dark:text-gray-400 hover:text-cyan-700 dark:hover:text-gray-100 transition-colors duration-300 font-semibold">
            <Link href="/experiences">
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Experiences
              </>
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
};


export default ExperiencePage;
