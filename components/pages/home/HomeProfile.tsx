import Image from "next/image";
import { profile } from "@/data/content";
import { SocialNetworks } from "@/components/SocialNetworks";
import { DownloadIcon } from "@/components/icons/DownloadIcon";
import { Button } from "@/components/ui/button";
import { homePageStyles } from "@/lib/utils";

const profileHighlights = [
  "Next.js architecture",
  "Design systems",
  "Performance tuning",
];

export const HomeProfile = () => {
  const handleDownloadClick = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "download", {
        event_category: "CV",
        event_label: "Jorge de la Cruz CV",
      });
    }
  };

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-gradient-to-br from-background via-background to-primary/5 px-6 py-10 shadow-soft sm:px-8 md:px-10 md:py-14">
      <div className={homePageStyles.twoColumn}>
        <div className="space-y-8">
          <div className="space-y-4">
            <p className={homePageStyles.eyebrow}>Senior software engineer</p>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Building fast, maintainable product experiences for the web.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                I&apos;m Jorge de la Cruz. I design and ship scalable React and
                Next.js systems with a strong focus on UI consistency,
                accessibility, and measurable performance.
              </p>
            </div>
          </div>

          <div className={homePageStyles.metaList}>
            {profileHighlights.map((highlight) => (
              <span key={highlight} className={homePageStyles.metaBadge}>
                {highlight}
              </span>
            ))}
          </div>

          <div className={homePageStyles.ctaRow}>
            <Button
              size="lg"
              className="h-12 rounded-full px-6 text-sm font-semibold"
              onClick={handleDownloadClick}
              asChild
            >
              <a
                href="/documents/jorgedelacruz_cv.pdf"
                download
                className="inline-flex items-center gap-2"
              >
                <DownloadIcon className="h-4 w-4" />
                Download CV
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-border bg-background/80 px-6 text-sm font-semibold"
            >
              <a href="mailto:jdelacruzp7@gmail.com">Contact me</a>
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-border/70" />
            <span className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Connect
            </span>
            <div className="h-px flex-1 bg-border/70" />
          </div>

          <SocialNetworks />
        </div>

        <div className="mx-auto w-full max-w-sm">
          <div className="rounded-[1.75rem] border border-border/70 bg-card/90 p-5 shadow-soft-lg">
            <div className="relative overflow-hidden rounded-[1.5rem] bg-muted">
              <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-background/70 to-transparent px-4 py-4">
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  Available
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Lima, Peru
                </span>
              </div>

              <Image
                src={profile.image}
                alt={profile.name}
                width={560}
                height={640}
                priority
                fetchPriority="high"
                sizes="(max-width: 768px) 100vw, 22rem"
                className="aspect-[4/4.6] w-full object-cover"
              />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Focus
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground">
                  Product engineering, frontend architecture, and component
                  systems.
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Approach
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground">
                  Clean delivery with predictable layouts, typed APIs, and fast
                  pages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
