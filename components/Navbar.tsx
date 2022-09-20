import Link from "next/link";
import { DarkModeButton } from "./pages/navbar/DarkModeButton";

export const Navbar = () => {
  return (
    <nav className="m-8 lg:mx-auto md:max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 md:gap-8">
          <Link href="/">
            <a>Home</a>
          </Link>
          <Link href="/experiences">
            <a>Experiences</a>
          </Link>
          <Link href="/projects">
            <a>Projects</a>
          </Link>
          <Link href="/blog">
            <a>Blog</a>
          </Link>
        </div>
        <DarkModeButton />
      </div>
    </nav>
  );
};
