import {
  type ComponentType,
  type LazyExoticComponent,
  Suspense,
  lazy,
  useEffect,
} from "react";
import { Helmet } from "react-helmet-async";
import { Outlet, createBrowserRouter, useLocation } from "react-router-dom";

import { Layout } from "@/components/Layout";
import { PageLoader } from "@/components/LoadingSpinner";

type LazyRouteComponent = LazyExoticComponent<ComponentType>;

const HomePage = lazy(() => import("./routes/HomePage"));
const ProjectsPage = lazy(() => import("./routes/ProjectsPage"));
const ProjectDetailPage = lazy(() => import("./routes/ProjectDetailPage"));
const ExperiencesPage = lazy(() => import("./routes/ExperiencesPage"));
const ExperienceDetailPage = lazy(
  () => import("./routes/ExperienceDetailPage"),
);
const BlogPage = lazy(() => import("./routes/BlogPage"));
const BlogPostPage = lazy(() => import("./routes/BlogPostPage"));
const NotFoundPage = lazy(() => import("./routes/NotFoundPage"));

const googleAnalyticsId = import.meta.env.VITE_GA_ID;

function renderLazyRoute(Page: LazyRouteComponent) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Page />
    </Suspense>
  );
}

function RouteChangeTracker() {
  const location = useLocation();

  useEffect(() => {
    const isInvalidId =
      !googleAnalyticsId ||
      googleAnalyticsId === "undefined" ||
      googleAnalyticsId === "";

    if (
      typeof window === "undefined" ||
      !window.gtag ||
      isInvalidId
    ) {
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

function PublicLayout() {
  return (
    <>
      <Helmet>
        <html lang="en" />
      </Helmet>
      <RouteChangeTracker />
      <Layout>
        <Outlet />
      </Layout>
    </>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: renderLazyRoute(HomePage),
      },
      {
        path: "projects",
        element: renderLazyRoute(ProjectsPage),
      },
      {
        path: "projects/:slug",
        element: renderLazyRoute(ProjectDetailPage),
      },
      {
        path: "experiences",
        element: renderLazyRoute(ExperiencesPage),
      },
      {
        path: "experiences/:slug",
        element: renderLazyRoute(ExperienceDetailPage),
      },
      {
        path: "blog",
        element: renderLazyRoute(BlogPage),
      },
      {
        path: "blog/:slug",
        element: renderLazyRoute(BlogPostPage),
      },
      {
        path: "*",
        element: renderLazyRoute(NotFoundPage),
      },
    ],
  },
]);
