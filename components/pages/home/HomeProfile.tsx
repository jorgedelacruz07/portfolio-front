import { motion } from "framer-motion";
import { profile } from "@/data/content";
import { OptimizedImage } from "@/components/OptimizedImage";
import { SocialNetworks } from "@/components/SocialNetworks";
import { DownloadIcon } from "@/components/icons/DownloadIcon";
import { Button } from "@/components/ui/button";
import { homeMotion } from "@/lib/utils";
import type { TProfile } from "@/types/portfolio";

const focusAreas = [
  "React & TypeScript Architecture",
  "Node.js & Cloud APIs",
  "Performance & Web Vitals",
  "Design Systems & UX Engineering",
];

type HomeProfileProps = {
  cmsProfile?: TProfile;
};

export const HomeProfile = ({ cmsProfile }: HomeProfileProps) => {
  const currentProfile = cmsProfile ?? {
    name: profile.name,
    headline: "Building fast, maintainable full-stack products.",
    shortBio:
      "Senior Software Engineer focused on building fast, scalable user interfaces and resilient backend systems with React, TypeScript, Node.js, and cloud infrastructure.",
    location: "Lima, Peru",
    availability: "Available for work",
    profileImage: { src: profile.image },
    resumeUrl: "/documents/jorgedelacruz_cv.pdf",
    contactEmail: "jdelacruzp7@gmail.com",
  };

  const handleDownloadClick = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "download", {
        event_category: "CV",
        event_label: "Jorge de la Cruz CV",
      });
    }
  };

  return (
    <motion.section
      className="relative pt-1 pb-0 md:pt-3"
      variants={homeMotion.section}
      initial="hidden"
      animate="visible"
    >
      <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Left Column: Headline, Bio & Actions */}
        <div className="space-y-4 lg:col-span-8">
          {/* Status & Location Pill */}
          <motion.div
            variants={homeMotion.item}
            className="flex flex-wrap items-center gap-2.5"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 font-mono text-xs text-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>{currentProfile.availability}</span>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              {currentProfile.location}
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.div variants={homeMotion.item} className="space-y-2.5">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Jorge de la Cruz
            </h1>
            <p className="text-lg font-medium text-foreground/90 sm:text-xl md:text-2xl">
              Senior Software Engineer crafting fast, resilient full-stack web
              applications.
            </p>
            <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-muted-foreground">
              {currentProfile.shortBio}
            </p>
          </motion.div>

          {/* Engineering Focus Areas */}
          <motion.div
            variants={homeMotion.item}
            className="flex flex-wrap gap-1.5 pt-0.5"
          >
            {focusAreas.map((area) => (
              <span
                key={area}
                className="craft-pill text-[0.6875rem] sm:text-xs"
              >
                {area}
              </span>
            ))}
          </motion.div>

          {/* Action Buttons & Socials */}
          <motion.div
            variants={homeMotion.item}
            className="flex flex-wrap items-center gap-3 pt-1"
          >
            <Button size="default" onClick={handleDownloadClick} asChild>
              <a
                href={
                  currentProfile.resumeUrl || "/documents/jorgedelacruz_cv.pdf"
                }
                download
                className="flex items-center gap-2 font-mono text-xs font-semibold"
              >
                <DownloadIcon className="h-4 w-4" />
                Download CV
              </a>
            </Button>
            <Button asChild size="default" variant="outline">
              <a
                href={`mailto:${currentProfile.contactEmail}`}
                className="font-mono text-xs font-semibold"
              >
                Get in touch
              </a>
            </Button>
            <div className="border-l border-border/80 pl-3">
              <SocialNetworks />
            </div>
          </motion.div>
        </div>

        {/* Right Column: Editorial Profile Photo */}
        <motion.div
          variants={homeMotion.item}
          className="flex justify-center lg:col-span-4 lg:justify-end"
        >
          <div className="relative w-full max-w-[240px] sm:max-w-[260px]">
            <div className="craft-card overflow-hidden rounded-2xl p-1.5">
              <OptimizedImage
                src={currentProfile.profileImage?.src || profile.image}
                alt={currentProfile.name}
                width={560}
                height={640}
                fetchPriority="high"
                loading="eager"
                className="aspect-[4/5] w-full rounded-xl object-cover object-center grayscale contrast-[1.05] transition-all duration-300 hover:grayscale-0"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
