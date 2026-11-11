import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState, PageContainer } from "@/components/ui/page";
import { profileFallback } from "@/lib/profile-fallback";

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Jorge de la Cruz</title>
        <meta name="description" content="This page is not on the site. Jorge de la Cruz is." />
        <meta name="robots" content="noindex" />
      </Helmet>

      <PageContainer>
        <EmptyState heading="h1" title="Page not found" description="This endpoint doesn't exist... but I do.">
          <Button asChild>
            <a href={profileFallback.resumeUrl} download>
              <Download className="mr-2 h-4 w-4" aria-hidden="true" />
              Download CV
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={`mailto:${profileFallback.contactEmail}`}>Get in touch</a>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Back home</Link>
          </Button>
        </EmptyState>
      </PageContainer>
    </>
  );
}
