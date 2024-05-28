import {
  createRoute,
  redirect,
  useLoaderData,
  useSearch,
} from "@tanstack/react-router";
import { rootRoute } from "./__root";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../lib/fetcher";
import { z } from "zod";
import { eventSchemaWithRead } from "../schema/event";
import { userSchema } from "../schema/user";
import { Loading } from "../components/loading";
import { Sort } from "../components/events/sort";
import { Card } from "../components/events/card";

dayjs.extend(relativeTime);

const searchParamsSchema = z.object({
  sort: z.enum(["created_at", "begin_at"]).catch("created_at"),
});

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: IndexPage,
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
  validateSearch: searchParamsSchema,
});

function IndexPage() {
  const { user } = useLoaderData({
    from: "/",
  });
  const search = useSearch({
    from: "/",
  });

  const { data: events, isLoading } = useQuery({
    queryKey: ["notifications", search.sort],
    queryFn: async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found");
      }

      return fetcher(
        `${import.meta.env.VITE_API_URL}/notifications?sort=${search.sort}`,
        z.array(eventSchemaWithRead),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
  });

  return (
    <>
      <div className="sticky h-16 top-0 left-0 flex justify-center items-center border-b border-neutral-300 backdrop-blur-sm z-50">
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
      {!isLoading && events && events.length >= 0 ? (
        <div className="p-4 mx-auto w-full max-w-5xl flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-sm text-neutral-700">
              {search.sort === "created_at" ? "New events" : "Upcoming events"}{" "}
              (
              {
                events.filter(
                  (event) => search.sort !== "created_at" || !event.has_read
                ).length
              }
              )
            </h2>
            <Sort />
          </div>
          {events
            .filter((event) => search.sort !== "created_at" || !event.has_read)
            .map((event) => (
              <Card key={event.event_id} event={event} />
            ))}
          {search.sort === "created_at" &&
            events
              .filter((event) => event.has_read)
              .map((event) => (
                <Card
                  key={event.event_id}
                  event={event}
                  classname="opacity-60"
                />
              ))}
        </div>
      ) : (
        <Loading className="h-[100vh_-_16rem]" />
      )}
    </>
  );
}
