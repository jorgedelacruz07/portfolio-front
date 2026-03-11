import { motion } from "framer-motion";
import { profile } from "@/data/content";
import { Badge } from "@/components/ui/badge";
import { HomeSection } from "@/components/pages/home/HomeSection";
import { homeMotion } from "@/lib/utils";

const skills = [
  "React.js",
  "TypeScript",
  "Node.js",
  "Express.js",
  "MongoDB",
  "Tailwind CSS",
  "React Router",
  "Vue.js",
  "Nuxt.js",
  "MySQL",
  "Design Systems",
  "Performance",
];

const stats = [
  { number: "8+", label: "Years shipping production software" },
  { number: "50+", label: "Projects delivered across product teams" },
  { number: "100%", label: "Focus on maintainable and scalable UX" },
];

export const HomeAbout = () => {
  return (
    <HomeSection
      eyebrow="About"
      title={
        <>
          A product-minded engineer with
          <span className="text-premium-gradient"> frontend architecture </span>
          depth.
        </>
      }
      description="I work across interface systems, delivery quality, and performance budgets so teams can move faster without leaving behind UI debt."
      contentClassName="space-y-6"
    >
      <div className="grid gap-6 lg:grid-cols-12">
        <motion.div
          variants={homeMotion.item}
          className="glass-panel relative overflow-hidden rounded-[1.9rem] p-6 lg:col-span-7 lg:p-8"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.14),transparent_38%)]" />
          <div className="relative space-y-5 text-sm leading-8 text-muted-foreground sm:text-base">
            <div className="space-y-3">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-primary/80">
                Operating style
              </p>
              <h3 className="text-2xl font-semibold tracking-[-0.04em] text-foreground sm:text-3xl">
                Strategy, systems, and implementation detail in the same loop.
              </h3>
            </div>

            {profile.description.map((paragraph, index) => (
              <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={homeMotion.item}
          className="grid gap-6 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-panel rounded-[1.75rem] p-6 lg:p-7"
            >
              <p className="text-4xl font-semibold tracking-[-0.06em] text-foreground">
                {stat.number}
              </p>
              <p className="mt-3 max-w-xs text-sm leading-7 text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        <motion.div
          variants={homeMotion.item}
          className="glass-panel rounded-[1.9rem] p-6 lg:col-span-4 lg:p-8"
        >
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-primary/80">
            Toolkit
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-foreground">
            Stack I use to keep product quality high.
          </h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Frontend systems, backend delivery, and team tooling that support
            faster iteration without sacrificing polish.
          </p>
        </motion.div>

        <motion.div
          variants={homeMotion.item}
          className="glass-panel rounded-[1.9rem] p-6 lg:col-span-8 lg:p-8"
        >
          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="px-4 py-2">
                {skill}
              </Badge>
            ))}
          </div>
        </motion.div>
      </div>
    </HomeSection>
  );
};
