import { motion } from "framer-motion";

import { HomeSection } from "@/components/pages/home/HomeSection";
import { homeMotion } from "@/lib/utils";
import type { TSkill } from "@/types/portfolio";

type HomeAboutProps = {
  cmsSkills?: TSkill[];
};

const engineeringPillars = [
  {
    title: "Frontend",
    skills: ["React.js", "TypeScript", "Vite.js", "Tailwind CSS"],
  },
  {
    title: "Backend",
    skills: ["Node.js", "Express.js", "MongoDB", "REST APIs"],
  },
  {
    title: "Cloud",
    skills: ["AWS", "Docker", "GitHub Actions", "GCP Cloud Run"],
  },
];

export const HomeAbout = ({ cmsSkills }: HomeAboutProps) => {
  const dynamicSkills = cmsSkills?.length
    ? cmsSkills
        .filter((skill) => skill.visible !== false)
        .map((skill) => skill.name)
    : [];
  const listed = new Set(
    engineeringPillars.flatMap((pillar) =>
      pillar.skills.map((skill) => skill.toLowerCase()),
    ),
  );
  const extraSkills = dynamicSkills.filter(
    (skill) => !listed.has(skill.toLowerCase()),
  );

  return (
    <HomeSection id="about" eyebrow="Stack" title="Engineering pillars">
      <div className="grid gap-4 sm:grid-cols-3">
        {engineeringPillars.map((pillar) => (
          <motion.div
            key={pillar.title}
            variants={homeMotion.item}
            className="space-y-2"
          >
            <h3 className="text-sm font-medium text-foreground">
              {pillar.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {pillar.skills.join(", ")}
            </p>
          </motion.div>
        ))}
      </div>
      {extraSkills.length > 0 ? (
        <motion.p
          variants={homeMotion.item}
          className="text-sm text-muted-foreground"
        >
          Also {extraSkills.join(", ")}
        </motion.p>
      ) : null}
    </HomeSection>
  );
};
