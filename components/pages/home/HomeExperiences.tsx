import { experiences } from "../../../data/content";

export const HomeExperiences = () => {
  return (
    <div className="my-8">
      <h3 className="text-xl md:text-2xl">Experiences</h3>
      <div className="my-2 md:my-4 px-4">
        <ul className="list-disc">
          {experiences.map((experience) => (
            <li key={experience.id}>
              <div>{experience.company}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
