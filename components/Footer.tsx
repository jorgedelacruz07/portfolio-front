import { cn } from "@/lib/utils";
import { socialNetworks } from "./SocialNetworks";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Projects", href: "/projects" },
    { label: "Experiences", href: "/experiences" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/#about" },
  ];

  const technologies = [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "MongoDB",
    "Tailwind CSS",
  ];

  return (
    <footer className="bg-muted/20 border-t border-border/40 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 border border-primary/20 rounded rotate-45"></div>
        <div className="absolute top-20 right-20 w-16 h-16 border border-primary/15 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 border border-primary/25 rounded rotate-12"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border border-primary/20 rounded rotate-45"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main footer content */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-mono font-bold text-sm">
                      {"</>"}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    Jorge de la Cruz
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Senior Software Engineer crafting digital experiences with
                  modern technologies and clean code.
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-muted-foreground font-mono">
                    Available for work
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <span className="w-1 h-4 bg-primary mr-2"></span>
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Button
                      variant="ghost"
                      className="p-0 h-auto text-muted-foreground hover:text-primary transition-colors duration-200 focus-ring-none link-hover"
                      asChild
                    >
                      <Link href={link.href}>{link.label}</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technologies */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <span className="w-1 h-4 bg-primary mr-2"></span>
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="text-xs font-medium bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Contact & Social */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <span className="w-1 h-4 bg-primary mr-2"></span>
                Connect
              </h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  {socialNetworks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <Button
                        key={social.id}
                        variant="ghost"
                        size="sm"
                        className="p-2 h-auto text-muted-foreground hover:text-primary transition-colors duration-200 focus-ring-none btn-hover"
                        asChild
                      >
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.name}
                        >
                          <Icon width={20} height={20} />
                        </a>
                      </Button>
                    );
                  })}
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Let&apos;s build something amazing together</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="py-6 border-t border-border/40">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              <p>© {currentYear} Jorge de la Cruz. All rights reserved.</p>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className="font-mono">Built with</span>
              <div className="flex items-center space-x-1">
                <span className="text-red-500">♥</span>
                <span>and</span>
                <span className="text-primary font-mono">{"<code>"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
