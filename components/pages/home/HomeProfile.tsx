import { FC } from "react";
import Image from "next/image";
import { profile } from "../../../data/content";
import { SocialNetworks } from "../../../components/SocialNetworks";

export const HomeProfile: FC = () => {
  return (
    <div className="flex flex-col items-center space-y-6 md:space-y-8">
      <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow-lg transition-transform duration-500 hover:scale-105">
        <Image
          src={profile.image}
          alt={profile.name}
          width={160}
          height={160}
          className="object-cover"
          priority
        />
      </div>
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
          {profile.name}
        </h1>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          {profile.description}
        </p>
      </div>
      <div className="flex flex-col items-center space-y-6">
        <a
          href="/documents/jorgedelacruz_cv.pdf"
          download
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm bg-black  text-white dark:bg-white dark:text-black hover:bg-gray-800 transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download CV
        </a>
        <SocialNetworks />
      </div>
    </div>
  );
};
