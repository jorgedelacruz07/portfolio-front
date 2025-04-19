import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DarkModeButton } from "./pages/navbar/DarkModeButton";
import classNames from "classnames";
import { HomeIcon } from "@heroicons/react/24/solid";

export const Navbar = () => {
  const router = useRouter();
  const [selected, setSelected] = useState("/");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setSelected(router.route);
  }, [router]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinkClasses = (path: string) =>
    classNames(
      "text-white dark:text-gray-200 hover:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200 font-semibold",
      router.pathname === path ? "text-gray-300 dark:text-gray-100" : ""
    );

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    router.push(path);
  };

  const navbarItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Experiences",
      href: "/experiences",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Blog",
      href: "/blog",
    },
  ];

  return (
    <nav className="bg-slate-800 dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-white text-xl font-bold hover:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 flex items-center">
                <HomeIcon className="h-6 w-6 mr-2" />
              </a>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navbarItems.map((item) => (
                <Link href={item.href} key={item.href}>
                  <a className={navLinkClasses(item.href)}>{item.label}</a>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <DarkModeButton />

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-gray-400 dark:text-gray-200 hover:text-gray-300 dark:hover:text-gray-100 focus:outline-none transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={classNames(
          "md:hidden bg-slate-800 dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800 transition-all duration-200 ease-in-out",
          {
            "max-h-96 opacity-100": isMenuOpen,
            "max-h-0 opacity-0 overflow-hidden": !isMenuOpen,
          }
        )}
      >
        <div className="px-4 py-2 space-y-2">
          {navbarItems.map((item) => (
            <Link href={item.href} key={item.href}>
              <a
                className={classNames(
                  "block py-2 text-base font-medium",
                  navLinkClasses(item.href)
                )}
                onClick={(e) => handleLinkClick(e, item.href)}
              >
                {item.label}
              </a>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};
