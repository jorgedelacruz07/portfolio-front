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
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          {profile.description}
        </p>
      </div>
      <div className="pt-4">
        <SocialNetworks />
      </div>
    </div>
  );
};
