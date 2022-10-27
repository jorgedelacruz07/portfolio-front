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
    <div className="my-4 md:my-8">
      <h3 className="text-xl md:text-2xl">Social networks</h3>
      <div className="py-4 md:py-6">
        <ul>
          {socialNetworks.map((social) => (
            <li key={social.slug}>
              <div className="flex gap-4 items-center">
                <div className="max-w-[40px] md:max-w-[50px]">
                  <Image
                    src={social?.image?.src || "/images/placeholder.jpg"}
                    className="rounded-lg dark:bg-white"
                    alt=""
                    width={180}
                    height={180}
                  />
                </div>
                <div>
                  <a
                    className="text-blue-700 hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-700 text-sm md:text-base"
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
