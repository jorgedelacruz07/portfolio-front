import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { profileFallback } from "@/lib/profile-fallback";

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Jorge de la Cruz</title>
        <meta name="description" content="This page is not on the site. Jorge de la Cruz is." />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="mx-auto w-full max-w-xl py-6 sm:py-10">
        <div className="rounded-[2rem] border border-border/70 bg-card/85 p-6 text-center shadow-soft sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">404</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">Page not found</h1>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">This endpoint doesn't exist... but I do.</p>
          <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button asChild>
              <a href={profileFallback.resumeUrl} download className="inline-flex items-center gap-2 font-mono text-xs">
                <Download className="h-4 w-4" aria-hidden="true" />
                Download CV
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={`mailto:${profileFallback.contactEmail}`} className="font-mono text-xs">
                Get in touch
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link to="/" className="font-mono text-xs">
                Back home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
