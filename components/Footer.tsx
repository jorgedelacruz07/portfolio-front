import { Link } from "react-router-dom";
import { ArrowUpRight, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SocialNetworks } from "@/components/SocialNetworks";
import { profileFallback } from "@/lib/profile-fallback";
import { mailtoHref } from "@/lib/safe-href";
import { safeHref } from "@/lib/safe-href";
import { useSiteContent } from "@/hooks";

const Footer = () => {
  const { copy, profile, settings } = useSiteContent();
  const currentYear = new Date().getFullYear();
  const currentProfileName = profile?.name || profileFallback.name;
  const contactHref = mailtoHref(settings?.contactEmail || profile?.contactEmail || profileFallback.contactEmail);
  const resumeUrl = safeHref(profile?.resumeUrl, { sameOriginPath: true }) || profileFallback.resumeUrl;
  const navLinks = [
    { label: copy["nav.home"], href: "/" },
    { label: copy["nav.projects"], href: "/projects" },
    { label: copy["nav.experiences"], href: "/experiences" },
    { label: copy["nav.articles"], href: "/articles" },
  ];

  return (
    <footer className="mt-6 border-t border-border/80">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <section className="flex flex-col gap-6 border-b border-border/80 py-8 sm:py-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="mono-label flex items-center gap-3 text-primary">
              <span className="h-px w-8 bg-primary/40" aria-hidden="true" />
              {copy["footer.eyebrow"]}
            </p>
            <h2 className="text-2xl font-semibold leading-[1.1] text-foreground sm:text-4xl">{copy["footer.title"]}</h2>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {copy["footer.description"]}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {contactHref ? (
              <Button asChild>
                <a href={contactHref}>
                  {copy["footer.contact"]}
                  <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            ) : null}
            <Button variant="outline" asChild>
              <a href={resumeUrl} download>
                <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                {copy["footer.resume"]}
              </a>
            </Button>
          </div>
        </section>

        <div className="grid gap-6 py-6 sm:py-10 md:grid-cols-[1.3fr_1fr_auto]">
          <div className="space-y-2">
            <p className="text-sm font-semibold tracking-tight text-foreground">{currentProfileName}</p>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {copy["footer.profileDescription"]}
            </p>
          </div>

          <nav className="flex flex-wrap content-start gap-x-5 gap-y-2" aria-label={copy["footer.navLabel"]}>
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

          <SocialNetworks links={profile?.socialLinks} variant="footer" ariaLabelTemplate={copy["social.ariaLabel"]} />
        </div>

        <div className="flex flex-col gap-2 border-t border-border/80 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} {settings?.footerText || `${currentProfileName}. All rights reserved.`}
          </p>
          <p className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            {settings?.availabilityText || "Available for select engineering opportunities"}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
