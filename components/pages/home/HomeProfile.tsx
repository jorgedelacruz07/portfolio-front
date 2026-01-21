import { FC, memo, useCallback } from "react";
import Image from "next/image";
import { profile } from "../../../data/content";
import { SocialNetworks } from "../../../components/SocialNetworks";
import { DownloadIcon } from "../../icons/DownloadIcon";
import { Button } from "@/components/ui/button";
import classNames from "classnames";
import { useScrollAnimation } from "@/hooks";

const HomeProfileComponent: FC = () => {
  const { ref: profileRef } = useScrollAnimation({ threshold: 0.2 });
  const { ref: textRef, isVisible: textVisible } = useScrollAnimation({
    threshold: 0.3,
  });
  const { ref: imageRef, isVisible: imageVisible } = useScrollAnimation({
    threshold: 0.2,
  });

  const handleDownloadClick = useCallback(() => {
    // Track download event if analytics is available
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "download", {
        event_category: "CV",
        event_label: "Jorge de la Cruz CV",
      });
    }
  }, []);

  const name = "Jorge de la Cruz";

  return (
    <div
      ref={profileRef}
      className="min-h-[60vh] flex items-center justify-center py-8 md:py-12 relative"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div
            ref={textRef}
            className={classNames(
              "space-y-6 lg:space-y-8 transition-all duration-1000",
              textVisible
                ? "animate-fade-in-left"
                : "opacity-0 translate-x-[-30px]",
            )}
          >
            <div className="space-y-3 lg:space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground animate-fade-in-down">
                Hello.
              </h1>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground animate-fade-in-up animate-stagger-1">
                I&apos;m{" "}
                <span className="relative inline-block">
                  <span className="text-primary gradient-text relative z-10">
                    {name}
                  </span>
                  <span
                    className="text-primary gradient-text-alt absolute inset-0 animate-gradient-layer z-20"
                    aria-hidden="true"
                  >
                    {name}
                  </span>
                </span>
              </h2>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground animate-fade-in-up animate-stagger-2">
                Senior Software Engineer
              </h3>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 animate-fade-in-up animate-stagger-3">
              <Button
                size="lg"
                className="px-6 lg:px-8 py-2.5 lg:py-3 text-sm lg:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 focus-ring-none btn-hover hover-glow group"
                onClick={handleDownloadClick}
                asChild
              >
                <a
                  href="/documents/jorgedelacruz_cv.pdf"
                  download
                  className="flex items-center"
                >
                  <DownloadIcon className="w-4 h-4 lg:w-5 lg:h-5 mr-2 group-hover:animate-bounce" />
                  Download CV
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-6 lg:px-8 py-2.5 lg:py-3 text-sm lg:text-base font-semibold border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 focus-ring-none btn-hover hover-scale"
                asChild
              >
                <a href="mailto:jdelacruzp7@gmail.com">Contact Me</a>
              </Button>
            </div>

            <div className="pt-2 lg:pt-4 animate-fade-in-up animate-stagger-4">
              <SocialNetworks />
            </div>
          </div>

          {/* Right Content - Profile Image with Programmer Theme */}
          <div
            ref={imageRef}
            className={classNames(
              "flex justify-center lg:justify-end transition-all duration-1000",
              imageVisible
                ? "animate-fade-in-right"
                : "opacity-0 translate-x-[30px]",
            )}
          >
            <div className="relative group">
              {/* Enhanced code-themed decorative elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-2 border-primary/30 rounded rotate-45 animate-glow-pulse"></div>
              <div className="absolute -top-2 -right-6 w-6 h-6 border-2 border-primary/20 rounded-full animate-float"></div>
              <div
                className="absolute -bottom-4 -right-4 w-10 h-10 border-2 border-primary/25 rounded rotate-12 animate-glow-pulse"
                style={{ animationDelay: "1s" }}
              ></div>

              {/* Floating code symbols with enhanced animations */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-primary/40 font-mono text-sm animate-float">
                {"</>"}
              </div>
              <div
                className="absolute -bottom-8 left-1/4 text-primary/30 font-mono text-xs animate-float-slow"
                style={{ animationDelay: "0.5s" }}
              >
                {"{}"}
              </div>
              <div
                className="absolute -bottom-6 right-1/4 text-primary/35 font-mono text-xs animate-float-reverse"
                style={{ animationDelay: "1.5s" }}
              >
                {"[]"}
              </div>

              {/* Main profile image container */}
              <div className="relative z-10">
                <div className="relative group-hover:scale-105 transition-transform duration-500">
                  {/* Enhanced terminal-style frame */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-full blur-xl animate-glow"></div>

                  {/* Profile image with enhanced effects - LCP element */}
                  <div className="w-48 h-48 lg:w-56 lg:h-56 ring-4 ring-primary/20 shadow-2xl relative z-10 hover-lift animate-scale-in rounded-full overflow-hidden">
                    <Image
                      src={profile.image}
                      alt={profile.name}
                      width={224}
                      height={224}
                      className="object-cover w-full h-full"
                      priority
                      fetchPriority="high"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>

                  {/* Enhanced code brackets around image */}
                  <div className="absolute -top-2 -left-2 text-primary/60 font-mono text-lg lg:text-xl font-bold animate-rotate-in">
                    {"<"}
                  </div>
                  <div
                    className="absolute -top-2 -right-2 text-primary/60 font-mono text-lg lg:text-xl font-bold animate-rotate-in"
                    style={{ animationDelay: "0.2s" }}
                  >
                    {">"}
                  </div>
                  <div
                    className="absolute -bottom-2 -left-2 text-primary/60 font-mono text-lg lg:text-xl font-bold animate-rotate-in"
                    style={{ animationDelay: "0.4s" }}
                  >
                    {"{"}
                  </div>
                  <div
                    className="absolute -bottom-2 -right-2 text-primary/60 font-mono text-lg lg:text-xl font-bold animate-rotate-in"
                    style={{ animationDelay: "0.6s" }}
                  >
                    {"}"}
                  </div>
                </div>
              </div>

              {/* Enhanced animated connection lines */}
              <div className="absolute top-1/2 -left-8 w-6 h-0.5 bg-primary/30 animate-glow-pulse"></div>
              <div
                className="absolute top-1/2 -right-8 w-6 h-0.5 bg-primary/30 animate-glow-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <div
                className="absolute top-1/4 -left-6 w-4 h-0.5 bg-primary/25 animate-glow-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className="absolute top-3/4 -right-6 w-4 h-0.5 bg-primary/25 animate-glow-pulse"
                style={{ animationDelay: "1.5s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

HomeProfileComponent.displayName = "HomeProfile";
export const HomeProfile = memo(HomeProfileComponent);
