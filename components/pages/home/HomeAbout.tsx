import { profile } from "@/data/content";
import { Badge } from "@/components/ui/badge";
import { HomeSection } from "@/components/pages/home/HomeSection";

const skills = [
  "React.js",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Express.js",
  "MongoDB",
  "Tailwind CSS",
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
      title="A product-minded engineer with frontend architecture depth."
      description="I work across interface systems, delivery quality, and performance budgets so teams can move faster without leaving behind UI debt."
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
        <div className="space-y-4 text-sm leading-8 text-muted-foreground sm:text-base">
          {profile.description.map((paragraph, index) => (
            <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
          ))}
        </div>

        <div className="space-y-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[1.5rem] border border-border/60 bg-background/80 p-5"
            >
              <p className="text-3xl font-semibold tracking-tight text-foreground">
                {stat.number}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-border/60 pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
              Toolkit
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              Technologies I use regularly
            </h3>
          </div>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">
            These tools cover the bulk of my frontend, backend, collaboration,
            and delivery workflow.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {skills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="rounded-full border border-border/60 bg-background px-4 py-2 text-sm font-medium text-foreground"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </HomeSection>
  );
};
