import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState, PageContainer } from "@/components/ui/page";
import { profileFallback } from "@/lib/profile-fallback";
import { useSiteContent } from "@/hooks";
import { safeHref } from "@/lib/safe-href";

export default function NotFoundPage() {
  const { copy, profile } = useSiteContent();
  const resumeUrl = safeHref(profile?.resumeUrl, { sameOriginPath: true }) || profileFallback.resumeUrl;
  const contactEmail = profile?.contactEmail || profileFallback.contactEmail;
  return (
    <>
      <Helmet>
        <title>
          {copy["notFound.title"]} | {copy["layout.siteName"]}
        </title>
        <meta name="description" content={copy["notFound.description"]} />
        <meta name="robots" content="noindex" />
      </Helmet>

      <PageContainer>
        <EmptyState heading="h1" title={copy["notFound.title"]} description={copy["notFound.description"]}>
          <Button asChild>
            <a href={resumeUrl} download>
              <Download className="mr-2 h-4 w-4" aria-hidden="true" />
              {copy["nav.resume"]}
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={`mailto:${contactEmail}`}>{copy["notFound.contact"]}</a>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">{copy["notFound.backHome"]}</Link>
          </Button>
        </EmptyState>
      </PageContainer>
    </>
  );
}
