import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  redirect,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { authClient } from "@/lib/auth-client";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { NotFound } from "@/components/not-found";

interface MyRouterContext {
  queryClient: QueryClient;
}

const getSession = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await authClient.getSession({
    fetchOptions: { headers: getRequestHeaders() },
  });
  return data;
});

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Linkdrop",
        name: "description",
        content:
          "Save and organize your links with automatic metadata fetching, categories, and tags",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
  beforeLoad: async ({ location }) => {
    const session = await getSession();

    // Check if the current route is an auth route
    const isAuthRoute = location.pathname.startsWith("/login");

    // If not authenticated and not on an auth route, redirect to login
    if (!session && !isAuthRoute) {
      throw redirect({ to: "/login" });
    }

    // If authenticated and on login page, redirect to home
    if (session && isAuthRoute) {
      throw redirect({ to: "/" });
    }

    return { user: session?.user!, session: session?.session! };
  },
  notFoundComponent: NotFound,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <Providers>
          {children}
          <Toaster richColors className="font-sans" />
        </Providers>
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
