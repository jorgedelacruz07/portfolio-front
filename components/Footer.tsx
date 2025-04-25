import classNames from "classnames";
import Link from "next/link";
import { socialNetworks } from "./SocialNetworks";

const Footer = () => {
  const socialLinkClasses = classNames(
    "text-white/80 hover:text-white",
    "transition-all duration-300",
    "flex items-center space-x-2"
  );

  const sectionTitleClasses = classNames(
    "text-white text-lg font-bold mb-4",
    "flex items-center"
  );

  return (
    <footer className="bg-slate-800 dark:bg-slate-900 shadow-lg border-t border-slate-700/50">
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className={sectionTitleClasses}>
              <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
              About
            </h3>
            <p className="text-white/80 leading-relaxed">
              A passionate developer showcasing projects, experiences, and
              thoughts on technology.
            </p>
          </div>
          <div>
            <h3 className={sectionTitleClasses}>
              <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
              Quick Links
            </h3>
            <ul className="space-y-3 text-white/80">
              <li>
                <Link href="/projects">Projects</Link>
              </li>
              <li>
                <Link href="/experiences">Experiences</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className={sectionTitleClasses}>
              <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
              Connect
            </h3>
            <ul className="space-y-3 text-white/80">
              {socialNetworks.map((social) => {
                const Icon = social.icon;

                return (
                  <li key={social.id}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={socialLinkClasses}
                    >
                      <Icon width={20} height={20} />
                      <span>{social.name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-700/50">
          <p className="text-center text-white/80">
            © {new Date().getFullYear()} Jorge de la Cruz. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
