import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Jorge de la Cruz</title>
        <meta
          name="description"
          content="The requested page could not be found."
        />
      </Helmet>

      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <div className="max-w-lg rounded-[2rem] border border-border/70 bg-card/85 p-8 text-center shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">
            404
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            Page not found
          </h1>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            The route exists in the SPA router, but there is no page matching
            this URL.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link to="/">Back home</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
