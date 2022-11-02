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
      <h1 className="text-2xl md:text-3xl text-center uppercase font-bold">
        Experiences
      </h1>
      <div className="py-12 md:py-16">
        {experiences.map((experience) => (
          <div
            key={experience.slug}
            id={experience.slug}
            className="mb-12 md:mb-16"
          >
            <div className="flex items-center gap-6">
              <div className="max-w-[70px] md:max-w-[80px] 3xl:max-w-[90px]">
                <Image
                  src={experience?.image?.src || "/images/placeholder.jpg"}
                  className="rounded-2xl"
                  alt=""
                  width={120}
                  height={120}
                />
              </div>
              <div className="">
                <h3 className="text-base md:text-xl font-semibold uppercase">
                  {experience.company}
                </h3>
                <div className="italic text-gray-800 dark:text-gray-300">
                  {`(${format(
                    addHours(new Date(experience.from), 5),
                    "MMM yyyy"
                  )} - ${format(
                    addHours(new Date(experience.to), 5),
                    "MMM yyyy"
                  )})`}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-400 font-semibold">
                  {experience.companyFrom}
                </div>
              </div>
            </div>
            <div className="mt-6">
              {/* <div className="my-2">{experience.companyDescription}</div> */}
              <div className="text-base md:text-lg font-semibold">
                {experience.jobTitle}
              </div>
              <div className="mt-2 text-gray-700 dark:text-gray-300 text-sm md:text-base italic">
                {experience.jobDescription}
              </div>

              <div className="mt-2">
                <a
                  className="text-blue-700 hover:text-blue-900 dark:text-blue-600 dark:hover:text-blue-800 text-sm md:text-base"
                  href={experience.companyUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  {experience.companyUrl}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experiences;
