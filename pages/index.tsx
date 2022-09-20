import type { NextPage } from "next";
import { HomeBlog } from "../components/pages/home/HomeBlog";
import { HomeProfile } from "../components/pages/home/HomeProfile";
import { HomeProjects } from "../components/pages/home/HomeProjects";
import { HomeSocial } from "../components/pages/home/HomeSocial";
import { HomeExperiences } from "../components/pages/home/HomeExperiences";

const Home: NextPage = () => {
  return (
    <>
      <HomeProfile />
      <HomeExperiences />
      <HomeProjects />
      <HomeSocial />
      <HomeBlog />
    </>
  );
};

export default Home;
