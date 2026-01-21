import { memo } from "react";
import { TExperience } from "../../../types/experience";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useScrollAnimation, useStaggeredAnimation } from "@/hooks";
import { ExperienceCard } from "@/components/cards/ExperienceCard";

type Props = {
  experiences: TExperience[];
};

const HomeExperiencesComponent = ({ experiences }: Props) => {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const { refs, visibleItems } = useStaggeredAnimation(experiences.length, 150);

  return (
    <div ref={sectionRef} className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Work"
          highlight="Experience"
          viewAllHref="/experiences"
          isVisible={isVisible}
          animated
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {experiences.map((experience, index) => (
            <div key={experience.slug} ref={(el) => (refs.current[index] = el)}>
              <ExperienceCard
                experience={experience}
                index={index}
                isVisible={visibleItems.has(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

HomeExperiencesComponent.displayName = "HomeExperiences";
const HomeExperiences = memo(HomeExperiencesComponent);
export default HomeExperiences;
