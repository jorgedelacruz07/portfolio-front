import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks";

export const Navbar = () => {
  const router = useRouter();
  const [, setSelected] = useState("/");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { ref: navbarRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  useEffect(() => {
    setSelected(router.route);
  }, [router]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinkClasses = (path: string) =>
    cn(
      "text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium",
      router.pathname === path ? "text-foreground font-semibold" : "",
    );

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
    <nav
      ref={navbarRef}
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 border-b border-border/40 shadow-lg"
          : "bg-transparent",
        isVisible ? "animate-fade-in-down" : "opacity-0 translate-y-[-20px]",
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand/Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-foreground hover:text-primary transition-all duration-300 focus-ring-none hover-scale group"
            >
              <span className="group-hover:animate-pulse">
                Jorge de la Cruz
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navbarItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    navLinkClasses(item.href),
                    "focus-ring-none link-hover hover-scale transition-all duration-300",
                    isVisible
                      ? "animate-fade-in-up"
                      : "opacity-0 translate-y-[-10px]",
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="p-2 focus-ring-none hover-scale transition-all duration-300"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <svg
                  className={cn(
                    "absolute inset-0 h-6 w-6 transition-all duration-300",
                    isMenuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100",
                  )}
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
                <svg
                  className={cn(
                    "absolute inset-0 h-6 w-6 transition-all duration-300",
                    isMenuOpen
                      ? "rotate-0 opacity-100"
                      : "-rotate-90 opacity-0",
                  )}
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
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden transition-all duration-500 ease-in-out overflow-hidden",
          isScrolled
            ? "bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 border-t border-border/40 shadow-lg"
            : "bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 border-t border-border/40 shadow-lg",
          {
            "max-h-96 opacity-100": isMenuOpen,
            "max-h-0 opacity-0": !isMenuOpen,
          },
        )}
      >
        <div className="px-4 py-4 space-y-2">
          {navbarItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 hover:bg-muted/50 focus-ring-none hover-scale",
                navLinkClasses(item.href),
                isMenuOpen
                  ? "animate-fade-in-up"
                  : "opacity-0 translate-y-[-10px]",
              )}
              onClick={() => setIsMenuOpen(false)}
              style={{
                animationDelay: isMenuOpen ? `${index * 100}ms` : "0ms",
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};
