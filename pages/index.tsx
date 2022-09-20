import type { NextPage } from "next";
import { Blog } from "../components/pages/home/Blog";
import { Profile } from "../components/pages/home/Profile";
import { Projects } from "../components/pages/home/Projects";
import { Social } from "../components/pages/home/Social";

const Home: NextPage = () => {
  return (
    <>
      <Profile />
      <Social />
      <Projects />
      <Blog />
    </>
  );
};

export default Home;
