import { FC, memo, useMemo, useCallback } from "react";
import Image from "next/image";
import { profile } from "../../../data/content";
import { SocialNetworks } from "../../../components/SocialNetworks";
import { DownloadIcon } from "../../icons/DownloadIcon";

const HomeProfileComponent: FC = () => {
  // Memoize the description paragraphs to prevent unnecessary re-renders
  const descriptionParagraphs = useMemo(() => 
    profile.description.map((paragraph, index) => (
      <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
    )), []
  );

  const handleDownloadClick = useCallback((e: React.MouseEvent) => {
    // Track download event if analytics is available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'download', {
        event_category: 'CV',
        event_label: 'Jorge de la Cruz CV',
      });
    }
  }, []);

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
          sizes="(max-width: 768px) 128px, 160px"
        />
      </div>
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
          {profile.name}
        </h1>
        <div className="text-center max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed space-y-6">
          {descriptionParagraphs}
        </div>
      </div>
      <div className="flex flex-col items-center space-y-6">
        <a
          href="/documents/jorgedelacruz_cv.pdf"
          download
          onClick={handleDownloadClick}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-200"
        >
          <DownloadIcon className="w-5 h-5 mr-2" />
          Download CV
        </a>
        <SocialNetworks />
      </div>
    </div>
  );
};

HomeProfileComponent.displayName = 'HomeProfile';
export const HomeProfile = memo(HomeProfileComponent);
