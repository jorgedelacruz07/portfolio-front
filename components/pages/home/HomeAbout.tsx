import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { HomeSection } from "@/components/pages/home/HomeSection";
import { homeMotion } from "@/lib/utils";

const skills = [
  "React.js",
  "Vite.js",
  "Express.js",
  "MongoDB",
  "AWS",
  "Docker",
  "Claude Code",
  "Codex",
  "Gemini",
  "Cursor",
];

const stats = [
  { number: "8+", label: "Years shipping" },
  { number: "50+", label: "Projects delivered" },
  { number: "100%", label: "UX ownership" },
];

export const HomeAbout = () => {
  return (
    <HomeSection
      eyebrow="About"
      title={
        <>
          Full-stack engineering with
          <span className="text-premium-gradient"> AI-native delivery.</span>
        </>
      }
      description="Apps, APIs, infrastructure, and AI workflows in one stack."
    >
      <div className="grid gap-4 lg:grid-cols-12">
        <motion.div
          variants={homeMotion.item}
          className="glass-panel rounded-[1.4rem] p-5 lg:col-span-6"
        >
          <p className="text-sm leading-relaxed text-muted-foreground">
            I build user-facing apps, backend services, and cloud-ready delivery
            workflows that stay fast to ship and easy to evolve.
          </p>
        </motion.div>

        <motion.div
          variants={homeMotion.item}
          className="grid gap-4 sm:grid-cols-3 lg:col-span-6"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-panel rounded-[1.4rem] p-5 text-left"
            >
              <p className="text-3xl font-semibold leading-none tracking-tight text-foreground">
                {stat.number}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        <motion.div
          variants={homeMotion.item}
          className="glass-panel rounded-[1.4rem] p-5 lg:col-span-4"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary/80">
            Operating style
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Product thinking, backend pragmatism, and AI acceleration in the
            same loop.
          </p>
        </motion.div>

        <motion.div
          variants={homeMotion.item}
          className="glass-panel rounded-[1.4rem] p-5 lg:col-span-8"
        >
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="px-2.5 py-1 text-[0.65rem]"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={homeMotion.item}
          className="glass-panel rounded-[1.4rem] p-5 lg:col-span-12"
        >
          <p className="text-sm leading-relaxed text-muted-foreground">
            I have also used AI directly in personal finance and education
            projects, not just in the dev workflow.
          </p>
        </motion.div>
      </div>
    </HomeSection>
  );
};
