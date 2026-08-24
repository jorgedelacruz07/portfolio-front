import { motion } from "framer-motion";
import { HomeSection } from "@/components/pages/home/HomeSection";
import { homeMotion } from "@/lib/utils";
import type { TSkill } from "@/types/portfolio";

type HomeAboutProps = {
  cmsSkills?: TSkill[];
};

const engineeringPillars = [
  {
    title: "Frontend Architecture",
    description:
      "Building high-performance, accessible, and scalable client applications. Focused on Core Web Vitals, state management, and design system engineering.",
    skills: [
      "React.js",
      "TypeScript",
      "Vite.js",
      "Tailwind CSS",
      "TanStack Query",
      "Framer Motion",
    ],
  },
  {
    title: "Backend & Systems",
    description:
      "Designing clean, maintainable APIs and data access layers. Experience with caching strategies, database optimization, and secure authentication.",
    skills: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "Prisma ORM",
      "REST APIs",
      "CORS & Auth",
    ],
  },
  {
    title: "Cloud & Delivery",
    description:
      "Deploying scalable cloud workloads with automated CI/CD pipelines, containerization, and modern agentic engineering tooling.",
    skills: [
      "AWS",
      "Docker",
      "GitHub Actions",
      "GCP Cloud Run",
      "Micro-services",
      "AI Workflows",
    ],
  },
];

export const HomeAbout = ({ cmsSkills }: HomeAboutProps) => {
  const dynamicSkills = cmsSkills?.length
    ? cmsSkills.filter((s) => s.visible !== false).map((s) => s.name)
    : [];

  return (
    <HomeSection
      id="about"
      eyebrow="Capabilities"
      title="Engineering pillars & core stack"
      description="Architectural discipline across user experience, backend services, and cloud infrastructure."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {engineeringPillars.map((pillar) => (
          <motion.div
            key={pillar.title}
            variants={homeMotion.item}
            className="craft-card flex flex-col justify-between rounded-xl p-6"
          >
            <div className="space-y-3">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                {pillar.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {pillar.description}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-1.5 border-t border-border/60 pt-4">
              {pillar.skills.map((skill) => (
                <span key={skill} className="craft-pill">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {dynamicSkills.length > 0 ? (
        <motion.div
          variants={homeMotion.item}
          className="mt-6 flex flex-wrap items-center gap-2 rounded-xl border border-border/70 bg-card/40 p-4"
        >
          <span className="font-mono text-xs font-semibold text-muted-foreground">
            All Technologies:
          </span>
          {dynamicSkills.map((skill) => (
            <span key={skill} className="craft-pill">
              {skill}
            </span>
          ))}
        </motion.div>
      ) : null}
    </HomeSection>
  );
};
