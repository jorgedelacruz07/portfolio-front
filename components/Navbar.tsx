import Link from "next/link";
import { DarkModeButton } from "./pages/navbar/DarkModeButton";

export const Navbar = () => {
  return (
    <nav>
      <div className="mx-auto max-w-4xl my-8">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/">
              <a className="px-2">Home</a>
            </Link>
            <Link href="/experiences">
              <a className="px-2">Experiences</a>
            </Link>
            <Link href="/projects">
              <a className="px-2">Projects</a>
            </Link>
          </div>
          <DarkModeButton />
        </div>
      </div>
    </nav>
  );
};
