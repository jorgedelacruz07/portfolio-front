import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navbarItems = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Experiences", href: "/experiences" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled
          ? "border-b border-border/80 bg-background/80 backdrop-blur-md shadow-subtle"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2 font-mono text-sm font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
        >
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span>jorgedelacruz</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-1 md:flex">
          {navbarItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="ml-3 pl-3 border-l border-border/80">
            <Button size="sm" variant="outline" asChild>
              <a
                href="/documents/jorgedelacruz_cv.pdf"
                download
                className="font-mono text-xs"
              >
                Resume
              </a>
            </Button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            className="h-8 w-8 p-0"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {isMenuOpen ? (
        <div className="border-b border-border/80 bg-background/95 px-4 py-4 backdrop-blur-lg md:hidden">
          <nav className="flex flex-col space-y-1">
            {navbarItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === "/"}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="pt-2">
              <Button size="sm" variant="outline" className="w-full" asChild>
                <a
                  href="/documents/jorgedelacruz_cv.pdf"
                  download
                  className="font-mono text-xs"
                >
                  Download CV
                </a>
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
};
