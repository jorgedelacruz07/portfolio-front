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

import HomePage from "./routes/HomePage";

const ProjectsPage = lazy(() => import("./routes/ProjectsPage"));
const ExperiencesPage = lazy(() => import("./routes/ExperiencesPage"));
const AdminPage = lazy(() => import("./routes/AdminPage"));
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

    if (typeof window === "undefined" || !window.gtag || isInvalidId) {
      return;
    }

    const pagePath = `${location.pathname}${location.search}${location.hash}`;

    window.gtag("event", "page_view", {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
      send_to: googleAnalyticsId,
      transport_type: "beacon",
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
        element: <HomePage />,
      },
      {
        path: "projects",
        element: renderLazyRoute(ProjectsPage),
      },
      {
        path: "experiences",
        element: renderLazyRoute(ExperiencesPage),
      },
      {
        path: "admin",
        element: renderLazyRoute(AdminPage),
      },
      {
        path: "*",
        element: renderLazyRoute(NotFoundPage),
      },
    ],
  },
]);
