import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { FortyTwoIcon } from "../assets/42";

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  loader: async () => {
    if (localStorage.getItem("token")) {
      redirect({
        to: "/",
        search: {
          sort: "created_at",
        },
      });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  function loginLink() {
    const url = new URL("https://api.intra.42.fr/oauth/authorize");

    const state = Math.random().toString(36).substring(7);

    url.searchParams.append(
      "client_id",
      import.meta.env.VITE_FORTY_TWO_API_CLIENT
    );
    url.searchParams.append(
      "redirect_uri",
      `${import.meta.env.VITE_BASE_URL}/auth/callback`
    );
    url.searchParams.append("scope", "public");
    url.searchParams.append("state", state);
    url.searchParams.append("response_type", "code");

    return url.href;
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center space-y-4">
      <FortyTwoIcon className="w-12" />
      <a className="text-sm font-semibold text-neutral-700" href={loginLink()}>
        Login with your 42 account
      </a>
    </div>
  );
}
