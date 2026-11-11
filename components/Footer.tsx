import { Link } from "react-router-dom";
import { ArrowUpRight, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { profileFallback } from "@/lib/profile-fallback";
import { mailtoHref } from "@/lib/safe-href";
import { socialNetworks } from "./SocialNetworks";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const contactHref = mailtoHref(profileFallback.contactEmail);
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Experiences", href: "/experiences" },
    { label: "Articles", href: "/articles" },
  ];

  return (
    <footer className="mt-6 border-t border-border/80">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <section className="flex flex-col gap-6 border-b border-border/80 py-8 sm:py-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="mono-label flex items-center gap-3 text-primary">
              <span className="h-px w-8 bg-primary/40" aria-hidden="true" />
              Open to select roles
            </p>
            <h2 className="text-2xl font-semibold leading-[1.1] text-foreground sm:text-4xl">
              Let&apos;s build something reliable.
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              I partner with teams that care about product quality, performance, and shipping software that holds up.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {contactHref ? (
              <Button asChild>
                <a href={contactHref}>
                  Start a conversation
                  <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            ) : null}
            <Button variant="outline" asChild>
              <a href={profileFallback.resumeUrl} download>
                <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                Download CV
              </a>
            </Button>
          </div>
        </section>

        <div className="grid gap-6 py-6 sm:py-10 md:grid-cols-[1.3fr_1fr_auto]">
          <div className="space-y-2">
            <p className="text-sm font-semibold tracking-tight text-foreground">Jorge de la Cruz Padilla</p>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Senior Software Engineer. Lima, Peru. Building full-stack products with React, Node, and cloud delivery.
            </p>
          </div>

          <nav className="flex flex-wrap content-start gap-x-5 gap-y-2" aria-label="Footer">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-start gap-3">
            {socialNetworks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
                >
                  <Icon width={16} height={16} />
                </a>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-border/80 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} Jorge de la Cruz Padilla. All rights reserved.</p>
          <p className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            Available for select engineering opportunities
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
