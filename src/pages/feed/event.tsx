import { createRoute, useParams, useSearch } from "@tanstack/react-router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../lib/fetcher";
import { z } from "zod";
import { eventSchema } from "../../schema/event";
import { Loading } from "../../components/loading";
import { Sort } from "../../components/events/sort";
import { Card } from "../../components/events/card";
import { feedLayout } from "./_layout";

dayjs.extend(relativeTime);

export const eventRoute = createRoute({
  getParentRoute: () => feedLayout,
  path: "/$eventId",
  component: EventPage,
});

function EventPage() {
  const { eventId } = useParams({
    from: "/feed/$eventId",
  });

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found");
      }

      return fetcher(
        `${import.meta.env.VITE_API_URL}/events/${eventId}`,
        eventSchema,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
  });

  if (isLoading || !event) {
    return <Loading className="h-[calc(100vh_-_4rem_-_49px)]" />;
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center">
        <div className="w-full flex justify-between items-center">
          <span className="font-semibold whitespace-nowrap">{event.name}</span>
          {/* <span className="text-neutral-500"> - </span> */}
          <div className="flex items-center space-x-2">
            {/* <span className="text-xs font-semibold whitespace-nowrap text-neutral-500">
              {search.sort === "created_at"
                ? `${dayjs(event.created_at).fromNow()}`
                : `${dayjs(event.begin_at).fromNow()}`}
            </span> */}
            {/* <button
              type="button"
              onClick={() => mutate()}
              className="w-full px-3 py-1 flex items-center justify-start space-x-2 rounded-md border border-neutral-300 hover:border-neutral-400 transition-colors duration-300"
            >
              <span className="font-semibold text-sm text-neutral-700">
                Mark as {event.has_read ? "unread" : "read"}
              </span>
              {event.has_read ? (
                <EyeIcon className="w-4 h-4 fill-neutral-700" />
              ) : (
                <EyeSlashIcon className="w-4 h-4 fill-neutral-700" />
              )}
            </button> */}
          </div>
        </div>
      </div>
      {/* <p className="text-sm line-clamp-[10] whitespace-pre-wrap">
        {trim(event.description).join("\n")}
      </p> */}
    </div>
  );
}
