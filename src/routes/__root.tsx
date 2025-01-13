import { createRootRoute, Outlet } from "@tanstack/react-router";
import React, { Suspense } from "react";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { DatesProvider } from "@mantine/dates";
import "dayjs/locale/es";

const theme = createTheme({
  /** Put your mantine theme override here */
});

// MUST USE process.env.NODE_ENV in case we are running from demo mode

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        })),
      );

const ReactQueryDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import("@tanstack/react-query-devtools").then((res) => ({
          default: res.ReactQueryDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        })),
      );

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => (
    <MantineProvider theme={theme}>
      <DatesProvider settings={{ locale: "es" }}>
        <QueryClientProvider client={queryClient}>
          <HelmetProvider>
            <Outlet />
            <Suspense>
              <TanStackRouterDevtools />
              <ReactQueryDevtools />
            </Suspense>
          </HelmetProvider>
        </QueryClientProvider>
      </DatesProvider>
    </MantineProvider>
  ),
});
