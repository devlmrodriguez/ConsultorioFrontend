import { createRootRoute, Outlet } from "@tanstack/react-router";
import React from "react";
import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";

const theme = createTheme({
  /** Put your mantine theme override here */
});

const TanStackRouterDevtools =
  import.meta.env.MODE === "production"
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
  import.meta.env.MODE === "production"
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
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <Outlet />
          <TanStackRouterDevtools />
          <ReactQueryDevtools />
        </HelmetProvider>
      </QueryClientProvider>
    </MantineProvider>
  ),
});
