import { GetStaticProps, NextPage } from "next";
import axios from "axios";
import { TExperience } from "../../types/experience";
import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
      <h1 className="text-xl md:text-3xl text-center uppercase">Experiences</h1>
      <div className="py-16">
        {experiences.map((experience) => (
          <div key={experience.id} className="mb-16">
            <div className="flex gap-6 items-center">
              {experience?.image?.src && (
                <div className="max-w-[100px]">
                  <Image
                    src={experience?.image?.src}
                    className="rounded-3xl"
                    alt=""
                    width={180}
                    height={180}
                  />
                </div>
              )}
              <div className="">
                <h3 className="text-lg md:text-xl uppercase">
                  {experience.company}
                </h3>
                <div className="text-md text-gray-600 dark:text-gray-300">
                  {experience.companyFrom}
                </div>
                <div className="text-sm italic text-gray-500 dark:text-gray-400">{`(${format(
                  new Date(experience.from),
                  "MMM yyyy",
                  {
                    locale: es,
                  }
                )} - ${format(new Date(experience.to), "MMM yyyy", {
                  locale: es,
                })})`}</div>
                <div>
                  <a
                    className="dark:text-blue-500 dark:hover:text-blue-600"
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
              <div className="my-2 text-lg font-bold">
                {experience.jobTitle}
              </div>
              <div className="my-2 italic">{experience.jobDescription}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experiences;
