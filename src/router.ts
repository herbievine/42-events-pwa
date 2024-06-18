import { createRouter } from "@tanstack/react-router";
import { rootRoute } from "./pages/__root";
import { indexRoute } from "./pages/index";
import { loginRoute } from "./pages/login";
import { feedRoute } from "./pages/feed/index";
import { feedLayout } from "./pages/feed/_layout";
import { callbackRoute } from "./pages/auth/callback";
import { eventRoute } from "./pages/feed/event";

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  // feedRoute,
  feedLayout.addChildren([feedRoute, eventRoute]),
  callbackRoute,
]);

export const router = createRouter({ routeTree, defaultPreload: "intent" });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
