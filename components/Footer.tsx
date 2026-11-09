import { Link } from "react-router-dom";

import { socialNetworks } from "./SocialNetworks";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Experiences", href: "/experiences" },
    { label: "Articles", href: "/articles" },
  ];

  return (
    <footer className="border-t border-border py-10 text-sm text-muted-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              Jorge de la Cruz
            </p>
            <p>Senior Software Engineer. Lima, Peru.</p>
          </div>

          <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Footer">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {socialNetworks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Icon width={16} height={16} />
                </a>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} Jorge de la Cruz Padilla. All rights reserved.</p>
          <p>Available for select engineering opportunities</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
