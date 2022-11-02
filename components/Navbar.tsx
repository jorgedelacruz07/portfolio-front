import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DarkModeButton } from "./pages/navbar/DarkModeButton";

export const Navbar = () => {
  const [selected, setSelected] = useState("/");
  const router = useRouter();

  useEffect(() => {
    setSelected(router.route);
  }, [router]);

  return (
    <nav className="m-8 lg:mx-auto md:max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex md:gap-8">
          <Link href="/">
            <a
              className={
                selected === "/"
                  ? "bg-blue-100 rounded-lg dark:bg-slate-800 p-1.5 md:p-2 font-semibold md:uppercase text-sm"
                  : "p-1.5 md:p-2 font-semibold md:uppercase text-sm"
              }
            >
              Home
            </a>
          </Link>
          <Link href="/experiences">
            <a
              className={
                selected === "/experiences"
                  ? "bg-blue-100 rounded-lg dark:bg-slate-800 p-1.5 md:p-2 font-semibold md:uppercase text-sm"
                  : "p-1.5 md:p-2 font-semibold md:uppercase text-sm"
              }
            >
              Experiences
            </a>
          </Link>
          <Link href="/projects">
            <a
              className={
                selected === "/projects"
                  ? "bg-blue-100 rounded-lg dark:bg-slate-800 p-1.5 md:p-2 font-semibold md:uppercase text-sm"
                  : "p-1.5 md:p-2 font-semibold md:uppercase text-sm"
              }
            >
              Projects
            </a>
          </Link>
          <Link href="/blog">
            <a
              className={
                selected === "/blog"
                  ? "bg-blue-100 rounded-lg dark:bg-slate-800 p-1.5 md:p-2 font-semibold md:uppercase text-sm"
                  : "p-1.5 md:p-2 font-semibold md:uppercase text-sm"
              }
            >
              Blog
            </a>
          </Link>
        </div>
        <DarkModeButton />
      </div>
    </nav>
  );
};
