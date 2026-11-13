import { HomeSection } from "@/components/pages/home/HomeSection";
import type { TSkill } from "@/types/portfolio";
import type { TSiteCopy } from "@/lib/site-copy";

type HomeAboutProps = {
  cmsSkills?: TSkill[];
  copy: TSiteCopy;
};

export const HomeAbout = ({ cmsSkills, copy }: HomeAboutProps) => {
  const toolkit = [1, 2, 3, 4].map((index) => ({
    title: copy[`home.about.group${index}.title` as keyof TSiteCopy],
    items: copy[`home.about.group${index}.items` as keyof TSiteCopy]
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  }));
  const dynamicSkills = cmsSkills?.length
    ? cmsSkills.filter((skill) => skill.visible !== false).map((skill) => skill.name)
    : [];
  const listed = new Set(toolkit.flatMap((group) => group.items.map((skill) => skill.toLowerCase())));
  const extraSkills = dynamicSkills.filter((skill) => !listed.has(skill.toLowerCase()));

  return (
    <HomeSection
      eyebrow={copy["home.about.eyebrow"]}
      title={copy["home.about.title"]}
      description={copy["home.about.description"]}
    >
      <dl className="divide-y divide-border/70 border-b border-border/70">
        {toolkit.map((group) => (
          <div key={group.title} className="grid gap-1.5 py-4 sm:grid-cols-[14rem_1fr] sm:gap-8 sm:py-6">
            <dt className="font-display text-lg font-semibold tracking-tight text-foreground">{group.title}</dt>
            <dd className="flex flex-wrap gap-x-5 gap-y-1.5 text-[0.9375rem] text-muted-foreground">
              {group.items.map((item) => (
                <span key={item} className="transition-colors hover:text-primary">
                  {item}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>

      {extraSkills.length > 0 ? (
        <p className="pt-5 text-sm text-muted-foreground">
          {copy["home.about.extraSkills"]} <span className="text-foreground">{extraSkills.join(", ")}</span>.
        </p>
      ) : null}
    </HomeSection>
  );
};
