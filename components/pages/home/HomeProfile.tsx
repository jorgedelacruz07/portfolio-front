import { ArrowUpRight, Download } from "lucide-react";

import { profile } from "@/data/content";
import { OptimizedImage } from "@/components/OptimizedImage";
import { SocialNetworks } from "@/components/SocialNetworks";
import { Button } from "@/components/ui/button";
import { profileFallback } from "@/lib/profile-fallback";
import { mailtoHref, safeHref } from "@/lib/safe-href";
import type { CareerSnapshot } from "@/lib/experience-groups";
import type { TProfile } from "@/types/portfolio";

type HomeProfileProps = {
  cmsProfile?: TProfile;
  snapshot?: CareerSnapshot | null;
};

export const HomeProfile = ({ cmsProfile, snapshot }: HomeProfileProps) => {
  const currentProfile = {
    name: cmsProfile?.name || profileFallback.name,
    headline: cmsProfile?.headline || profileFallback.headline,
    shortBio: cmsProfile?.shortBio || profileFallback.shortBio,
    location: cmsProfile?.location || profileFallback.location,
    availability: cmsProfile?.availability || profileFallback.availability,
    profileImage: cmsProfile?.profileImage?.src
      ? cmsProfile.profileImage
      : { src: profile.image },
    resumeUrl: cmsProfile?.resumeUrl || profileFallback.resumeUrl,
    contactEmail: cmsProfile?.contactEmail || profileFallback.contactEmail,
  };

  const handleDownloadClick = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "download", {
        event_category: "CV",
        event_label: "Jorge de la Cruz Padilla CV",
      });
    }
  };

  const resumeHref = safeHref(
    currentProfile.resumeUrl || "/documents/jorgedelacruz_cv.pdf",
    { sameOriginPath: true },
  );
  const contactHref = mailtoHref(currentProfile.contactEmail);

  return (
    <section className="relative -mx-4 overflow-hidden border-b border-border/80 px-4 pb-8 pt-2 sm:-mx-6 sm:px-6 sm:pb-16 sm:pt-10">
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,21rem)] lg:items-center lg:gap-16">
        <div className="space-y-5 sm:space-y-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-500/[0.07] px-3 py-1.5 text-xs font-medium text-emerald-800 dark:border-emerald-400/20 dark:text-emerald-300">
              <span
                className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_hsl(145_65%_45%_/_0.14)]"
                aria-hidden="true"
              />
              {currentProfile.availability}
            </span>
            <span className="mono-label text-muted-foreground">
              {currentProfile.location} · UTC-5
            </span>
          </div>

          <div className="space-y-3 sm:space-y-5">
            <p className="mono-label flex items-center gap-3 text-primary">
              <span className="h-px w-8 bg-primary/40" aria-hidden="true" />
              Full-stack product engineer
            </p>
            <h1 className="max-w-3xl text-[2.5rem] font-semibold leading-[0.98] tracking-[-0.055em] text-foreground sm:text-7xl">
              {currentProfile.name}
            </h1>
            <p className="max-w-2xl text-xl leading-snug text-foreground/90 sm:text-2xl">
              {currentProfile.headline}
            </p>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {currentProfile.shortBio}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={handleDownloadClick} asChild>
              {resumeHref ? (
                <a href={resumeHref} download>
                  <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                  Download CV
                </a>
              ) : (
                <span>Download CV</span>
              )}
            </Button>
            {contactHref ? (
              <Button asChild variant="outline">
                <a href={contactHref}>
                  Get in touch
                  <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            ) : null}
            {contactHref ? (
              <a
                href={contactHref}
                className="hover-underline text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {currentProfile.contactEmail}
              </a>
            ) : (
              <span className="text-sm text-muted-foreground">
                {currentProfile.contactEmail}
              </span>
            )}
          </div>

          {snapshot ? (
            <dl className="grid grid-cols-2 gap-x-8 gap-y-5 border-t border-border/80 pt-7 sm:flex sm:flex-wrap sm:gap-x-12">
              <div>
                <dt className="mono-label text-muted-foreground">Experience</dt>
                <dd className="mt-1 text-2xl font-bold tracking-tight text-foreground tabular-nums">
                  {snapshot.years}+ yrs
                </dd>
              </div>
              <div>
                <dt className="mono-label text-muted-foreground">
                  Track record
                </dt>
                <dd className="mt-1 text-2xl font-bold tracking-tight text-foreground tabular-nums">
                  {snapshot.roles} roles
                </dd>
                <dd className="text-xs text-muted-foreground">
                  across {snapshot.companies} companies
                </dd>
              </div>
              <div>
                <dt className="mono-label text-muted-foreground">Focus</dt>
                <dd className="mt-1 text-sm font-semibold leading-snug text-foreground">
                  React · Node · Cloud
                </dd>
                <dd className="text-xs text-muted-foreground">
                  End-to-end product delivery
                </dd>
              </div>
            </dl>
          ) : null}

          <SocialNetworks />
        </div>

        <div className="relative mx-auto hidden w-full max-w-[19rem] lg:mx-0 lg:block lg:justify-self-end">
          <div
            className="absolute -inset-3 rounded-[1.65rem] border border-border/70 bg-primary/[0.025]"
            aria-hidden="true"
          />
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-lift">
            <OptimizedImage
              src={currentProfile.profileImage?.src || profile.image}
              avifSrc="/images/jorge.avif"
              alt={currentProfile.name}
              width={480}
              height={600}
              fetchPriority="high"
              loading="eager"
              decoding="async"
              className="aspect-[4/5] w-full object-cover object-center"
            />
            {snapshot?.current ? (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-5 pb-5 pt-12">
                <p className="mono-label text-white/65">Currently</p>
                <p className="mt-1 text-sm font-semibold leading-tight text-white">
                  {snapshot.current.title}
                </p>
                <p className="text-xs text-white/70">
                  {snapshot.current.company}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};
