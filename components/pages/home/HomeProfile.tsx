import { motion } from "framer-motion";
import { profile } from "@/data/content";
import { OptimizedImage } from "@/components/OptimizedImage";
import { SocialNetworks } from "@/components/SocialNetworks";
import { DownloadIcon } from "@/components/icons/DownloadIcon";
import { Button } from "@/components/ui/button";
import { homeMotion, homePageStyles } from "@/lib/utils";

const profileHighlights = [
  "SPA architecture",
  "Design systems",
  "Performance tuning",
  "AI-assisted delivery",
];

const profileStats = [
  { label: "Years building products", value: "8+" },
  { label: "Frontend systems shipped", value: "50+" },
  { label: "Remote from Lima, Peru", value: "UTC-5" },
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
    <motion.section
      className="glass-panel surface-grid relative overflow-hidden rounded-[2.25rem] px-6 py-10 shadow-premium lg:px-10 lg:py-14"
      variants={homeMotion.section}
      initial="hidden"
      animate="visible"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.28),transparent_34%),radial-gradient(circle_at_85%_18%,hsl(var(--accent)/0.18),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-hero-radial opacity-70 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

      <div className={homePageStyles.twoColumn}>
        <div className="space-y-8">
          <motion.div variants={homeMotion.item} className="space-y-5">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-white/80 backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              Available for senior frontend roles
            </div>

            <div className="space-y-5">
              <p className={homePageStyles.eyebrow}>Senior software engineer</p>
              <h1 className="max-w-4xl font-display text-5xl font-semibold tracking-[-0.075em] text-foreground sm:text-6xl lg:text-7xl">
                Building
                <span className="text-premium-gradient">
                  {" "}
                  fast, maintainable{" "}
                </span>
                product surfaces that feel engineered, not assembled.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg sm:leading-9">
                I&apos;m Jorge de la Cruz. I design and ship scalable React
                systems with a strong focus on UI consistency, accessibility,
                and measurable performance. The goal is simple: premium
                interfaces backed by codebases teams can extend without
                friction.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={homeMotion.item}
            className="grid gap-4 sm:grid-cols-3"
          >
            {profileStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4 backdrop-blur-md"
              >
                <p className="text-3xl font-semibold tracking-[-0.05em] text-foreground">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>

          <motion.div
            variants={homeMotion.item}
            className={homePageStyles.metaList}
          >
            {profileHighlights.map((highlight) => (
              <span key={highlight} className={homePageStyles.metaBadge}>
                {highlight}
              </span>
            ))}
          </motion.div>

          <motion.div
            variants={homeMotion.item}
            className={homePageStyles.ctaRow}
          >
            <Button
              size="lg"
              className="h-12 px-6 text-sm font-semibold"
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
              className="h-12 px-6 text-sm font-semibold"
            >
              <a href="mailto:jdelacruzp7@gmail.com">Contact me</a>
            </Button>
          </motion.div>

          <motion.div variants={homeMotion.item} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-white/5" />
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Connect
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-white/5 via-white/15 to-transparent" />
            </div>

            <SocialNetworks />
          </motion.div>
        </div>

        <motion.div
          variants={homeMotion.item}
          className="mx-auto w-full max-w-[28rem]"
        >
          <div className="relative">
            <div className="absolute inset-x-10 top-10 h-48 rounded-full bg-accent-radial opacity-80 blur-3xl" />

            <div className="glass-panel relative overflow-hidden rounded-[2rem] p-4 shadow-premium-lg">
              <div className="relative overflow-hidden rounded-[1.65rem] bg-muted">
                <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-background/75 via-background/35 to-transparent px-5 py-5">
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                    Shipping now
                  </span>
                  <span className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/65">
                    Lima, Peru
                  </span>
                </div>

                <OptimizedImage
                  src={profile.image}
                  alt={profile.name}
                  width={560}
                  height={640}
                  fetchPriority="high"
                  loading="eager"
                  className="aspect-[4/4.8] w-full object-cover object-center"
                />

                <div className="absolute inset-x-4 bottom-4 rounded-[1.4rem] border border-white/10 bg-black/30 p-4 backdrop-blur-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-primary/85">
                        Current focus
                      </p>
                      <p className="mt-2 text-base font-semibold tracking-[-0.03em] text-white">
                        Senior frontend architecture with product-level polish.
                      </p>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/70">
                      React + TypeScript
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-primary/85">
                    Focus
                  </p>
                  <p className="mt-2 text-sm leading-7 text-foreground">
                    Product engineering, DX, and systems that keep UX quality
                    stable at scale.
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-primary/85">
                    Approach
                  </p>
                  <p className="mt-2 text-sm leading-7 text-foreground">
                    Tight feedback loops, typed APIs, and deliberate motion
                    rather than visual noise.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
