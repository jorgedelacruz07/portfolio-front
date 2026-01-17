import { FC, memo } from "react";
import { profile } from "../../../data/content";
import { Badge } from "@/components/ui/badge";

const HomeAboutComponent: FC = () => {
  // Pre-render description paragraphs (static data, no memoization needed)
  const descriptionParagraphs = profile.description.map((paragraph, index) => (
    <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
  ));

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
    "Git",
    "GitHub",
    "Postman",
    "VS Code",
    "Cursor",
  ];

  const stats = [
    { number: "8+", label: "Years of Experience" },
    { number: "50+", label: "Completed Projects" },
    { number: "100%", label: "Client Satisfaction" },
  ];

  return (
    <div className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* About Me Section */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              About <span className="text-primary">me</span>
            </h2>
            <div className="ml-4 h-1 w-16 bg-primary"></div>
          </div>

          <div className="max-w-4xl">
            <div className="text-lg text-muted-foreground leading-relaxed space-y-4">
              {descriptionParagraphs}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground text-lg">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Skills Section */}
        <div>
          <div className="flex items-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">
              Skills & <span className="text-primary">Technologies</span>
            </h3>
            <div className="ml-4 h-1 w-16 bg-primary"></div>
          </div>

          <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-sm font-medium px-4 py-2 bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors duration-200"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

HomeAboutComponent.displayName = "HomeAbout";
export const HomeAbout = memo(HomeAboutComponent);
