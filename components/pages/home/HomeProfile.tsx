import Image from "next/image";
import { profile } from "../../../data/content";

export const HomeProfile = () => {
  return (
    <div className="md:flex items-center justify-between gap-4">
      <div className="flex-none w-full md:w-2/3">
        <h1 className="text-xl md:text-2xl lg:text-3xl text-center md:text-left font-semibold uppercase">
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
