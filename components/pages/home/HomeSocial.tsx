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
    <div className="my-8 md:my-10">
      <h2 className="text-xl md:text-2xl font-semibold">Social networks</h2>
      <div className="pt-4 md:pt-6">
        <ul>
          {socialNetworks.map((social) => (
            <li key={social.slug} className="mb-4">
              <div className="flex items-center gap-4">
                <div className="max-w-[30px] md:max-w-[40px]">
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
                    className="text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-400 text-sm md:text-base font-semibold"
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
