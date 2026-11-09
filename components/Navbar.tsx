import { useEffect, useId, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useGetArticles } from "@/hooks";
import { trappedMenuIndex } from "@/lib/menu-focus";
import { cn } from "@/lib/utils";

const shell = "mx-auto flex w-full max-w-5xl items-center px-4 sm:px-6";

export const Navbar = () => {
  const location = useLocation();
  const menuId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const menu = menuRef.current;
    const button = menuButtonRef.current;
    const items = () =>
      menu
        ? Array.from(
            menu.querySelectorAll<HTMLElement>(
              "a[href], button:not([disabled])",
            ),
          )
        : [];

    items()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsMenuOpen(false);
        button?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const list = items();
      if (list.length === 0) return;
      const current = list.indexOf(document.activeElement as HTMLElement);
      if (current === -1) {
        event.preventDefault();
        list[event.shiftKey ? list.length - 1 : 0]?.focus();
        return;
      }
      const atStart = current === 0 && event.shiftKey;
      const atEnd = current === list.length - 1 && !event.shiftKey;
      if (!atStart && !atEnd) return;
      event.preventDefault();
      list[trappedMenuIndex(list.length, current, event.shiftKey)]?.focus();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  const { data: articles } = useGetArticles();
  const articlesAvailable = (articles?.length ?? 0) > 0;
  const navbarItems = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Experiences", href: "/experiences" },
    ...(articlesAvailable ? [{ label: "Articles", href: "/articles" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className={cn(shell, "h-14 justify-between")}>
        <Link
          to="/"
          className="text-sm font-semibold tracking-tight text-foreground"
        >
          Jorge de la Cruz
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navbarItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-2 text-sm",
                  isActive
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          <ThemeToggle />
          <Button size="sm" variant="outline" asChild>
            <a
              href="/documents/jorgedelacruz_cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume
            </a>
          </Button>
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Button
            ref={menuButtonRef}
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={
              isMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={isMenuOpen}
            aria-controls={menuId}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </Button>
        </div>
      </div>

      {isMenuOpen ? (
        <div
          id={menuId}
          ref={menuRef}
          className="border-t border-border bg-background md:hidden"
        >
          <nav
            className={cn(shell, "flex-col items-stretch gap-1 py-3")}
            aria-label="Primary mobile"
          >
            {navbarItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === "/"}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-3 text-sm",
                    isActive
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Button size="sm" variant="outline" className="mt-2" asChild>
              <a
                href="/documents/jorgedelacruz_cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Resume
              </a>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
};
