import { createRouter } from "@tanstack/react-router";
import { rootRoute } from "./pages/__root";
import { indexRoute } from "./pages/index";
import { loginRoute } from "./pages/login";
import { callbackRoute } from "./pages/auth/callback";

const routeTree = rootRoute.addChildren([
	indexRoute,
	loginRoute,
	callbackRoute
]);

export const router = createRouter({ routeTree, defaultPreload: "intent" });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
