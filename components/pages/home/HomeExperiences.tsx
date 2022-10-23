import { FC } from "react";
import { TExperience } from "../../../types/experience";

type Props = {
  experiences: TExperience[];
};

export const HomeExperiences: FC<Props> = ({ experiences }) => {
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
