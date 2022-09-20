import type { NextPage } from "next";
import { Profile } from "../components/pages/home/Profile";
import { Social } from "../components/pages/home/Social";

const Home: NextPage = () => {
  return (
    <div>
      <Profile />
      <Social />
    </div>
  );
};

export default Home;
