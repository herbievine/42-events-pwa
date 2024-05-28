import { createRoute, useLoaderData, redirect } from "@tanstack/react-router";
import { rootRoute } from "../__root";
import { fetcher } from "../../lib/fetcher";
import { z } from "zod";

export const callbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/callback",
  loader: async () => {
    const code = new URLSearchParams(window.location.search).get("code");
    const state = new URLSearchParams(window.location.search).get("state");

    if (!code) {
      throw new Error("No code found");
    }

    const url = new URL(`${import.meta.env.VITE_API_URL}/token`);

    url.searchParams.append("code", code);
    url.searchParams.append("state", state!);

    const { jwt } = await fetcher(
      url.href,
      z.object({
        jwt: z.string(),
      }),
      {
        method: "POST",
      }
    );

    localStorage.setItem("token", jwt);

    throw redirect({
      to: "/",
      search: {
        sort: "created_at",
      },
    });
  },
  component: CallbackPage,
});

function CallbackPage() {
  const data = useLoaderData({
    from: "/auth/callback",
  });

  return (
    <div>
      <h1>Login</h1>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
}
