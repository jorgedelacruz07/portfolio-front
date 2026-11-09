import { Download } from "lucide-react";
import { profile } from "@/data/content";
import { OptimizedImage } from "@/components/OptimizedImage";
import { SocialNetworks } from "@/components/SocialNetworks";
import { Button } from "@/components/ui/button";
import { profileFallback } from "@/lib/profile-fallback";
import { safeHref } from "@/lib/safe-href";
import type { TProfile } from "@/types/portfolio";

type HomeProfileProps = {
  cmsProfile?: TProfile;
};

export const HomeProfile = ({ cmsProfile }: HomeProfileProps) => {
  const currentProfile = {
    name: cmsProfile?.name || profile.name,
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
        event_label: "Jorge de la Cruz CV",
      });
    }
  };

  return (
    <section className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_220px]">
      <div className="space-y-6">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2 text-foreground">
            <span
              className="h-1.5 w-1.5 rounded-full bg-foreground"
              aria-hidden="true"
            />
            {currentProfile.availability}
          </span>
          <span>{currentProfile.location}</span>
        </p>

        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {profileFallback.name}
          </h1>
          <p className="max-w-xl text-lg text-foreground">
            {profileFallback.headline}
          </p>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {currentProfile.shortBio}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={handleDownloadClick} asChild>
            {safeHref(
              currentProfile.resumeUrl || "/documents/jorgedelacruz_cv.pdf",
              {
                sameOriginPath: true,
              },
            ) ? (
              <a
                href={
                  safeHref(
                    currentProfile.resumeUrl ||
                      "/documents/jorgedelacruz_cv.pdf",
                    {
                      sameOriginPath: true,
                    },
                  ) ?? undefined
                }
                download
              >
                <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                Download CV
              </a>
            ) : (
              <span>Download CV</span>
            )}
          </Button>
          {safeHref(`mailto:${currentProfile.contactEmail}`, {
            mailto: true,
          }) ? (
            <Button asChild variant="outline">
              <a href={`mailto:${currentProfile.contactEmail}`}>Get in touch</a>
            </Button>
          ) : (
            <span className="text-sm text-muted-foreground">Get in touch</span>
          )}
          {safeHref(`mailto:${currentProfile.contactEmail}`, {
            mailto: true,
          }) ? (
            <a
              href={`mailto:${currentProfile.contactEmail}`}
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {currentProfile.contactEmail}
            </a>
          ) : (
            <span className="text-sm text-muted-foreground">
              {currentProfile.contactEmail}
            </span>
          )}
        </div>

        <SocialNetworks />
      </div>

      <div className="mx-auto w-full max-w-[220px] lg:mx-0 lg:justify-self-end">
        <OptimizedImage
          src={currentProfile.profileImage?.src || profile.image}
          avifSrc="/images/jorge.avif"
          alt={currentProfile.name}
          width={480}
          height={600}
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="aspect-[4/5] w-full rounded-lg border border-border object-cover object-center"
        />
      </div>
    </section>
  );
};
