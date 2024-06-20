import { createRoute, useSearch } from "@tanstack/react-router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../lib/fetcher";
import { z } from "zod";
import { eventSchemaWithRead } from "../../schema/event";
import { Loading } from "../../components/loading";
import { Sort } from "../../components/events/sort";
import { Card } from "../../components/events/card";
import { feedLayout } from "./_layout";

dayjs.extend(relativeTime);

const feedSearchParamsSchema = z.object({
  sort: z.enum(["created_at", "begin_at"]).catch("created_at"),
});

export const feedRoute = createRoute({
  getParentRoute: () => feedLayout,
  path: "/",
  component: FeedPage,
  pendingComponent: () => <Loading className="h-screen" />,
  validateSearch: feedSearchParamsSchema,
});

function FeedPage() {
  const search = useSearch({
    from: "/feed/",
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

  if (!isLoading && events && events.length >= 0) {
    return (
      <div className="flex flex-col">
        <div className="py-2 px-4 flex justify-between items-center border-b border-neutral-300">
          <h2 className="font-semibold text-sm text-neutral-700">
            {search.sort === "created_at" ? "New events" : "Upcoming events"} (
            {
              events.filter(
                (event) => search.sort !== "created_at" || !event.has_read
              ).length
            }
            )
          </h2>
          <Sort />
        </div>
        <div className="flex flex-col divide-y divide-neutral-300">
          {events
            .filter((event) => search.sort !== "created_at" || !event.has_read)
            .map((event) => (
              <div key={event.event_id} className="p-4">
                <Card event={event} />
              </div>
            ))}
          {search.sort === "created_at" &&
            events
              .filter((event) => event.has_read)
              .map((event) => (
                <div key={event.event_id} className="p-4">
                  <Card event={event} classname="opacity-60" />
                </div>
              ))}
        </div>
      </div>
    );
  }

  return <Loading className="h-[calc(100vh_-_16rem)]" />;
}
