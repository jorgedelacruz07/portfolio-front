import { NextPage } from "next";

const Experiences: NextPage = () => {
  const experiences = [
    {
      id: 1,
      company: "Seeri",
      companyFrom: "Latin America",
      companyDescription: "Seeri is an colombian startup",
      companyLogo: "",
      companyUrl: "https://seeri.co",
      jobTitle: "Software Engineer",
      jobDescription: "I've worked at Seeri as a Software Engineer",
      from: "Dic. 2021",
      to: "Aug. 2022",
    },
    {
      id: 2,
      company: "Indra",
      companyFrom: "Lima, Peru",
      companyDescription: "Indra is an Spain company",
      companyLogo: "",
      companyUrl: "https://indracompany.com",
      jobTitle: "Software Engineer",
      jobDescription: "I've worked at Indra as a Software Engineer",
      from: "Nov. 2020",
      to: "Dic. 2021",
    },
    {
      id: 3,
      company: "Universidad Tecnológica del Perú",
      companyFrom: "Lima, Peru",
      companyDescription:
        "Universidad Tecnológica del Perú is an colombian startup",
      companyLogo: "",
      companyUrl: "https://utp.edu.pe",
      jobTitle: "Software Developer",
      jobDescription:
        "I've worked at Universidad Tecnológica del Perú as a Software Developer",
      from: "Mar. 2020",
      to: "Nov. 2020",
    },
    {
      id: 4,
      company: "Joinnus",
      companyFrom: "Lima, Peru",
      companyDescription: "Joinnus is an peruvian startup",
      companyLogo: "",
      companyUrl: "https://joinnus.com",
      jobTitle: "Full Stack Developer",
      jobDescription: "I've worked at Joinnus as a Full Stack Developer",
      from: "Jan. 2019",
      to: "Feb. 2020",
    },
    {
      id: 5,
      company: "Mandü",
      companyFrom: "Lima, Peru",
      companyDescription: "Mandü is an peruvian startup",
      companyLogo: "",
      companyUrl: "https://mandu.pe",
      jobTitle: "Full Stack Developer",
      jobDescription: "I've worked at Mandü as a Full Stack Developer",
      from: "Aug. 2018",
      to: "Nov. 2018",
    },
    {
      id: 6,
      company: "Prodequa",
      companyFrom: "Lima, Peru",
      companyDescription: "Prodequa is an peruvian consultory",
      companyLogo: "",
      companyUrl: "https://prodequa.com",
      jobTitle: "Full Stack Developer",
      jobDescription: "I've worked at Prodequa as a Full Stack Developer",
      from: "Apr. 2016",
      to: "May. 2018",
    },
  ];

  return (
    <div>
      <h1 className="text-xl md:text-3xl text-center uppercase">Experiences</h1>
      <div>
        {experiences.map((experience) => (
          <div key={experience.id} className="my-16">
            <h3 className="text-xl md:text-2xl uppercase">
              {experience.company}
            </h3>
            <div className="text-md text-gray-600 dark:text-gray-300">
              {experience.companyFrom}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{`(${experience.from} - ${experience.to})`}</div>
            <div className="my-6">
              <div className="my-2">{experience.companyDescription}</div>
              <div className="my-2">{experience.jobTitle}</div>
              <div className="my-2">{experience.jobDescription}</div>
              <div className="my-2">
                <a
                  className="hover:text-blue-600"
                  href={experience.companyUrl}
                  rel=""
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
