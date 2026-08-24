import { socialNetworks } from "./SocialNetworks";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Experiences", href: "/experiences" },
  ];

  return (
    <footer className="border-t border-border/80 bg-background/50 py-12 text-sm text-muted-foreground">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold text-foreground">
                Jorge de la Cruz
              </span>
              <span className="text-border">•</span>
              <span className="font-mono text-xs">Lima, PE (UTC-5)</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Senior Software Engineer — React, TypeScript, Node.js & Cloud
              Systems.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <nav className="flex items-center gap-4 text-xs font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3 border-l border-border/80 pl-6">
              {socialNetworks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Icon width={16} height={16} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {currentYear} Jorge de la Cruz Padilla. All rights reserved.</p>
          <div className="flex items-center gap-2 font-mono text-[0.6875rem]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Available for select engineering opportunities</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
