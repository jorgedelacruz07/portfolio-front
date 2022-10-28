import Image from "next/image";

const socialNetworks = [
  {
    id: 1,
    slug: "linkedin",
    name: "Linkedin",
    image: {
      src: "/images/linkedin.png",
    },
    url: "https://www.linkedin.com/in/jorgedelacruz07",
  },
  {
    id: 2,
    slug: "github",
    name: "GitHub",
    image: {
      src: "/images/github.png",
    },
    url: "https://github.com/jorgedelacruz07",
  },
];

export const HomeSocial = () => {
  return (
    <div className="my-6 md:my-10">
      <h3 className="text-xl md:text-2xl">Social networks</h3>
      <div className="pt-4 md:pt-6">
        <ul>
          {socialNetworks.map((social) => (
            <li key={social.slug} className="mb-4">
              <div className="flex gap-4 items-center">
                <div className="max-w-[30px] md:max-w-[40px] flex items-center">
                  <Image
                    src={social?.image?.src || "/images/placeholder.jpg"}
                    className="rounded-lg dark:bg-white"
                    alt=""
                    width={40}
                    height={40}
                  />
                </div>
                <div>
                  <a
                    className="text-blue-700 hover:text-blue-900 dark:text-gray-200 dark:hover:text-gray-400 text-sm md:text-base"
                    href={social.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {social.name}
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
