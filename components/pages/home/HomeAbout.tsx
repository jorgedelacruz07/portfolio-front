import { HomeSection } from "@/components/pages/home/HomeSection";
import type { TSkill } from "@/types/portfolio";

type HomeAboutProps = {
  cmsSkills?: TSkill[];
};

const toolkit = [
  {
    title: "Product & frontend",
    items: ["React.js", "TypeScript", "Vite.js", "Next.js", "Tailwind CSS"],
  },
  {
    title: "Backend & data",
    items: ["Node.js", "Express.js", "MongoDB", "REST APIs", "SQL"],
  },
  {
    title: "Cloud & delivery",
    items: ["AWS", "Docker", "GCP Cloud Run", "GitHub Actions", "CI/CD"],
  },
  {
    title: "AI-assisted workflow",
    items: ["Claude Code", "Codex", "Gemini", "Cursor"],
  },
];

export const HomeAbout = ({ cmsSkills }: HomeAboutProps) => {
  const dynamicSkills = cmsSkills?.length
    ? cmsSkills
        .filter((skill) => skill.visible !== false)
        .map((skill) => skill.name)
    : [];
  const listed = new Set(
    toolkit.flatMap((group) => group.items.map((skill) => skill.toLowerCase())),
  );
  const extraSkills = dynamicSkills.filter(
    (skill) => !listed.has(skill.toLowerCase()),
  );

  return (
    <HomeSection
      eyebrow="Capabilities"
      title="The toolkit behind the work"
      description="A pragmatic stack: strong typing, simple infrastructure, and AI where it removes real work instead of adding noise."
    >
      <dl className="divide-y divide-border/70 border-b border-border/70">
        {toolkit.map((group) => (
          <div
            key={group.title}
            className="grid gap-1.5 py-4 sm:grid-cols-[14rem_1fr] sm:gap-8 sm:py-6"
          >
            <dt className="font-display text-lg font-semibold tracking-tight text-foreground">
              {group.title}
            </dt>
            <dd className="flex flex-wrap gap-x-5 gap-y-1.5 text-[0.9375rem] text-muted-foreground">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="transition-colors hover:text-primary"
                >
                  {item}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>

      {extraSkills.length > 0 ? (
        <p className="pt-5 text-sm text-muted-foreground">
          Also working with{" "}
          <span className="text-foreground">{extraSkills.join(", ")}</span>.
        </p>
      ) : null}
    </HomeSection>
  );
};
