import Image from "next/image";
import { PROFILE } from "../../../data/content";

export const Profile = () => {
  const profile = PROFILE;

  return (
    <div className="md:flex items-center justify-between gap-5">
      <div className="flex-none w-full md:w-2/3">
        <h1 className="text-2xl text-center uppercase md:text-left md:text-4xl">
          {profile.name}
        </h1>
        <div className="text-sm md:text-base my-4 text-justify">
          {profile.description}
        </div>
      </div>
      <div className="flex-1 px-8 text-center w-full">
        <Image
          src="/images/jorge.jpg"
          className="rounded-full"
          alt=""
          width={180}
          height={180}
        />
      </div>
    </div>
  );
};
