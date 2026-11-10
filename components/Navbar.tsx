import { useEffect, useId, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useGetArticles } from "@/hooks";
import { trappedMenuIndex } from "@/lib/menu-focus";
import { cn } from "@/lib/utils";

const shell = "mx-auto flex w-full max-w-6xl items-center px-4 sm:px-6";

const navLinkClass = (isActive: boolean) =>
  cn(
    "relative rounded-lg px-3 py-2 text-sm transition-colors",
    isActive
      ? "text-foreground"
      : "text-muted-foreground hover:text-foreground",
  );

function Brand() {
  return (
    <Link to="/" className="group flex items-center gap-2.5 sm:gap-3">
      <span className="inline-flex h-9 items-center rounded-lg border border-border/90 bg-card px-2.5 font-display text-base font-bold tracking-[-0.03em] text-foreground shadow-sm transition-colors group-hover:border-primary/45">
        <span>j</span>
        <span className="italic text-primary">dl</span>
        <span>cp</span>
        <span className="ml-0.5 font-mono text-[0.6875rem] font-semibold tracking-tight text-primary">
          .dev
        </span>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-sm font-semibold tracking-tight text-foreground">
          Jorge de la Cruz Padilla
        </span>
        <span className="mt-1 hidden text-[0.625rem] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:block">
          Software Engineer
        </span>
      </span>
    </Link>
  );
}

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
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/85 backdrop-blur-xl">
      <div className={cn(shell, "h-16 justify-between")}>
        <Brand />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navbarItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/"}
              className={({ isActive }) =>
                cn(
                  navLinkClass(isActive),
                  isActive &&
                    "after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary after:content-['']",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          <span className="mx-2 h-5 w-px bg-border/80" aria-hidden="true" />
          <ThemeToggle />
          <Button size="sm" className="ml-2" asChild>
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
          className="surface-popover mx-3 mb-3 mt-2 border md:hidden"
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
                    "rounded-lg px-3 py-3 text-sm transition-colors",
                    isActive
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Button size="sm" className="mt-2" asChild>
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
