import {
  Outlet,
  createRoute,
  redirect,
  useLoaderData,
} from "@tanstack/react-router";
import { rootRoute } from "../__root";
import { fetcher } from "../../lib/fetcher";
import { userSchema } from "../../schema/user";
import { Loading } from "../../components/loading";

export const feedLayout = createRoute({
  getParentRoute: () => rootRoute,
  path: "/feed",
  component: FeedLayout,
  loader: async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw redirect({
        to: "/login",
      });
    }

    try {
      const user = await fetcher(
        `${import.meta.env.VITE_API_URL}/me`,
        userSchema,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        user,
      };
    } catch (error) {
      throw redirect({
        to: "/login",
      });
    }
  },
  pendingComponent: () => <Loading className="h-screen" />,
});

function FeedLayout() {
  const { user } = useLoaderData({
    from: "/feed",
  });

  return (
    <div className="flex flex-col items-center">
      <div className="w-full sticky h-16 top-0 left-0 flex justify-center items-center border-b border-neutral-300 backdrop-blur-sm z-50">
        <div className="px-4 mx-auto max-w-5xl w-full flex justify-between items-center">
          <h1 className="text-lg font-black">42 Events</h1>
          <div className="flex space-x-4 items-center">
            <span className="font-semibold">{user.login}</span>
            <img
              src={user.image_url}
              alt={`${user.login}'s profile picture`}
              className="w-10 rounded-lg"
            />
          </div>
        </div>
      </div>
      <div className="max-w-5xl w-full lg:border-x border-neutral-300">
        <main>
          <Outlet />
        </main>
        <div className="py-4 w-full flex justify-center items-center border-t border-neutral-300">
          <span className="font-semibold text-xs text-neutral-600">
            Made with ☕️ by{" "}
            <a
              href="https://herbievine.com?ref=42events"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Herbie Vine
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
