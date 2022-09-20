import Image from "next/image";
import { PROFILE } from "../../../data/content";

export const Profile = () => {
  const profile = PROFILE;

  return (
    <div className="flex items-center justify-between">
      <div className="flex-none w-2/3">
        <h1 className="text-4xl">{profile.name}</h1>
        <div className="my-4">{profile.description}</div>
      </div>
      <div className="flex-1 px-8 text-center w-full">
        <Image
          src="/images/jorge.jpg"
          className="rounded-full"
          alt=""
          width={200}
          height={200}
        />
      </div>
    </div>
  );
};
