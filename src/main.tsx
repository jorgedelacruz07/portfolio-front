import "../styles/globals.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  NavLink,
  Outlet,
  RouterProvider,
  createBrowserRouter,
  useLocation,
} from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";

import { reportWebVitals } from "../lib/analytics";
import { queryClient } from "../lib/query-client";

const googleAnalyticsId =
  import.meta.env.VITE_GOOGLE_ANALYTICS_ID ?? "G-4J8T4WP1S7";

let hasInitializedAnalytics = false;
let hasStartedWebVitals = false;

const navigation = [
  { to: "/", label: "Home", end: true },
  { to: "/projects", label: "Projects" },
  { to: "/experiences", label: "Experiences" },
  { to: "/blog", label: "Blog" },
] as const;

function initializeAnalytics() {
  if (hasInitializedAnalytics || typeof window === "undefined") {
    return;
  }

  hasInitializedAnalytics = true;

  const existingScript = document.getElementById("gtag-script");

  if (!existingScript) {
    const script = document.createElement("script");
    script.id = "gtag-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
    document.head.appendChild(script);
  }

  const analyticsWindow = window as Window & { dataLayer?: unknown[][] };
  analyticsWindow.dataLayer = analyticsWindow.dataLayer ?? [];

  if (!window.gtag) {
    window.gtag = ((command, targetId, config) => {
      analyticsWindow.dataLayer?.push([command, targetId, config]);
    }) as Window["gtag"];
  }

  window.gtag("js", new Date());
  window.gtag("config", googleAnalyticsId, {
    page_path: window.location.pathname,
    transport_type: "beacon",
    anonymize_ip: true,
  });
}

function RouteChangeTracker() {
  const location = useLocation();

  useEffect(() => {
    if (!window.gtag) {
      return;
    }

    const pagePath = `${location.pathname}${location.search}${location.hash}`;

    window.gtag("config", googleAnalyticsId, {
      page_path: pagePath,
      transport_type: "beacon",
      anonymize_ip: true,
    });
  }, [location.hash, location.pathname, location.search]);

  return null;
}

type RouteScreenProps = {
  eyebrow: string;
  title: string;
  description: string;
};

function RouteScreen({ eyebrow, title, description }: RouteScreenProps) {
  return (
    <>
      <Helmet>
        <title>{`${title} | Jorge de la Cruz`}</title>
        <meta name="description" content={description} />
      </Helmet>

      <section className="w-full">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-border/60 bg-card/90 p-8 shadow-soft backdrop-blur sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary/80">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            {description}
          </p>
          <p className="mt-8 text-sm leading-7 text-muted-foreground">
            This route is now registered in React Router. The existing Next.js
            page implementation can be migrated into this route in the next
            phase without changing the app bootstrap again.
          </p>
        </div>
      </section>
    </>
  );
}

function AppShell() {
  return (
    <>
      <Helmet>
        <html lang="en" />
        <title>Jorge de la Cruz | Senior Software Engineer</title>
        <meta
          name="description"
          content="Senior Software Engineer specializing in React.js, Next.js, TypeScript, and Node.js. Building scalable web applications since 2016."
        />
        <meta
          name="keywords"
          content="Jorge de la Cruz, Software Engineer, React, TypeScript, Node.js, Web Development"
        />
        <meta name="author" content="Jorge de la Cruz Padilla" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Jorge de la Cruz | Senior Software Engineer"
        />
        <meta
          property="og:description"
          content="Senior Software Engineer specializing in React.js, TypeScript, and Node.js."
        />
        <meta property="og:url" content="https://jorgedelacruzpadilla.dev" />
        <meta
          property="og:image"
          content="https://jorgedelacruzpadilla.dev/images/jorge.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <RouteChangeTracker />

      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary/80">
                Portfolio Migration
              </p>
              <p className="mt-1 text-lg font-semibold tracking-tight">
                Vite + React SPA foundation
              </p>
            </div>

            <nav className="flex flex-wrap items-center gap-2 text-sm">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    [
                      "rounded-full px-4 py-2 transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    ].join(" ")
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>

        <main className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-5xl items-center px-4 py-10 sm:px-6 lg:px-8">
          <Outlet />
        </main>

        <footer className="border-t border-border/60 bg-background/70">
          <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-muted-foreground sm:px-6 lg:px-8">
            Route scaffolding is in place for the previous Next.js URLs. The
            page components can now be migrated incrementally into `src/`
            without revisiting the application bootstrap.
          </div>
        </footer>
      </div>
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: (
          <RouteScreen
            eyebrow="Phase 1"
            title="Home route migrated to the SPA shell"
            description="The global providers from Next.js `_app.tsx` now live at the Vite entry point. This keeps routing, head management, analytics bootstrapping, and React Query centralized for the rest of the migration."
          />
        ),
      },
      {
        path: "projects",
        element: (
          <RouteScreen
            eyebrow="Projects"
            title="Projects index route registered"
            description="This route mirrors the original `/projects` URL and is ready for the existing portfolio list page to be migrated into React Router."
          />
        ),
      },
      {
        path: "projects/:slug",
        element: (
          <RouteScreen
            eyebrow="Projects"
            title="Project detail route registered"
            description="Dynamic project pages will now map to `/projects/:slug` in React Router once the Next.js detail view is converted."
          />
        ),
      },
      {
        path: "experiences",
        element: (
          <RouteScreen
            eyebrow="Experiences"
            title="Experiences index route registered"
            description="This route mirrors the original `/experiences` page and provides the permanent SPA destination for the migrated experience listing."
          />
        ),
      },
      {
        path: "experiences/:slug",
        element: (
          <RouteScreen
            eyebrow="Experiences"
            title="Experience detail route registered"
            description="Dynamic experience detail pages can now move from the Pages Router to React Router without changing the URL contract."
          />
        ),
      },
      {
        path: "blog",
        element: (
          <RouteScreen
            eyebrow="Blog"
            title="Blog index route registered"
            description="The `/blog` destination now exists in the SPA route table and is ready for the migrated article listing implementation."
          />
        ),
      },
      {
        path: "blog/:slug",
        element: (
          <RouteScreen
            eyebrow="Blog"
            title="Blog detail route registered"
            description="Individual blog posts will continue to resolve under `/blog/:slug` after the Next.js page is rewritten for the Vite SPA."
          />
        ),
      },
      {
        path: "*",
        element: (
          <RouteScreen
            eyebrow="404"
            title="Page not found"
            description="This fallback route replaces Next.js automatic page matching with an explicit React Router catch-all."
          />
        ),
      },
    ],
  },
]);

function App() {
  useEffect(() => {
    if (!hasStartedWebVitals) {
      reportWebVitals();
      hasStartedWebVitals = true;
    }

    initializeAnalytics();
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
