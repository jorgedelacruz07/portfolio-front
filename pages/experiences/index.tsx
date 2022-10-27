import { GetStaticProps, NextPage } from "next";
import axios from "axios";
import { TExperience } from "../../types/experience";
import Image from "next/image";
import { addHours, format } from "date-fns";

export const getStaticProps: GetStaticProps = async () => {
  let experiences: TExperience[] = [];

  const url = process.env.NEXT_PUBLIC_API_URL;

  try {
    experiences = await axios
      .get(`${url}/client/experiences`)
      .then((res) => res.data);
  } catch (error) {
    let message = "";
    if (axios.isAxiosError(error)) {
      message = error?.response?.statusText as string;
    }
    console.error({ error: message });
  }

  return {
    props: {
      experiences,
    },
    revalidate: 10,
  };
};

type Props = {
  experiences: TExperience[];
};

const Experiences: NextPage<Props> = ({ experiences }) => {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl text-center uppercase">
        Experiences
      </h1>
      <div className="py-16">
        {experiences.map((experience) => (
          <div key={experience.slug} id={experience.slug} className="mb-16">
            <div className="flex gap-6 items-center">
              <div className="max-w-[70px] md:max-w-[90px] lg:max-w-[100px]">
                <Image
                  src={experience?.image?.src || "/images/placeholder.jpg"}
                  className="rounded-2xl"
                  alt=""
                  width={180}
                  height={180}
                />
              </div>
              <div className="">
                <h3 className="text-base md:text-xl uppercase font-bold">
                  {experience.company}
                </h3>
                <div className="text-base md:text-lg text-gray-600 dark:text-gray-300">
                  {experience.companyFrom}
                </div>
                <div className="text-sm italic text-gray-500 dark:text-gray-400">
                  {`${format(
                    addHours(new Date(experience.from), 5),
                    "MMM yyyy"
                  )} - ${format(
                    addHours(new Date(experience.to), 5),
                    "MMM yyyy"
                  )}`}
                </div>
                <div>
                  <a
                    className="text-blue-700 hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-700 text-sm md:text-base"
                    href={experience.companyUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {experience.companyUrl}
                  </a>
                </div>
              </div>
            </div>
            <div className="my-6">
              {/* <div className="my-2">{experience.companyDescription}</div> */}
              <div className="my-2 text-base md:text-lg font-bold">
                {experience.jobTitle}
              </div>
              <div className="my-2 text-sm md:text-base italic">
                {experience.jobDescription}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experiences;
