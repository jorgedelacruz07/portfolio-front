import { motion } from "framer-motion";
import { profile } from "@/data/content";
import { OptimizedImage } from "@/components/OptimizedImage";
import { SocialNetworks } from "@/components/SocialNetworks";
import { DownloadIcon } from "@/components/icons/DownloadIcon";
import { Button } from "@/components/ui/button";
import { homeMotion, homePageStyles } from "@/lib/utils";
import type { TProfile } from "@/types/portfolio";

const profileHighlights = [
  "Full-stack apps",
  "AWS + Docker",
  "AI workflows",
  "React + Express",
];

const profileStats = [
  { label: "Years", value: "8+" },
  { label: "Projects", value: "50+" },
  { label: "AI tools", value: "4" },
];

type HomeProfileProps = {
  cmsProfile?: TProfile;
};

export const HomeProfile = ({ cmsProfile }: HomeProfileProps) => {
  const currentProfile = cmsProfile ?? {
    name: profile.name,
    headline: "Building fast, maintainable full-stack products.",
    shortBio:
      "React, Vite, Express, MongoDB, AWS, Docker, and AI workflows that ship cleanly in production.",
    location: "Lima, Peru",
    availability: "Available",
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
      className="glass-panel surface-grid relative overflow-hidden rounded-[1.9rem] px-5 py-5 shadow-premium md:px-6 md:py-6"
      variants={homeMotion.section}
      initial="hidden"
      animate="visible"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.24),transparent_30%),radial-gradient(circle_at_85%_15%,hsl(var(--accent)/0.16),transparent_18%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      <div className={homePageStyles.twoColumn}>
        <div className="space-y-4 lg:col-span-7">
          <motion.div
            variants={homeMotion.item}
            className="flex flex-wrap items-center gap-2"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {currentProfile.availability}
            </div>
            <span className={homePageStyles.metaBadge}>
              {currentProfile.location}
            </span>
          </motion.div>

          <motion.div variants={homeMotion.item} className="space-y-3">
            <p className={homePageStyles.eyebrow}>Senior software engineer</p>
            <h1 className="max-w-4xl text-4xl font-semibold leading-none tracking-tight text-foreground sm:text-5xl xl:text-6xl">
              {currentProfile.headline.includes("fast, maintainable") ? (
                <>
                  Building
                  <span className="text-premium-gradient">
                    {" "}
                    fast, maintainable{" "}
                  </span>
                  full-stack products.
                </>
              ) : (
                currentProfile.headline
              )}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {currentProfile.shortBio}
            </p>
          </motion.div>

          <motion.div
            variants={homeMotion.item}
            className="grid gap-3 sm:grid-cols-3"
          >
            {profileStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.2rem] border border-white/10 bg-black/20 p-4 backdrop-blur-md"
              >
                <p className="text-2xl font-semibold tracking-tight text-foreground">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>

          <motion.div
            variants={homeMotion.item}
            className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]"
          >
            <div className="space-y-3">
              <div className={homePageStyles.metaList}>
                {profileHighlights.map((highlight) => (
                  <span key={highlight} className={homePageStyles.metaBadge}>
                    {highlight}
                  </span>
                ))}
              </div>
              <SocialNetworks />
            </div>

            <div className="flex flex-wrap gap-2 lg:justify-end">
              <Button
                size="lg"
                className="h-10 px-4 text-sm font-semibold"
                onClick={handleDownloadClick}
                asChild
              >
                <a
                  href={
                    currentProfile.resumeUrl ||
                    "/documents/jorgedelacruz_cv.pdf"
                  }
                  download
                  className="inline-flex items-center gap-2"
                >
                  <DownloadIcon className="h-4 w-4" />
                  CV
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-10 px-4 text-sm font-semibold"
              >
                <a href={`mailto:${currentProfile.contactEmail}`}>Contact</a>
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={homeMotion.item}
          className="lg:col-span-5 lg:pl-2"
        >
          <div className="mx-auto grid max-w-[24rem] gap-3">
            <div className="glass-panel relative overflow-hidden rounded-[1.35rem] p-2.5 shadow-premium-lg">
              <div className="relative overflow-hidden rounded-[1.2rem] bg-muted">
                <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-background/75 to-transparent px-4 py-4">
                  <span className="rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/70">
                    Shipping now
                  </span>
                  <span className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/60">
                    AWS + Docker
                  </span>
                </div>

                <OptimizedImage
                  src={currentProfile.profileImage?.src || profile.image}
                  alt={currentProfile.name}
                  width={560}
                  height={640}
                  fetchPriority="high"
                  loading="eager"
                  className="aspect-[4/4.75] w-full object-cover object-center"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.2rem] border border-white/10 bg-black/20 p-4 backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.18em] text-primary/80">
                  Focus
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground">
                  Full-stack delivery, product UX, and production-ready systems.
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-white/10 bg-black/20 p-4 backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.18em] text-primary/80">
                  Approach
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground">
                  Claude Code, Codex, Gemini, and Cursor in the daily loop.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
